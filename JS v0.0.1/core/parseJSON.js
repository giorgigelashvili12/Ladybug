'use strict';

/**
 * automatically parse JSON res
 * @param {Response} res response object
 * @returns {Promise} promise resolving with parsed json data
 */
export default function parseJSONRes(res) {
    const contentType = res.headers.get('content-type');
    if(contentType && contentType.includes('application/json')) {
        return res.json().then(data => ({data}));
    }
    return res.text().then(data => ({data}));
}