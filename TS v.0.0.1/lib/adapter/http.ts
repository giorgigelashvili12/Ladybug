'use strict';

import { IncomingMessage } from "http";
import { URL } from "url";

/**
 * HTTP adapter to work with Node.js http module
 * @param {Object} config req config
 * @returns {Promise}
 */
export default function httpAdapter(config: {
    url: string;
    method: string;
    headers: { [key: string]: string};
    data?: any;
}): Promise<{
    data: any;
    status: number | undefined;
    statusText: string | undefined;
    headers: { [key: string]: string | string[] | undefined };
    config: any;
    req: IncomingMessage;
}> {
    const http = require('http');

    return new Promise((resolve, reject) => {
        const parsedUrl = new URL(config.url);
        const options ={
            method: config.method,
            headers: config.headers,
            hostname: parsedUrl.hostname,
            port: parsedUrl.port,
            path: parsedUrl.pathname + parsedUrl.search
        };

        const req = http.request(options, (res: IncomingMessage) => {
            let data = '';
            res.on('data', (ch) => {
                data += ch;
            });
            res.on('end', () => {
                resolve({
                    data: JSON.parse(data),
                    status: res.statusCode,
                    statusText: res.statusMessage,
                    headers: res.headers,
                    config,
                    req: res
                });
            });
        });

        req.on('error', (error: Error) => {
            reject(error);
        });

        if(config.data) {
            req.write(config.data);
        }

        req.end();
    });
}