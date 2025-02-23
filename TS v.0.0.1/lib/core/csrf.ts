'use strict';

/**
 * add csrf token to req headers
 * @param {Object} config the req config
 * @param {string} token csrf token
 * @returns {Object} updated req config
 */
export default function csrfToken(
    config: { headers?: {[key: string]: string}}, token: string
) {
    config.headers = config.headers || {};
    config.headers['X-CSRF-Token'] = token;
    return config;
}