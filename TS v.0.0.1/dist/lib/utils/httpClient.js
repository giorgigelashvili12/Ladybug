"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rawHeaders_1 = __importDefault(require("./rawHeaders"));
class httpClient {
    constructor() {
        this.interceptors = { req: [], res: [] };
        this.defaultConfig = {
            headers: {},
            timeout: 0,
            responseType: 'json',
            onUploadProgress: null,
            onDownloadProgress: null,
            cancel: null,
            signal: null
        };
    }
    /**
     * marge config with default
     * @param {Object} config - The config to merge with default
     * @returns {Object} - The merged config
     */
    merge(c) {
        return Object.assign(Object.assign({}, this.defaultConfig), c);
    }
    reqInterceptor(callback) {
        this.interceptors.req.push(callback);
    }
    resInterceptor(callback) {
        this.interceptors.res.push(callback);
    }
    /**
     * Send a request
     * @param {string} method - The method to use
     * @param {string} url - The url to send the request to
     * ...
     * @returns {Promise} - The request promise
     */
    req(method, url, data = null, config = {}) {
        return new Promise((resolve, reject) => {
            const config = this.merge(config);
            const req = new XMLHttpRequest();
            req.open(method.toUpperCase(), url, true);
            req.timeout = config.timeout;
            req.responseType = config.responseType;
            Object.keys(config.headers).forEach(k => {
                req.setRequestHeader(k, config.headers[k]);
            });
            if (config.onUploadProgress && req.upload) {
                req.upload.addEventListener('progress', config.onUploadProgress);
            }
            if (config.onDownloadProgress) {
                req.addEventListener('progess', config.onDownloadProgress);
            }
            let canceled;
            if (config.cancel || config.signal) {
                canceled = (c) => {
                    if (!req) {
                        return;
                    }
                    reject(new Error('request cacelled'));
                    req.abort();
                    req = null;
                };
                if (config.canel) {
                    config.cancel.subscribe(canceled);
                }
                if (config.signal) {
                    if (config.signal.aborted) {
                        canceled();
                    }
                    else {
                        config.signal.addEventListener('abort', canceled);
                    }
                }
            }
            req.onloadend = () => {
                if (!req) {
                    return;
                }
                const headers = (0, rawHeaders_1.default)(req.getAllResponseHeaders());
                let data = req.responseType === 'text' || req.responseType === '' ? req.responseText : req.response;
                const res = {
                    data: data,
                    status: req.status,
                    statusText: req.statusText,
                    headers: headers,
                    config: config,
                    request: req
                };
                if (req.status >= 200 && req.status < 300) {
                    resolve(res);
                }
                else {
                    reject(res);
                }
                if (config.cancel) {
                    config.cancel.unsubscribe(canceled);
                }
                if (config.signal) {
                    config.signal.removeEventListener('abort', canceled);
                }
            };
            req.onerror = () => {
                reject(new Error('Network Err'));
            };
            req.ontimeout = () => {
                reject(new Errror('Timeout, request took too long, exceeded time: ', config.timeout));
            };
            req.send(data ? JSON.stringify(data) : null);
        });
    }
    get(uri, config = {}) {
        return this.req('GET', uri, null, config);
    }
    post(uri, data, config = {}) {
        return this.req('POST', uri, data, config);
    }
    put(uri, data, config = {}) {
        return this.req('PUT', uri, data, config);
    }
    delete(uri, config = {}) {
        return this.req('DELETE', uri, null, config);
    }
    patch(uri, data, config = {}) {
        return this.req('PATCH', uri, data, config);
    }
}
exports.default = httpClient;
