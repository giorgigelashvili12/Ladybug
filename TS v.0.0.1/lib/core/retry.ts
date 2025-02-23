'use strict';

/**
 * retru a request with a configurable backoff
 * @param {Function} reqFn request function
 * @param {Object} config req config
 * @param {number} retries num of retries
 * @param {number} backoff backoff in ms
 * @returns {Promise} promise resolving with the res or reject with an error
 */
export default function retryReq(
    reqFn: (config: any) => Promise<any>,
    config: any,
    retries: number = 3,
    backoff: number = 300
): Promise<any> {
    return new Promise((resolve, reject) => {
        const attempt = (retryCount: number) => {
            reqFn(config)
                .then((res: any) => resolve(res))
                .catch((e: any) => {
                    if(retryCount <= 0) {
                        reject(e);
                    } else {
                        setTimeout(() => {
                            attempt(retryCount - 1);
                        }, backoff);
                    }
                });
        };
        attempt(retries);
    });
}