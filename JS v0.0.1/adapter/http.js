'use strict';

import { IncomingMessage } from 'http';
import { URL } from 'url';
import { isFormData, isBlob, isBuffer, isString } from '../utils.js';
import stream from 'stream';
import { VERSION } from '../assets/VERSION.js';
import FormData from "form-data";

class HttpError extends Error {
    constructor(message, status, response) {
        super(message);
        this.name = "HttpError";
        this.status = status;
        this.response = response;
    }
}

class TimeoutError extends Error {
    constructor(timeout) {
        super(`Request timed out after ${timeout}ms`);
        this.name = "TimeoutError";
        this.timeout = timeout;
    }
}

class NetworkError extends Error {
    constructor(message) {
        super(message);
        this.name = "NetworkError";
    }
}

function handleReq(config) {
    let data = config.data;
    
    if (isFormData(data)) {
        const formData = new FormData();
        for (let [key, value] of Object.entries(data)) {
            formData.append(key, value);
        }
        config.headers = { ...config.headers, ...formData.getHeaders() };
        return formData;
    } else if (isBlob(data) || isBuffer(data)) {
        return stream.Readable.from(data);
    } else if (isString(data)) {
        return Buffer.from(data, 'utf8');
    }
    return data;
}

const middlewares = [];

export function use(middleware) {
    middlewares.push(middleware);
}

async function runMiddlewares(config) {
    for (let middleware of middlewares) {
        await middleware(config);
    }
}

function setHeaders(config, headers) {
    headers.set('User-Agent', `ladybug/${VERSION}`);

    if (config.auth) {
        const { username, password } = config.auth;
        headers.set('Authorization', `Basic ${Buffer.from(username + ':' + password).toString('base64')}`);
    }

    if (config.headers) {
        Object.entries(config.headers).forEach(([key, val]) => headers.set(key, val));
    }

    if (!headers.has('Content-Type')) {
        if (isFormData(config.data)) headers.set('Content-Type', 'multipart/form-data');
        else if (isString(config.data)) headers.set('Content-Type', 'text/plain');
        else if (isBuffer(config.data) || isBlob(config.data)) headers.set('Content-Type', 'application/octet-stream');
        else if (typeof config.data === 'object') headers.set('Content-Type', 'application/json');
    }
}

async function retryWithBackoff(config, retries = 3, delay = 1000) {
    for (let i = 0; i < retries; i++) {
        try {
            return await httpAdapterInternal(config); 
        } catch (error) {
            if (i === retries - 1 || !(error instanceof NetworkError)) throw error;
            await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i))); 
        }
    }
}


async function httpAdapterInternal(config) {
    return new Promise(async (resolve, reject) => {
        await runMiddlewares(config);

        const parsedUrl = new URL(config.url);
        const isHttps = parsedUrl.protocol === 'https:';
        const transport = isHttps ? require('https') : require('http');

        const headers = new Map();
        setHeaders(config, headers);

        const options = {
            method: config.method,
            headers: Object.fromEntries(headers),
            hostname: parsedUrl.hostname,
            port: parsedUrl.port,
            path: parsedUrl.pathname + parsedUrl.search,
        };

        const req = transport.request(options, (res) => {
            let data = '';
            const contentType = res.headers['content-type'];
            res.setEncoding(contentType?.includes('application/json') ? 'utf8' : null);

            res.on('data', chunk => data += chunk);

            res.on('end', () => {
                if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                    config.url = res.headers.location;
                    return resolve(httpAdapter(config));
                }

                if (res.statusCode >= 400) {
                    return reject(new HttpError(`HTTP Error: ${res.statusCode}`, res.statusCode, res));
                }

                resolve({
                    data: contentType?.includes('application/json') ? JSON.parse(data) : data,
                    status: res.statusCode,
                    statusText: res.statusMessage,
                    headers: res.headers,
                    config,
                    req: res
                });
            });
        });

        if (config.timeout) {
            req.setTimeout(config.timeout, () => {
                req.abort();
                reject(new TimeoutError(config.timeout));
            });
        }

        if (config.signal) {
            config.signal.addEventListener('abort', () => {
                req.abort();
                reject(new Error('Request canceled by user'));
            });
        }

        req.on("error", (e) => {
            reject(new NetworkError(e.message));
        });

        const processedData = handleReq(config);
        if (processedData) req.write(processedData);
        
        req.end();
    });
}

async function httpAdapter(config) {
    return retryWithBackoff(config);
}

export default httpAdapter;