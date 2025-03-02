'use strict';

/**
 * validates and normalizes req headers
 * @param {Object} headers req headers
 * @returns {Object} validated & normalized headers
 */
export default function validateHeaders(headers) {
    const normalizedHeaders = {};
    Object.keys(headers).forEach(k => {
        const normalized = k.toLowerCase();
        normalizedHeaders[normalized] = headers[k];
    });
    return normalizedHeaders;
}