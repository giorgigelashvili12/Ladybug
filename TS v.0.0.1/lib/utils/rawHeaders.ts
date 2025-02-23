'use strict';

import toObj from './toObj.js';

const ignored: {[key: string]: boolean} = toObj([
    'age', 'authorization', 'content-length', 'content-type', 'etag',
    'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
    'last-modified', 'location', 'max-forwards', 'proxy-authorization',
    'referer', 'retry-after', 'user-agent', 
    'accept', 'accept-language', 'accept-encoding', 'cache-control', 
    'connection', 'content-disposition', 'content-encoding', 
    'content-language', 'content-range', 'cookie', 'date', 'etag', 
    'if-match', 'if-none-match', 'if-range', 'link', 'location', 
    'max-age', 'pragma', 'range', 'referrer-policy', 'set-cookie', 
    'transfer-encoding', 'vary', 'via', 'x-forwarded-for', 
    'x-frame-options', 'x-request-id', 'x-xss-protection'
])

/**
 * @param {string} rawHeaders - The raw headers to convert 
 * @returns {Object} - Headers parsed into an object
 */

function rawHeaders(raw: string): {[k: string]: string | string[]} {
    const headers: {[key: string]: string | string[]} = {};
    let k: string;
    let v: string;
    let i: number;

    raw && raw.split('\n').forEach(function parser(l) {
        i = l.indexOf(':');
        k = l.substring(0, i).trim().toLowerCase();
        v = l.substring(i + 1).trim();

        if(!k || (headers[k] && ignored[k])) {
            return; 
        }

        if(k === 'set-cookie') {
            if(headers[k]) {
                (headers[k] as string[]).push(v);
            } else {
                headers[k] = [v];
            }
        } else {
            headers[k] = v;
        }
    })
    return headers;
}

export default rawHeaders;