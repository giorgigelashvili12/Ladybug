import fetchClient from '../utils/fetchClient.js';

const FetchClient = new fetchClient();

const fetchAdapter = (config: {
    url: string;
    method: string;
    headers: HeadersInit;
    data?: any;
    signal?: AbortSignal;
}): Promise<{
    data: any;
    status: number;
    statusText: string;
    headers: Headers;
    config: any;
    req: Response;
}> => {
    const {url, method, headers, data, signal} = config;

    switch (method.toLowerCase()) {
        case 'get':
            return FetchClient.get(url, { headers, signal });
        case 'post':
            return FetchClient.post(url, data, { headers, signal });
        case 'put':
            return FetchClient.put(url, data, { headers, signal });
        case 'delete':
            return FetchClient.delete(url, { headers, signal });
        case 'patch':
            return FetchClient.patch(url, data, { headers, signal });
        default:
            return Promise.reject(new Error(`Unsupported method: ${method}`));
    }
}

export default fetchAdapter;