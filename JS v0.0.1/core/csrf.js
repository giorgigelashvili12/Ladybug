'use strict';

/**
 * add CSRF token to req headers
 * @param {Object} config the req config
 * @param {string} token csrf token
 * @returns {Object} updated req config
 */
function csrfToken(config, token) {
    config.headers = config.headers || {};
    config.headers['X-CSRF-Token'] = token;
    return config 
}

export default csrfToken;