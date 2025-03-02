'use strict';

/**
 * retry a request with a configurable backoff
 * @param {Function} fn req fn
 * @param {Object} config req config
 * @param {number} retries num of retries
 * @param {number} backoff backoff in ms
 * @returns {Promise}
 */
export default function retryReq(fn, config, retries, backoff) {
    return new Promise((resolve, reject) => {
        const attempt = retrys => {
            fn(config)
                .then(res => resolve(res))
                .catch(e => {
                    if(retrys <= 0) {
                        reject(0);
                    } else {
                        setTimeout(() => {
                            attempt(retrys - 1);
                        }, backoff);
                    }
                });
        };
        attempt(retries)
    });
}