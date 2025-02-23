/**
 * Determine type of a value
 * @param {*} value - value to be determined
 * @returns {string} - type of any value
 */
const kindOf = (value: any): string => {
    const type = typeof value;

    if (value === null) return 'null';
    if (type === 'object' || type === 'function') {
        return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
    }

    return type;
};

/**
 * create a function to test if a vlue is a certain type
 * @param {string} t  a type to test for
 * @returns {Function} function to test if a value is of a certain type
 */
interface KindOfTest {
    (value: any): boolean;
}

const kindOfTest: (t: string) => KindOfTest = (t: string) => {
    t = t.toLowerCase();
    return (value: any): boolean => kindOf(value) === t;
};

/**
 * create a function to test if a value of a specific primitive type
 * @param {string} t a type to test for
 * @returns {Function} function to test if a value is of a specific primitive type
 */
interface TypeOfTest {
    (value: any): boolean;
}

const typeOfTest: (t: string) => TypeOfTest = (t: string) => (th: any): boolean => typeof th === t;

/**
 * check if a value is an array
 * @param {any} val value to test
 * @returns {boolean} true if value is an array
 */
const {isArray} = Array;

/**
 * check if a value is undefined
 * @param {any} val value to check
 * @returns {boolean} true if value is undefined
 */
const isUndefined = typeOfTest('undefined');

/**
 * check if a value is a buffer
 * @param {any} val the value to checl
 * @returns {boolean} true if value is a buffer
 */
interface IsBuffer {
    (val: any): boolean;
}

const isBuffer: IsBuffer = (val: any): boolean => {
    return val !== null && !isUndefined(val) && (val instanceof ArrayBuffer || Buffer.isBuffer(val));
};


/**
 * check if a value is a buffer
 * @param {any} val value to test
 * @returns {boolean} true if value is a buffer
 */
const isArrBuffer = kindOfTest('arraybuffer');

/**
 * check if a value is a form data
 * @param {any} th value to test
 * @returns {boolean} true if value is a form data
 */
interface IsFormData {
    (val: any): boolean;
}

const isFormData: IsFormData = (val: any): boolean => {
    return (typeof FormData !== 'undefined' && val instanceof FormData) || (val && val.constructor && val.constructor.name === 'FormData');
};

/**
 * check if a value is a view on an arraybuffr
 * @param {any} val value to test
 * @returns {boolean} true if value is a view on an arraybuffer
 */
interface IsArrayBufferView {
    (val: any): boolean;
}

const isArrBufferView: IsArrayBufferView = (val: any): boolean => {
    let r: boolean;
    if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
        r = ArrayBuffer.isView(val);
    } else {
        r = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
    }
    return r;
};

/**
 * check if a string
 * @param {any} val value to check
 * @returns {boolean} true if a string
 */
interface IsString {
    (val: any): boolean;
}

const isString: IsString = (val: any): boolean => {
    return typeof val === 'string';
};

/**
 * check if a value is a number
 * @param {any} val value to check
 * @returns {boolean} tru if a number
 */
interface IsNumber {
    (val: any): boolean;
}

const isNumber: IsNumber = (val: any): boolean => {
    return typeof val === 'number';
};

/**
 * check if a value is a boolean
 * @param {any} val value to check
 * @returns {boolean} true if value is a boolean
 */
interface IsBoolean {
    (val: any): boolean;
}

const isBoolean: IsBoolean = (val: any): boolean => {
    return typeof val === 'boolean';
};

/**
 * check if a value is an object
    @param {any} val value to check
    @returns {boolean} return true if an obj
 */
interface IsObject {
    (val: any): boolean;
}

const isObject: IsObject = (val: any): boolean => {
    return val !== null && typeof val === 'object';
};

/**
 * check if a value is a plain obj
 * @param {any} val val to check
 * @returns {boolean} true if a value is a plain obj
 */
interface IsPlainObj {
    (val: any): boolean;
}

const isPlainObj: IsPlainObj = (val: any): boolean => {
    if (val === null || typeof val !== 'object') {
        return false;
    }
    const prototype = Object.getPrototypeOf(val);
    return prototype === null || prototype === Object.prototype;
};

