'use strict';

import fetchAdapter from "./lib/utils/fetchClient";
import { InterceptorManager } from "./lib/utils";
import retryReq from "./lib/core/retry";
import timeoutReq from "./lib/core/timeout";
import Error from './lib/core/Error'
import { buildFullPath } from "./lib/utils";
import nodeAdapter from "./lib/core/nodeAdapter";
import trackProgress from "./lib/core/progressEvents";
import abortControllerReq from "./lib/core/abortController";
import csrfToken from './lib/core/csrf';
import parseJSONRes from "./lib/core/parseJSON";
import validateHeaders from "./lib/core/strictHeaders";
import {
    mergeConfig,
    setBaseURL,
    isLadybugErr,
    streamingRes
} from './lib/utils';
import resCache from "./middleware/resCache";
import debug from "./lib/utils/debug";

class Ladybug {
    constructor(config={}) {
        this.default = config;
        this.interceptors = {
            req: new InterceptorManager(),
            res: new InterceptorManager()
        };
        this.adapter = typeof window !== 'undefined' ? fetchAdapter : nodeAdapter;
        this.cache = new Map();
    }

    request(config) {
        config = mergeConfig(this.default, config)
        config.url = buildFullPath(config.baseURL || this.default.baseURL, config.url);

        let promise = Promise.resolve(config);
        this.interceptors.req.forEach(interceptor => {
            promise = promise.then(interceptor.fulfilled, interceptor.rejected);
        });

        promise = promise.then(config => {
            if(config.csrfToken) {
                config = csrfToken(config, config.csrfToken);
            }
            config.headers = validateHeaders(config.headers);
            if(config.timeout) {
                return timeoutReq(fetchAdapter, config, config.timeout);
            } 
            if(config.signal) {
                return abortControllerReq(this.adapter, config);
            }
            if(config.onProgress) {
                return trackProgress(this.adapter, config, config.onProgress);
            }
            if(config.stream) {
                return streamingRes(this.adapter, config);
            }
            return resCache(this.adapter, config, this.cache).then(parseJSONRes)
        });

        this.interceptors.res.forEach(interceptor => {
            promise = promise.then(interceptor.fulfilled, interceptor.rejected);
        });

        return promise.catch(debug);
    }

    get(url, config) {
        return this.req({...config, method: "GET", url});
    }

    post(url, data, config) {
        return this.req({...config, method: "POST", url, data});
    }

    put(url, data, config) {
        return this.req({...config, method: "PUT", url, data});
    }

    delete(url, config) {
        return this.req({...config, method: "DELETE", url});
    }

    reqInterceptor(fulfilled, rejected) {
        return this.interceptors.req.use(fulfilled, rejected);
    }

    resInterceptor(fulfilled, rejected) {
        return this.interceptors.res.use(fulfilled, rejected);
    }

    setBaseURL(base) {
        this.default = setBaseURL(this.default, base);
    }

    isLadybugErr(e) {
        return isLadybugErr(e);
    }
}

export default Ladybug;