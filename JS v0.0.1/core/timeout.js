'use strict';

/**
 * abort a request after specified timeout duration
 * @param {Function} fn the function to execute the req
 * @param {Object} config req config
 * @param {Number} timeout timeout duration in ms
 * @returns {Promise}
 */
export default function timeoutReq(fn, config, timeout=5000) {
    return new Promise((resolve, reject) => {
        const controller = new AbortController();
        const signal = controller.signal;
        config.signal = signal;

        const timer = setTimeout(() => {
            controller.abort();
            reject(new Error('Request Timed Out'));
        }, timeout);

        fn(config)
            .then(res => {
                clearTimeout(timer);
                resolve(res);
            })
            .catch(e => {
                clearTimeout(timer);
                reject(e);
            });
    });
};