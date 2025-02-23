'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * abort a req
 * @param {Function} reqFn function to execute the req
 * @param {Object} config req config
 * @returns {Promise} promise resolving with the res or rejects the error
 */
function abortControllerReq(reqFn, config) {
    const controller = new AbortController();
    const signal = controller.signal;
    config.signal = signal;
    return reqFn(config)
        .then(res => {
        return res;
    })
        .catch(e => {
        if (e.name === 'AbortError') {
            return Promise.reject(new Error('Request Aborted'));
        }
        return Promise.reject(e);
    });
}
exports.default = abortControllerReq;
