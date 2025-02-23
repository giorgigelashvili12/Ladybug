'use strict';

/**
 * track upload and download
 * @param {Function} reqFn function for req
 * @param {Object} config req config
 * @param {Function} onProgress fn to handle progress events
 * @returns {Promise}
 */
export default function trackProgress(
    reqFn: (config: any) => Promise<any>,
    config: {
        method: string,
        url: string,
        data?: any,
    },
    onProgress: (this: XMLHttpRequest, ev: ProgressEvent) => any 
): Promise <{data:any}> {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(config.method,config.url, true);

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
            xhr.send(config.data);
        } else {
            xhr.send();
        }
    });
}