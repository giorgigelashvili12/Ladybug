import rawHeaders from "./rawHeaders";

interface FetchClientConfig {
    headers: HeadersInit;
    timeout: number;
    responseType: string;
    onUploadProgress: ((this: XMLHttpRequest, ev: ProgressEvent) => any) | null;
    onDownloadProgress: ((this: XMLHttpRequest, ev: ProgressEvent) => any) | null;
    cancel: (() => void) | null;
    signal: AbortSignal | null;
}

class FetchClient {
    defaultConfig: FetchClientConfig;

    constructor() {
        this.defaultConfig = {
            headers: {},
            timeout: 0,
            responseType: 'json',
            onDownloadProgress: null,
            onUploadProgress: null,
            cancel: null,
            signal: null
        }
    }

    /**
     * merge user config with default
     * @param {Object} config
     * @returns {Object}
     */
    merge(config: Partial<FetchClientConfig>): FetchClientConfig {
        return {...this.defaultConfig, ...config};
    }

    /**
     * send a request 
     * @param {string} method method to use
     * @param {string} url url to send req to
     * @param {Object} data data to send
     * @param {Object} [config={}] config to use
     * @returns {Promise<Object>}
     */
    async req(method: string, url: string, data: any = null, config: Partial<FetchClientConfig> = {}): Promise<any> {
        const _config = this.merge(config);
        const controler = new AbortController();
        const signal = _config.signal || controler.signal;

        const fetchConfig: RequestInit = {
            method: method.toUpperCase(),
            headers: _config.headers,
            body: data ? JSON.stringify(data) : null,
            signal 
        }

        const res = await fetch(url, fetchConfig);
        const resData = await res.json();

        return {
            data: resData,
            status: res.status,
            statusText: res.statusText,
            headers: rawHeaders(res.headers),
            config: _config,
            req: res 
        }
    }

    get(url: string, config: Partial<FetchClientConfig> = {}): Promise<any> {
        return this.req('GET', url, null, config);
    }

    post(url: string, data: any, config: Partial<FetchClientConfig> = {}): Promise<any> {
        return this.req('POST', url, data, config);
    }

    put(url: string, data: any, config: Partial<FetchClientConfig> = {}): Promise<any> {
        return this.req('PUT', url, data, config);
    }

    delete(url: string, config: Partial<FetchClientConfig> = {}): Promise<any> {
        return this.req('DELETE', url, null, config);
    }

    patch(url: string, data: any, config: Partial<FetchClientConfig> = {}): Promise<any> {
        return this.req('PATCH', url, data, config);
    }
}

export default FetchClient;