/**
 * check if val is a readable stream
 * @param {any} val value to check
 * @returns {boolean} true if the value is a readable stream
 */
interface IsReadableStream {
    (val: any): boolean;
}

const isReadableStream: IsReadableStream = (val: any): boolean => {
    return isObject(val) && typeof val.pipe === 'function';
};

/**
 * check if a value is a Request
 * @param {any} val value to check
 * @returns {boolean} true if a value is a Request
 */
interface IsRequest {
    (val: any): boolean;
}

const isRequest: IsRequest = (val: any): boolean => {
    return val instanceof Request;
};

/**
 * check if a value is a response
 * @param {any} val value to check
 * @returns {boolean} true if a value is a response
 */
interface IsResponse {
    (val: any): boolean;
}

const isResponse: IsResponse = (val: any): boolean => {
    return val instanceof Response;
};

/**
 * check if a value is headers
 * @param {any} val value to checl
 * @returns {boolean} true if headers
 */
interface IsHeaders {
    (val: any): boolean;
}

const isHeaders: IsHeaders = (val: any): boolean => {
    return val instanceof Headers;
};

/**
 * check if a value is a date
 * @param {any} val value to check
 * @returns {boolean} true if date
 */
interface IsDate {
    (val: any): boolean;
}

const isDate: IsDate = (val: any): boolean => {
    return kindOf(val) === 'date';
};

/**
 * check if a file
 * @param {any} val value to check
 * @returns {boolean} true if value is a file
 */
interface IsFile {
    (val: any): boolean;
}

const isFile: IsFile = (val: any): boolean => {
    return kindOf(val) === 'file';
};

/**
 * check if a blob
 * @param {any} val value to check
 * @returns {boolean} true if a blob
 */
interface IsBlob {
    (val: any): boolean;
}

const isBlob: IsBlob = (val: any): boolean => {
    return kindOf(val) === 'blob';
};

/**
 * check if a value is a regular expression
 * @param {any} val value to check
 * @return {boolean} true if value is regex
 */
interface IsRegExp {
    (val: any): boolean;
}

const isRegExp: IsRegExp = (val: any): boolean => {
    return kindOf(val) === 'regexp';
};

/**
 * check if a value is a function
 * @param {any} val value to check
 * @returns {boolean} true if the value is a function
 */
interface IsFunction {
    (val: any): boolean;
}

const isFunction: IsFunction = (val: any): boolean => {
    return typeof val === 'function';
};

/**
 * check if a value is a stream
 * @param {any} val value to check
 * @returns {boolean} true if a stream
 */
interface IsStream {
    (val: any): boolean;
}

const isStream: IsStream = (val: any): boolean => {
    return isObject(val) && typeof val.pipe === 'function';
};

/**
 * convert an object to a JSON object
 * @param {Object} obj object to convert
 * @returns {Object} //json object 
 */
interface JSONObject {
    [key: string]: any;
}

function toJSONObj(obj: Record<string, any>): JSONObject {
    const r: JSONObject = {};

    for (const k in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, k)) {
            const val = obj[k];
            if (val !== undefined && typeof val !== 'function') {
                r[k] = val;
            }
        }
    }

    return r;
}

/**
 * set headers for an HTTP req
 * @param {Object} hs headers to set 
 * @param {Object} config req config
 */

interface Headers {
    [key: string]: string;
}

interface Config {
    headers?: Headers;
    baseUrl?: string;
}

function setHeaders(hs: Headers, config: Config): void {
    config.headers = config.headers || {};
    for (const k in hs) {
        if (Object.prototype.hasOwnProperty.call(hs, k)) {
            config.headers[k] = hs[k];
        }
    }
}

/**
 * parse res from HTTP req
 * @param {Object} res res object
 * @returns {Object} parsed res object
 */

interface ParsedResponse {
    data: any;
    status: number;
    statusText: string;
    headers: Headers;
    config: Config;
    req: any;
}

function parseRes(res: { data: any; status: number; statusText: string; headers: Headers; config: Config; req: any }): ParsedResponse {
    const { data, status, statusText, headers, config, req } = res;
    return {
        data,
        status,
        statusText,
        headers,
        config,
        req
    };
}

