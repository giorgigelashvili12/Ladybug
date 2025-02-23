import rawHeaders from "./rawHeaders";

interface HttpClientConfig {
    headers: HeadersInit;
    timeout: number;
    responseType: string;
    onUploadProgress : ((this: XMLHttpRequest, ev: ProgressEvent) => any) | null;
    onDownloadProgress: ((this: XMLHttpRequest, ev: ProgressEvent) => any) | null;
    cancel: (() => void) | null;
    signal: AbortSignal | null;
}

type Interceptor = (config: any) => any;

class HttpClient {
    interceptors: {req: Interceptor[]; res: Interceptor[]};
    defaultConfig: HttpClientConfig;

    constructor() {
        this.interceptors = {req:[], res:[]};
        this.defaultConfig = {
            headers: {},
            timeout: 0,
            responseType: 'json',
            onUploadProgress: null,
            onDownloadProgress: null,
            cancel: null,
            signal: null 
        };
    }

    /**
     * merge config with default
     * @param {Object} config config to merge witg default
     * @returns {Object} merged cofnig
     */
    merge(config: Partial<HttpClientConfig>): HttpClientConfig {
        return {...this.defaultConfig, ...config};
    }

    reqInterceptor(callback: Interceptor) {
        this.interceptors.req.push(callback);
    }

    resInterceptor(callback: Interceptor) {
        this.interceptors.res.push(callback);
    }

    req(method: string, url: string, data: any = null, config: Partial<HttpClientConfig> = {}): Promise<any> {
        return new Promise((resolve, reject) => {
            const _config = this.merge(config);
            const xhr = new XMLHttpRequest();
            xhr.open(method.toUpperCase(), url ,true);
            
            Object.keys(_config.headers).forEach(k => {
                xhr.setRequestHeader(k, (_config.headers as Record<string, string>)[k]);
            });

            xhr.onload = () => {
                const res = JSON.parse(xhr.responseText);
                resolve({data: res, status: xhr.status, statusText: xhr.statusText, headers: rawHeaders(xhr.getAllResponseHeaders())});
            };

            xhr.onerror = () => {
                reject(new Error('Network Error'));
            };

            if(_config.onUploadProgress) {
                xhr.upload.onprogress = _config.onUploadProgress;
            }

            if(_config.onDownloadProgress) {
                xhr.onprogress = _config.onDownloadProgress;
            }

            if(_config.signal) {
                _config.signal.addEventListener('abort', () => {
                    xhr.abort();
                    reject(new Error('Request Aborted'))
                });
            }
            xhr.send(data);
        })
    }

    get(url: string, config: Partial<HttpClientConfig> = {}): Promise<any> {
        return this.req('GET', url, null, config);
    }

    post(url: string, data: any, config: Partial<HttpClientConfig> = {}): Promise<any> {
        return this.req('POST', url, data, config);
    }

    put(url: string, data: any, config: Partial<HttpClientConfig> = {}): Promise<any> {
        return this.req('PUT', url, data, config);
    }

    delete(url: string, config: Partial<HttpClientConfig> = {}): Promise<any> {
        return this.req('DELETE', url, null, config);
    }

    patch(url: string, data: any, config: Partial<HttpClientConfig> = {}): Promise<any> {
        return this.req('PATCH', url, data, config);
    }
}

export default HttpClient;