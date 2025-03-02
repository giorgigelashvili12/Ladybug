'use strict';

/**
 * track upload the download
 * @param {Function} fn function for req
 * @param {Object} config req config
 * @param {Function} onProgress fn to handle progress events
 * @returns {Promise}
 */
export default function trackProgress(config, onProgress) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(config.method, config.url, true);

        xhr.upload.onprogress = onProgress;
        xhr.onprogress = onProgress;

        xhr.onload = () => {
            const res = JSON.parse(xhr.responseText);
            resolve({data: res});
        };

        xhr.onerror = () => {
            reject(new Error('Network Error'));
        };

        if(config.data) {
            xhr.send(config.data)
        } else {
            xhr.send();
        }
    });
}