interface ErrorResponse {
    data: any;
    status: number;
    statusText: string;
    headers: Headers;
    config: Config;
    req: any;
}

interface Error {
    message: string;
    config: Config;
    code?: string;
    request?: any;
    res?: ErrorResponse;
}

function handleErr(e: Error): ErrorResponse | { message: string; config: Config; code?: string; request?: any } {
    if (e.res) {
        return {
            data: e.res.data,
            status: e.res.status,
            statusText: e.res.statusText,
            headers: e.res.headers,
            config: e.res.config,
            req: e.res.req
        };
    }
    return {
        message: e.message,
        config: e.config,
        code: e.code,
        request: e.request
    };
}

/**
 * interceptor manager - advance approach
 * manage addition removal and execution of interceptors
 */
class InterceptorManager {
    handlers: Array<{ fulfilled: Function, rejected: Function | undefined } | null>;
    constructor() {
        this.handlers = [];
    }

    /**
     * add a new interceptor to the stack
     * @param {Function} fulfilled - function to handle fuldilled
     * @param {Function} rejected - function to handle rejected
     * @returns {number} - id of the interceptor
     */
    use(fulfilled: (value: any) => any, rejected?: (error: any) => any): number {
        this.handlers.push({
            fulfilled,
            rejected
        });
        return this.handlers.length - 1;
    }

    /**
     * remove an interceptor from the stack
     * @param {number} id  id of the interceptor to remove
     */
    eject(id: number) {
        if(this.handlers[id]) {
            this.handlers[id] = null;
        }
    }

    /**
     * execute interceptors
     * @param {Object} config the req/res config
     * @returns {Promise} promise resolving to the modified config
     */
    forEach(fn: (handler: { fulfilled: Function, rejected: Function | undefined } | null) => void): void {
        this.handlers.forEach(h => {
            if(h !== null) {
                fn(h);
            }
        });
    }
}

/**
 * create an interceptor manager to handle req/res
 * @returns {Object} interceptor manager
 */
function interceptorManager() {
    interface Interceptor {
        fulfilled: (value: any) => any;
        rejected?: (error: any) => any;
    }

    const h: (Interceptor | null)[] = [];

    return {
    /**
     * add an interceptor
     * @param {Function} fulfilled handle successful res/req
     * @param {Function} rejected handle req/req errors
     * @returns {number}
     */
    use(fulfilled: (value: any) => any, rejected?: (error: any) => any) {
      h.push({ fulfilled, rejected });
      return h.length - 1;
    },

    /**
     * remove interceptor by id
     * @param {number} id id of an interceptor
     */
    eject(id: number) {
      if (h[id]) {
        h[id] = null;
      }
    },

    /**
     * iterate over registered interceptors
     * @param {Function} fn function to execute for each interceptor
     */
    forEach(fn: (handler: { fulfilled: (value: any) => any, rejected?: (error: any) => any } | null) => void) {
      h.forEach(handler => {
        if (handler !== null) {
          fn(handler);
        }
      });
    }
  };
}

/**
 * CancelToken class creates and manages cancellation tokens
 */
class CancelToken {
    promise: Promise<unknown>;
    _listeners: Array<(reason: any) => void> | null = null;
    reason?: Error;

    constructor(exe: (cancel: (message?: string) => void) => void) {
        if (typeof exe !== 'function') {
            throw new TypeError('Executor must be a function');
        }

        let resolvePromise!: (value?: unknown) => void;
        this.promise = new Promise(resolve => {
            resolvePromise = resolve;
        });

        const token = this;
        this.promise.then(cancel => {
            if (!token._listeners) return;

            let i = token._listeners.length;
            while (i-- > 0) {
                token._listeners[i](cancel);
            }
            token._listeners = null;
        });

        this.promise.then = (onfulfilled => {
            let _resolve!: (value?: unknown) => void;
            const promise = new Promise(resolve => {
                token.subscribe(resolve);
                _resolve = resolve;
            }).then(onfulfilled);

            (promise as any).cancel = function reject() {
                token.unsubscribe(_resolve);
            };
            return promise;
        }) as any;

        exe(function cancel(msg?: string) {
            if (token.reason) return;
            token.reason = new Error(msg || 'Operation canceled');
            resolvePromise(token.reason);
        });
    }

