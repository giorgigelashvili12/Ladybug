'use strict';
/**
 * abort a req
 * @param {Funciton} fn function to execute the req
 * @param {Object} config req config
 * @returns {Promise} promise resolving with the res or reject the error
 */
function abortControllerReq(fn, config) {
    return fn(config)
        .then((res) => {
            return res;
        })
        .catch(e => {
            if(e.name === 'AbortError') {
                return Promise.reject(new Error('Request Aborted'));
            }
            return Promise.reject(e);
        })
}

export default abortControllerReq;