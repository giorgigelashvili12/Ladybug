'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = nodeAdapter;
const http_1 = __importDefault(require("http"));
const https_1 = __importDefault(require("https"));
const url_1 = require("url");
/**
 * node.js adapter to support http and https modules
 * @param {Object} config req config
 * @returns {Promise} promise that resolves with res or rejects with an error
 */
function nodeAdapter(config) {
    return new Promise((resolve, reject) => {
        const url = new url_1.URL(config.url);
        const options = {
            method: config.method,
            headers: config.headers,
        };
        const lib = url.protocol === 'https:' ? https_1.default : http_1.default;
        const req = lib.request(url, options, (res) => {
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
        });
        req.on('error', (e) => {
            reject(e);
        });
        if (config.data) {
            req.write(config.data);
        }
        req.end();
    });
}