    subscribe(listener: (reason: any) => void) {
        if (this.reason) {
            listener(this.reason);
            return;
        }
        this._listeners ? this._listeners.push(listener) : this._listeners = [listener];
    }

    unsubscribe(listener: (reason: any) => void) {
        if (!this._listeners) return;
        const index = this._listeners.indexOf(listener);
        if (index !== -1) {
            this._listeners.splice(index, 1);
        }
    }

    throwIfRequested() {
        if (this.reason) {
            throw this.reason;
        }
    }

    static source() {
        let cancel!: (message?: string) => void;
        const token = new CancelToken(c => {
            cancel = c;
        });

        return { token, cancel };
    }
}


class Cancel {
    constructor(msg) {
        this.message = msg;
    }

    toStr() {
        return `Cancel${this.message ? `:${this.message}` : ``}`;
    }
}

/**
 * check if an error is a cancelation error
 * @param {any} val value to check
 * @returns {boolean} true if value is a cancelation error
 */
function isCancel(val) {
    return val instanceof Cancel;
}

/**
 * Deep clone an object
 * @param {Object} obj the object to clone
 * @return {Object} cloned object
 */
function deepClone(obj) {
    if(obj === null || typeof obj !== 'object') {
        return obj;
    }

    if(Array.isArray(obj)) {
        const arr = []; // copy
        for(let i = 0; i< obj.length; i++) {
            arr[i] = deepClone(obj[i]);
        }
        return arr;
    }

    const objC = {};
    for(const k in obj) {
        if(Object.prototype.hasOwnProperty.call(obj, k)) {
            objC[k] = deepClone(obj[k]);
        }
    }

    return objC
}

/**
 * deep merge two or more objects
 * @param {...Object} sources object to merge
 * @returns {Object} merged object
 */
function mergeDeep(...sources) {
    const result = {};
  
    sources.forEach(source => {
        if (source && typeof source === 'object') {
            Object.keys(source).forEach(key => {
            const value = source[key];
            if (Array.isArray(value)) {
                if (!Array.isArray(result[key])) {
                    result[key] = [];
                }
                result[key] = result[key].concat(value.map(item => (typeof item === 'object' ? mergeDeep({}, item) : item)));
            } else if (value && typeof value === 'object') {
                if (!result[key] || typeof result[key] !== 'object') {
                    result[key] = {};
                }
                result[key] = mergeDeep(result[key], value);
            } else {
                result[key] = value;
        }
        });
      }
    });
  
    return result;
}

/**
 * check if value is empty
 * @param {any} val value to check
 * @returns {boolean} true if value empty
 */
function isEmpty(val) {
    if(val == null) {
        return true
    }

    if(typeof val ==='string' || Array.isArray(val)) {
        return val.length === 0;
    } 

    if(typeof val ==='object') {
        return Object.keys(val).length === 0;
    }

    return false;
}

/**
 * debounce a function
 * @param {Function} fn the function to debounce,
 * @param {number} wait the numbe of milliseconds to delay
 * @param {boolean} immediate if true trigger function on leading edge
 * @param {Function} // debounced function
 *  */
function debounce(fn, wait, immediate) {
    let timeout;
    return function () {
        const context = this, args = arguments;
        const later = () => {
            timeout = null;
            if(!immediate) fn.apply(context, args);
        };
        const call = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if(call) fn.apply(context, args);
    };
}

/**
 * throttle a function
 * @param {Function} fn function to throttle
 * @param {number} limit number of millisecods to delay
 * @returns {Function} throttleed fucntion
 */
function throttle(fn, limit) {
    let throttle;
    return function () {
        const context = this, args = arguments;
        if(!throttle) {
            fn.apply(context, args);
            throttle = true;
            setTimeout(() => throttle = false, limit);
        }
    };
}

/**
 * get the type of a value
 * @param {any} val value to determine by type
 * @returns {string} // type of a value
 */
