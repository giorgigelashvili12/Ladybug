import rawHeaders from './rawHeaders.js';

class FetchClient {
    constructor() {
        this.defaultConfig = {
            headers: {},
            timeout: 0,
            responseType: 'json',
            onDownloadProgress: null,
            onUploadProgress: null,
            cancel: null,
            signal: null
        };
    }

    /**
     * merge user config with default
     * @param {Object} config 
     * @returns {Object} merged config
     */
    merge(config) {
        return {...this.defaultConfig, ...config};
    }

    /**
     * send a request
     * @param {string} method method to use
     * @param {string} url URL to send request to
     * @param {Object} data data to send
     * @param {Object} [config={}] config to use
     * @returns {Promise<Object>}
     */
    async req(method, url, data = null, config = {}) {
        const _config = this.merge(config);
        const controller = new AbortController();
        const signal = _config.signal || controller.signal;

        const fetchConfig = {
            method: method.toUpperCase(),
            headers: _config.headers,
            body: data ? JSON.stringify(data) : null,
            signal
        };

        const res = await fetch(url, fetchConfig);
        const resData = await res.json();

        return {
            data: resData,
            status: res.status,
            statusText: res.statusText,
            headers: rawHeaders(res.headers),
            config: _config,
            req: res 
        };
    }

    get(url, config = {}) {
        return this.req('GET', url, null, config);
    }

    post(url, data, config = {}) {
        return this.req('POST', url, data, config);
    }

    put(url, data, config={}) {
        return this.req('PUT', url, data, config);
    }

    delete(url, config={}) {
        return this.req('DELETE', url, null, config);
    }

    patch(url, data, config={}) {
        return this.req('PATCH', url, data, config);
    }
}

export default FetchClient;