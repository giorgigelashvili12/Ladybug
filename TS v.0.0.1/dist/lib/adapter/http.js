'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = httpAdapter;
const url_1 = require("url");
/**
 * HTTP adapter to work with Node.js http module
 * @param {Object} config req config
 * @returns {Promise}
 */
function httpAdapter(config) {
    const http = require('http');
    return new Promise((resolve, reject) => {
        const parsedUrl = new url_1.URL(config.url);
        const options = {
            method: config.method,
            headers: config.headers,
            hostname: parsedUrl.hostname,
            port: parsedUrl.port,
            path: parsedUrl.pathname + parsedUrl.search
        };
        const req = http.request(options, (res) => {
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
        req.on('error', (error) => {
            reject(error);
        });
        if (config.data) {
            req.write(config.data);
        }
        req.end();
    });
}