function getType(val) {
    if(val === null) {
        return 'null';
    }
    if(Array.isArray(val)) {
        return 'array';
    }
    return typeof val;
}

/**
 * delay execution for a specified number of milliseconds
 * @param {number} ms milliseconds to delay
 * @returns {Promise} promise resolving after specified delay
 */
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * flatten a nested arr
 * @param {Array} arr array to flatten
 * @returns {Array} the flatten arr
 */
function flatten(arr) {
    const result = [];

    arr.forEach(i => {
        if(Array.isArray(i)) {
            result.push(...flatten(i));
        } else {
            result.push(i);
        }
    });
    return result;
}

/**
 * check if value is a url search params object
 * @param {any} val value to check
 * @returns {Boolean} true if value is a url search params object
 */
function isURLSearchParams(val) {
    return typeof URLSearchParams !== 'undefined' && 
           (val instanceof URLSearchParams || Object.prototype.toString.call(val) === '[object URLSearchParams]');
}  

/**
 * check if value is a typed array
 * @param {any} val value to check
 * @returns {boolean} true if the value is a typed array
 */
function isTypedArr(val) {
    return ArrayBuffer.isView(val) && !(val instanceof DataView);
}

/**
 * check if a value is a file list
 * @param {any} val value to check
 * @return {boolean} true if file list
 */
function isFileList(val) {
    return typeof FileList !== 'undefined' && val instanceof FileList;
}

/**
 * iterate over an array or an object invoking a function over all values
 * @param {Object || Array} obj object or array to iterate over
 * @return {Function} (fn)
 */
function forEach(obj, fn) {
    if(obj === null || typeof obj === 'undefined') {
        return;
    }

    if(typeof obj !== 'object') {
        obj = [obj];
    }

    if(isArray(obj)) {
        for(let i = 0, l = obj.length; i < l; i++) {
            fn.call(null, obj[i], i, obj);
        }
    } else {
        for (const k in obj) {
            if(Object.prototype.hasOwnProperty.call(obj, k)) {
                fn.call(null, obj[k], k, obj);
            }
        }
    }
}

/**
 * extend an object by adding properties from an another obj
 * @param {Object} x object to extend
 * @param {Object} y object to copy properties from
 * @param {Object} tsArg object to bind function
 * @returns {Object} extended objet
 */
function extend(x, y, tsArg ) {
    forEach(y, (val, k) => {
        if(tsArg && isFunction(val)) {
            x[k] = bind(val, tsArg);
        } else {
            x[k] = val;
        }
    });
    return x;
}

/**
 * remove byte order marker from a string
 * @param {string} con string to remove BOM from
 * @returns {string} string without BOM
 */
function stripBOM(con) {
    if(con.charCodeAt(0) === 0xFEFF) {
        con = con.slice(1);
    }
    return con;
}

/**
 * inherit prototype methods from one constructor into another
 * @param {Function} constructor
 * @param {Function} superConstructor 
 * @param {Object} props 
 * @param {Object} descriptors
 */
function inherits(constructor, superConstructor, props, descriptors) {
    constructor.prototype = Object.create(superConstructor.prototype, props, descriptors);
    constructor.prototype.constructor = constructor;
    if(props) {
        Object.assign(constructor.prototype, props);
    }
}

/**
 * resolve object with deep prototype chain to plain object
 * @param {Object} source 
 * @param {Object} dest 
 * @param {Function} filter 
 * @returns {Object}
 */
function toFlatObj(source, dest, filter) {
    dest = dest || {};
    function flatten(obj, parentKey = '') {
        Object.keys(obj).forEach(key => {
            const value = obj[key];
            const newKey = parentKey ? `${parentKey}.${key}` : key;
            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                flatten(value, newKey);
            } else {
                dest[newKey] = value;
            }
        });
    }
    flatten(source);
    return dest;
}

/**
 * check if a string ends with the given tagret
 * @param {string} str
 * @param {string} target
 * @param {number} [length]
 * @returns {boolean}
 */
function endsWith(str, target, length) {
    length = length === undefined ? str.length : length;
    return str.substring(length - target.length, length) === target;
}

