'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * fetch adapter to work with fetch
 * @param {Object} config req config
 * @returns {Promise} promise resolves with res
 */
function fetchAdapter(config) {
    return fetch(config.url, {
        method: config.method,
        headers: config.headers,
        body: config.data,
        signal: config.signal,
    })
        .then(res => {
        return res.json().then(data => ({
            data,
            status: res.status,
            statusText: res.statusText,
            headers: res.headers,
            config,
            req: res
        }));
    })
        .catch(e => {
        return Promise.reject(e);
    });
}
exports.default = fetchAdapter;
