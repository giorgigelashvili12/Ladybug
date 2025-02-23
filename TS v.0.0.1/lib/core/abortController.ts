'use strict';

/**
 * abort a req
 * @param {Function} reqFn function to execute the req
 * @param {Object} config req config
 * @returns {Promise} promise resolving with the res or rejects the error
 */
export default function abortControllerReq(
    reqFn: (config: any) => Promise<any>,
    config:any 
): Promise<any> {
    const controller = new AbortController();
    const signal = controller.signal;
    config.signal = signal;

    return reqFn(config)
        .then((res: any) => {
            return res;
        })
        .catch((e: any) => {
            if(e.name === 'AbortError') {
                return Promise.reject(new Error('Request Aborted'));
            }
            return Promise.reject(e);
        })
}