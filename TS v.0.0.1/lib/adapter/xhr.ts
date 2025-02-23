'use strict';

/**
 * XHR adapter to work with XMLHttpRequest
 * @param {Object} config req config
 * @returns {Promise}
 */
function xhrAdapter(config: {
    url: string;
    method: string;
    headers: { [key: string]: string};
    data?: any;
    signal?: AbortSignal;
}): Promise<{
    data: any;
    status: number;
    statusText: string;
    headers: {[key: string]: string};
    config: any;
    req: XMLHttpRequest;
}> {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(config.method, config.url, true);

        Object.keys(config.headers).forEach(k => {
            xhr.setRequestHeader(k, config.headers[k]);
        });

        xhr.onload = () => {
            const headers = xhr.getAllResponseHeaders().split('\r\n').reduce((acc, current) => {
                const [key, val] = current.split(': ');
                if(key) {
                    acc[key] = val;
                }
                return acc;
            }, {} as {[key: string]: string});

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

        if(config.signal) {
            config.signal.addEventListener('abort', () => {
                xhr.abort();
                reject(new Error('Request Aborted'));
            });
        }

        xhr.send(config.data);
    });
}

export default xhrAdapter