/**
 * match all occurrences of a regular expression in a string
 * @param {string} str
 * @param {RegExp} regex 
 * @returns {Array}
 */
function matchAll(str, regex) {
    const matches = [];
    let match;
    while((match = regex.exec(str)) !== null) {
        matches.push(match);
    }
    return matches;
}

/**
 * check if object has a property
 * @param {Object} obj
 * @param {String} prop 
 * @returns {boolean}
 */
function hasOwnProp(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj,prop);
}

/**
 * build full path URI by combining the base URI and req URI
 * @param {string} baseURL base URI
 * @param {string} reqURI req URI
 * @return {string} the fulll URI path
 */
function buildFullPath(baseURL, reqURL) {
    if(baseURL && !/^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(reqURL)) {
        return baseURL.replace(/\/+$/, '') + '/' + reqURL.replace(/^\/+/, '');
    }
}

/**
 * handle streaming responses
 * @param {Function} reqFn function to execute the req
 * @param {Object} config req config
 * @returns {Promise}
 */
function streamingRes(reqFn, config) {
    return reqFn(config)
        .then(res => {
            const reader = res.body.getReader();
            return new ReadableStream({
                start(controller) {
                    function push() {
                        reader.read().then(({done, val}) => {
                            if(done) {
                                controller.close();
                                return;
                            }
                            controller.enqueue(val);
                            push();
                        }).catch(e => {
                            controller.error(e);
                        });
                    }
                    push();
                }
            });
        })
        .then(stream => new Response(stream))
        .then(res => res.json())
        .then(data => ({data}))
        .catch(e => Promise.reject(e));
}

/**
 * set default API URL globally
 * @param {Object} config config object
 * @param {string} base base url
 * @returns {Object} updated config object
 */
function setBaseURL(config: Config, base: string) {
    config.baseUrl = base;
    return config;
}

/**
 * merge global and req-specific configs
 * @param {Object} globalConfig global config
 * @param {Object} reqConfig req config
 * @returns {Object} merged config
 */
interface GlobalConfig {
    baseUrl?: string;
    headers?: Headers;
    [key: string]: any;
}

interface ReqConfig {
    headers?: Headers;
    [key: string]: any;
}

function mergeConfig(globalConfig: GlobalConfig, reqConfig: ReqConfig): GlobalConfig & ReqConfig {
    const config = { ...globalConfig, ...reqConfig };
    if (globalConfig.headers && reqConfig.headers) {
        config.headers = { ...globalConfig.headers, ...reqConfig.headers };
    }
    return config;
}

/**
 * check if an error is from Ladybug
 * @param {Object} e error obj
 * @returns {boolean}
 */
function isLadybugErr(e) {
    return e.isLadybugErr === true;
}

export {
    kindOf,
    kindOfTest,
    typeOfTest,
    isArray,
    isUndefined,
    isBuffer,
    isArrBuffer,
    isFormData,
    isArrBufferView,
    toJSONObj,
    setHeaders,
    parseRes,
    handleErr,
    InterceptorManager,
    interceptorManager,
    CancelToken,
    Cancel,
    isCancel,
    deepClone,
    mergeDeep,
    isEmpty,
    debounce,
    throttle,
    getType,
    delay,
    flatten,
    isNumber,
    isString, 
    isBoolean, 
    isPlainObj, 
    isObject, 
    isReadableStream, 
    isRequest, 
    isResponse, 
    isHeaders, 
    isDate, 
    isFile, 
    isBlob, 
    isRegExp, 
    isFunction, 
    isStream, 
    isURLSearchParams,
    isTypedArr,
    isFileList,
    extend,
    stripBOM,
    inherits,
    toFlatObj,
    endsWith,
    matchAll,
    hasOwnProp,
    buildFullPath,
    streamingRes,
    setBaseURL,
    mergeConfig,
    isLadybugErr
}
function executor(cancel: (message?: string) => void): void {
    // Example implementation: cancel the request after a certain timeout
    setTimeout(() => {
        cancel('Request canceled due to timeout');
    }, 5000); // Cancel after 5 seconds
}