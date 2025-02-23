'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * retru a request with a configurable backoff
 * @param {Function} reqFn request function
 * @param {Object} config req config
 * @param {number} retries num of retries
 * @param {number} backoff backoff in ms
 * @returns {Promise} promise resolving with the res or reject with an error
 */
function retryReq(reqFn, config, retries = 3, backoff) {
    return new Promise((resolve, reject) => {
        const attempt = (retryCou) => {
            reqFn(config)
                .then(res => resolve(res))
                .catch(err => {
                if (retryCou <= 0) {
                    reject(err);
                }
                else {
                    setTimeout(() => attempt(retryCou - 1), backoff);
                }
            });
        };
        attempt(retries);
    });
}
exports.default = retryReq;
