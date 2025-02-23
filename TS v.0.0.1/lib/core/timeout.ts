'use strict';

/**
 * abort a requestafter a specified timeout duration
 * @param {Function} reqFn the function to execute the req
 * @param {Object} config the request config
 * @param {Number} timeout the timeout duration in ms
 * @returns {Promise} a promise that resolves with the res or reject
 */
export default function timeoutReq(
    reqFn: (config: any) => Promise<any>,
    config: any,
    timeout: number = 5000
): Promise<any> {
    return new Promise((resolve, reject) => {
        const controller = new AbortController();
        const signal = controller.signal;
        config.signal = signal;

        const timer = setTimeout(() => {
            controller.abort();
            reject(new Error("Request Timed Out"));
        }, timeout);

        reqFn(config)
            .then((res: any) => {
                clearTimeout(timer);
                resolve(res);
            }).catch((e: any) => {
                clearTimeout(timer);
                reject(e);
            })
    })
}