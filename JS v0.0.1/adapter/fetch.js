'use strict';

import AxiosError from '../core/AxiosError.js';
import resolveConfig from '../helpers/resolveConfig.js';
import { composeSignals } from '../helpers/composeSignals.js';
import { trackStream } from '../helpers/trackStream.js';
import { progressEventDecorator, progressEventReducer, asyncDecorator } from '../helpers/progressEventReducer.js';

const DEFAULT_CHUNK_SIZE = 64 * 1024;

const fetchAdapter = async (config) => {
    try {
        const {
            url,
            method,
            headers,
            data,
            signal,
            cancelToken,
            timeout,
            onDownloadProgress,
            onUploadProgress,
            responseType = 'json'
        } = resolveConfig(config);

        const composedSignal = composeSignals([signal, cancelToken && cancelToken.toAbortSignal()], timeout);
        const requestInit = {
            method: method.toUpperCase(),
            headers,
            body: data ? JSON.stringify(data) : undefined,
            signal: composedSignal
        };

        if (onUploadProgress && data) {
            const [onProgress, flush] = progressEventDecorator(
                data.length,
                progressEventReducer(asyncDecorator(onUploadProgress))
            );
            requestInit.body = trackStream(data, DEFAULT_CHUNK_SIZE, onProgress, flush);
        }

        const response = await fetch(url, requestInit);
        const contentLength = response.headers.get('content-length');
        const isStreamResponse = responseType === 'stream' || responseType === 'response';

        if (onDownloadProgress && !isStreamResponse) {
            const [onProgress, flush] = progressEventDecorator(
                parseInt(contentLength, 10) || 0,
                progressEventReducer(asyncDecorator(onDownloadProgress), true)
            );
            response.body = trackStream(response.body, DEFAULT_CHUNK_SIZE, onProgress, flush);
        }

        let responseData;
        switch (responseType.toLowerCase()) {
            case 'json':
                responseData = await response.json();
                break;
            case 'text':
                responseData = await response.text();
                break;
            case 'blob':
                responseData = await response.blob();
                break;
            case 'arraybuffer':
                responseData = await response.arrayBuffer();
                break;
            case 'stream':
                responseData = response.body;
                break;
            default:
                throw new AxiosError(`Unsupported response type: ${responseType}`, AxiosError.ERR_NOT_SUPPORT, config);
        }

        return {
            data: responseData,
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
            config,
            request: response
        };
    } catch (error) {
        if (error.name === 'AbortError') {
            throw new AxiosError('Request was aborted', AxiosError.ERR_CANCELED, config);
        }
        throw AxiosError.from(error, error.code, config);
    }
};

export default fetchAdapter;