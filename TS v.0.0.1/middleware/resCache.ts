'use strict';

/**
 * middleware for res caching
 * @param {Function} reqFn function to execute the req
 * @param {Object} config the req config
 * @param {Map} cache cache map
 * @returns {Promise} promise resolving with res or rejects with an error
 */
function resCache(reqFn, config, cache) {
    const cacheK = config.url;
    if(cache.has(cacheK)) {
        return Promise.resolve(cache.get(cacheK));
    }

    return reqFn(config) 
        .then(res => {
            cache.set(cacheK, res);
            return res;
        })
        .catch(e => Promise.reject(e));
}

export default resCache;