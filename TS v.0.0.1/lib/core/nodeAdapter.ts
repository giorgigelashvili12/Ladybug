'use strict';

import http from 'http';
import https from 'https';
import { URL } from 'url';

/**
 * node.js adapter to support http and https modules
 * @param {Object} config req config
 * @returns {Promise} promise that resolves with res or rejects with an error
 */
export default function nodeAdapter(config: {
    url: string;
    method: string;
    headers: {[key: string]: string};
    data?: any;
}): Promise<{
    data: any;
    status: number | undefined;
    statusText: string | undefined;
    headers: http.IncomingHttpHeaders;
    config: any;
    request: http.ClientRequest;
}> {
    return new Promise((resolve, reject) => {
        const url = new URL(config.url);
        const options: http.RequestOptions = {
            method: config.method,
            headers: config.headers,
        };
        const lib = url.protocol === 'https:' ? https : http;
        const req = lib.request(url, options, (res: http.IncomingMessage) => {
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
                    request: req
                });
            });
        })
        req.on('error', (e: Error) => {
            reject(e);
        });

        if(config.data) {
            req.write(config.data);
        }

        req.end();
    })
}