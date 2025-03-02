'use strict';

import http from 'http';
import https from 'https';
import {URL} from 'url';
/**
 * node.js adapter to support http and https modules
 * @param {Object} config req config
 * @returns {Promise} promise that resolves with res or reject with an error
 */
export default function nodeAdapter(config) {
    return new Promise((resolve, reject) => {
        const url = new URL(config.url);
        const options = {
            method: config.method,
            headers: config.headers,
        };
        const lib = url.protocol === 'https:' ? https : http;
        const req = lib.request(url, options, (res) => {
            let data = '';

            res.on('data', ch => {
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
        });

        req.on('error', e => {
            reject(e);
        })

        if(config.data) {
            req.write(config.data);
        }

        req.end();
    })
}