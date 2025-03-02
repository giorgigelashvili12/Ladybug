/**
 * resolves the config for an HTTP request
 * @param {Object} config the user provided configuration object
 * @param {string} [config.method='get'] the http method to use
 * @param {Object} [config.headers={}] req headers
 * @param {Object} [config.params={}] query parameters
 * @param {boolean} [config.withCredentials=false] whether to include credentials in corss-origin reqs
 * @param {string} [config.responseType='json'] res type
 * @param {string} [config.baseURL] url to pretend to the req url
 * @param {string} [config.url] the req url
 * @returns {Object} resolved config obj
 */
const resolveConfig = (config) => {
    const defaultConfig = {
        method: 'get',
        headers: {},
        params: {},
        withCredentials: false,
        responseType: 'json'
    };

    const mergedConfig = {...defaultConfig, ...config};
    mergedConfig.method = mergedConfig.method.toLowerCase();

    if (config.headers) {
        mergedConfig.headers = new Headers(config.headers);
    }

    if (config.baseURL && config.url && !config.url.startsWith('http')) {
        mergedConfig.url = `${config.baseURL.replace(/\/$/, '')}/${config.url.replace(/^\//, '')}`;
    }

    if (config.params && typeof config.params === 'object') {
        const url = new URL(mergedConfig.url, window.location.origin);
        Object.entries(config.params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                url.searchParams.append(key, value);
            }
        });
        mergedConfig.url = url.toString();
    }

    return mergedConfig;
};

export default resolveConfig;