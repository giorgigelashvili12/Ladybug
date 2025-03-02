import httpAdapter from './http.js';
import xhrAdapter from './xhr.js';
import fetchAdapter from './fetch.js';

const knownAdapters = {
    http: httpAdapter,
    xhr: xhrAdapter,
    fetch: fetchAdapter
};

/**
 * returns the correct adapter based on the adapter name
 * throw an error if unknown adapter
 * @param {string} a adapter
 * @returns {Function} adapter function
 */
const getAdapter = (a) => {
    const adapter = knownAdapters[a];
    if(!adapter) {
        throw new Error(`Unknown adapters: ${a}`);
    }
    return adapter;
}

export default getAdapter;