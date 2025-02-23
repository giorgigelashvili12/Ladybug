'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * XHR adapter to work with XMLHttpRequest
 * @param {Object} config req config
 * @returns {Promise}
 */
function xhrAdapter(config) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(config.method, config.url, true);
        Object.keys(config.headers).forEach(k => {
            xhr.setRequestHeader(k, config.headers[k]);
        });
        xhr.onload = () => {
            const headers = xhr.getAllResponseHeaders().split('\r\n').reduce((acc, current) => {
                const [key, val] = current.split(': ');
                if (key) {
                    acc[key] = val;
                }
                return acc;
            }, {});
            resolve({
                data: JSON.parse(xhr.responseText),
                status: xhr.status,
                statusText: xhr.statusText,
                headers,
                config,
                req: xhr
            });
        };
        xhr.onerror = () => {
            reject(new Error('Network Error'));
        };
        if (config.signal) {
            config.signal.addEventListener('abort', () => {
                xhr.abort();
                reject(new Error('Request Aborted'));
            });
        }
        xhr.send(config.data);
    });
}
exports.default = xhrAdapter;
