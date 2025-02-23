'use strict';

/**
 * validates and normalizes req headers
 * @param {Object} headers the req headers
 * @returns {Object} validated & normalized headers
 */
export default function validateHeaders(headers: {[key: string]: string}): {[ket: string]: string} {
    const normalizedHeaders: {[ket: string]: string} = {};
    Object.keys(headers).forEach(k => {
        const normalized = k.toLowerCase();
        normalizedHeaders[normalized] = headers[k];
    });
    return normalizedHeaders;
}