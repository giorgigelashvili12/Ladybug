"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cancel = exports.CancelToken = exports.InterceptorManager = exports.isArrBuffer = exports.isUndefined = exports.isArray = exports.typeOfTest = exports.kindOfTest = exports.kindOf = void 0;
exports.isBuffer = isBuffer;
exports.isFormData = isFormData;
exports.isArrBufferView = isArrBufferView;
exports.toJSONObj = toJSONObj;
exports.setHeaders = setHeaders;
exports.parseRes = parseRes;
exports.handleErr = handleErr;
exports.interceptorManager = interceptorManager;
exports.isCancel = isCancel;
exports.deepClone = deepClone;
exports.mergeDeep = mergeDeep;
exports.isEmpty = isEmpty;
exports.debounce = debounce;
exports.throttle = throttle;
exports.getType = getType;
exports.delay = delay;
exports.flatten = flatten;
exports.isNumber = isNumber;
exports.isString = isString;
exports.isBoolean = isBoolean;
exports.isPlainObj = isPlainObj;
exports.isObject = isObject;
exports.isReadableStream = isReadableStream;
exports.isRequest = isRequest;
exports.isResponse = isResponse;
exports.isHeaders = isHeaders;
exports.isDate = isDate;
exports.isFile = isFile;
exports.isBlob = isBlob;
exports.isRegExp = isRegExp;
exports.isFunction = isFunction;
exports.isStream = isStream;
exports.isURLSearchParams = isURLSearchParams;
exports.isTypedArr = isTypedArr;
exports.isFileList = isFileList;
exports.extend = extend;
exports.stripBOM = stripBOM;
exports.inherits = inherits;
exports.toFlatObj = toFlatObj;
exports.endsWith = endsWith;
exports.matchAll = matchAll;
exports.hasOwnProp = hasOwnProp;
exports.buildFullPath = buildFullPath;
exports.streamingRes = streamingRes;
exports.setBaseURL = setBaseURL;
exports.mergeConfig = mergeConfig;
exports.isLadybugErr = isLadybugErr;
/**
 * Determine type of a value
 * @param {*} value - value to be determined
 * @returns {string} - type of any value
 */
const kindOf = (value) => {
    const type = typeof value;
    if (value === null)
        return 'null';
    if (type === 'object' || type === 'function') {
        return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
    }
    return type;
};
exports.kindOf = kindOf;
/**
 * create a function to test if a vlue is a certain type
 * @param {string} t  a type to test for
 * @returns {Function} function to test if a value is of a certain type
 */
const kindOfTest = t => {
    t = t.toLowerCase();
    return (t) => kindOf(t) === t;
};
exports.kindOfTest = kindOfTest;
/**
 * create a function to test if a value of a specific primitive type
 * @param {string} t a type to test for
 * @returns {Function} function to test if a value is of a specific primitive type
 */
const typeOfTest = (t) => (th) => typeof th === t;
exports.typeOfTest = typeOfTest;
/**
 * check if a value is an array
 * @param {any} val value to test
 * @returns {boolean} true if value is an array
 */
const { isArray } = Array;
exports.isArray = isArray;
/**
 * check if a value is undefined
 * @param {any} val value to check
 * @returns {boolean} true if value is undefined
 */
const isUndefined = typeOfTest('undefined');
exports.isUndefined = isUndefined;
/**
 * check if a value is a buffer
 * @param {any} val the value to checl
 * @returns {boolean} true if value is a buffer
 */
function isBuffer(val) {
    return val !== null && !isUndefined(val) && (val instanceof ArrayBuffer || Buffer.isBuffer(val));
}
/**
 * check if a value is a buffer
 * @param {any} val value to test
 * @returns {boolean} true if value is a buffer
 */
const isArrBuffer = kindOfTest('arraybuffer');
exports.isArrBuffer = isArrBuffer;
/**
 * check if a value is a form data
 * @param {any} th value to test
 * @returns {boolean} true if value is a form data
 */
function isFormData(val) {
    return (typeof FormData !== 'undefined' && val instanceof FormData) || (val && val.constructor && val.constructor.name === 'FormData');
}
/**
 * check if a value is a view on an arraybuffr
 * @param {any} val value to test
 * @returns {boolean} true if value is a view on an arraybuffer
 */
function isArrBufferView(val) {
    let r;
    if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
        r = ArrayBuffer.isView(val);
    }
    else {
        r = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
    }
    return r;
}
/**
 * check if a string
 * @param {any} val value to check
 * @returns {boolean} true if a string
 */
function isString(val) {
    return typeof val === 'string';
}
/**
 * check if a value is a number
 * @param {any} val value to check
 * @returns {boolean} tru if a number
 */
function isNumber(val) {
    return typeof val === 'number';
}
/**
 * check if a value is a boolean
 * @param {any} val value to check
 * @returns {boolean} true if value is a boolean
 */
function isBoolean(val) {
    return typeof val === 'boolean';
}
/**
 * check if a value is an object
    @param {any} val value to check
    @returns {boolean} return true if an obj
 */
function isObject(val) {
    return val !== null && typeof val === 'object';
}
/**
 * check if a value is a plain obj
 * @param {any} val val to check
 * @returns {boolean} true if a value is a plain obj
 */
function isPlainObj(val) {
    if (val === null || typeof val !== 'object') {
        return false;
    }
    const prototype = Object.getPrototypeOf(val);
    return prototype === null || prototype === Object.prototype;
}
/**
 * check if val is a readable stream
 * @param {any} val value to check
 * @returns {boolean} true if the value is a readable stream
 */
function isReadableStream(val) {
    return isObject(val) && typeof val.pipe === 'function';
}
/**
 * check if a value is a Request
 * @param {any} val value to check
 * @returns {boolean} true if a value is a Request
 */
function isRequest(val) {
    return val instanceof Request;
}
/**
 * check if a value is a response
 * @param {any} val value to check
 * @returns {boolean} true if a value is a response
 */
function isResponse(val) {
    return val instanceof Response;
}
/**
 * check if a value is headers
 * @param {any} val value to checl
 * @returns {boolean} true if headers
 */
function isHeaders(val) {
    return val instanceof Headers;
}
/**
 * check if a value is a date
 * @param {any} val value to check
 * @returns {boolean} true if date
 */
function isDate(val) {
    return kindOf(val) === 'date';
}
/**
 * check if a file
 * @param {any} val value to check
 * @returns {boolean} true if value is a file
 */
function isFile(val) {
    return kindOf(val) === 'file';
}
/**
 * check if a blob
 * @param {any} val value to check
 * @returns {boolean} true if a blob
 */
function isBlob(val) {
    return kindOf(val) === 'blob';
}
/**
 * check if a value is a regular expression
 * @param {any} val value to check
 * @return {boolean} true if value is regex
 */
function isRegExp(val) {
    return kindOf(val) === 'regexp';
}
/**
 * check if a value is a function
 * @param {any} val value to check
 * @returns {boolean} true if the value is a function
 */
function isFunction(val) {
    return typeof val === 'function';
}
/**
 * check if a value is a stream
 * @param {any} val value to check
 * @returns {boolean} true if a stream
 */
function isStream(val) {
    return isObject(val) && typeof val.pipe === 'function';
}
/**
 * convert an object to a JSON object
 * @param {Object} obj object to convert
 * @returns {Object} //json object
 */
function toJSONObj(obj) {
    const r = {};
    for (const k in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, k)) {
            const val = obj[k];
            if (val !== undefined && typeof value !== 'function') {
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
function setHeaders(hs, config) {
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
function parseRes(res) {
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
function handleErr(e) {
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
        request: e.request,
    };
}
/**
 * interceptor manager - advance approach
 * manage addition removal and execution of interceptors
 */
class InterceptorManager {
    constructor() {
        this.handlers = [];
    }
    /**
     * add a new interceptor to the stack
     * @param {Function} fulfilled - function to handle fuldilled
     * @param {Function} rejected - function to handle rejected
     * @returns {number} - id of the interceptor
     */
    use(fulfilled, rejected) {
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
    eject(id) {
        if (this.handlers[id]) {
            this.handlers[id] = null;
        }
    }
    /**
     * execute interceptors
     * @param {Object} config the req/res config
     * @returns {Promise} promise resolving to the modified config
     */
    forEach(fn) {
        this.handlers.forEach(h => {
            if (h !== null) {
                fn(h);
            }
        });
    }
}
exports.InterceptorManager = InterceptorManager;
/**
 * create an interceptor manager to handle req/res
 * @returns {Object} interceptor manager
 */
function interceptorManager() {
    const h = [];
    return {
        /**
         * add an interceptor
         * @param {Function} fulfilled handle successful res/req
         * @param {Function} rejected handle req/req errors
         * @returns {number}
         */
        use(fulfilled, rejected) {
            h.push({ fulfilled, rejected });
            return h.length - 1;
        },
        /**
         * remove interceptor by id
         * @param {number} id id of an interceptor
         */
        eject(id) {
            if (h[id]) {
                h[id] = null;
            }
        },
        /**
         * iterate over registered interceptors
         * @param {Function} fn function to execute for each interceptor
         */
        forEach(fn) {
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
    constructor(exe) {
        if (typeof exe !== 'function') {
            throw new TypeError('Executor must be a function');
        }
        let resolvePromise;
        this.promise = new Promise(resolve => {
            resolvePromise = resolve;
        });
        const token = this;
        this.promise.then(cancel => {
            if (!token._listeners)
                return;
            let i = token._listeners.length;
            while (i-- > 0) {
                token._listeners[i](cancel);
            }
            token._listeners = null;
        });
        this.promise.then = onfulfilled => {
            let _resolve;
            const promise = new Promise(resolve => {
                token.subscribe(resolve);
                _resolve = resolve;
            }).then(onfulfilled);
            promise.cancel = function reject() {
                token.unsubscribe(_resolve);
            };
            return promise;
        };
        executor(function cancel(msg) {
            if (token.reason)
                return;
            token.reason = new Cancel();
            resolvePromise(token.reason);
        });
    }
    /**
     * subscribe to the token
     * @param {Function} listener the listener to subscribe
     */
    subscribe(listener) {
        if (this.reason) {
            listener(this.reason);
            return;
        }
        if (this._listeners) {
            this._listeners.push(listener);
        }
        else {
            this._listeners = [listener];
        }
    }
    /**
     * unsubscribe from the token
     * @param {Function} listener the listener to unsubscribe
     */
    unsubscribe(listener) {
        if (!this._listeners)
            return;
        const index = this._listeners.indexOf(listener);
        if (index !== -1) {
            this._listeners.splice(index, 1);
        }
    }
    /**
     * throw in an aerror if the request has been cancelled
     */
    throwIfRequested() {
        if (this.reason) {
            throw this.reason;
        }
    }
    /**
     * static method to create a token source
     * @returns {Object} cancelation token source
     */
    static source() {
        let cancel;
        const token = new CancelToken(c => {
            cancel = c;
        });
        return {
            token,
            cancel
        };
    }
}
exports.CancelToken = CancelToken;
class Cancel {
    constructor(msg) {
        this.message = msg;
    }
    toStr() {
        return `Cancel${this.message ? `:${this.message}` : ``}`;
    }
}
exports.Cancel = Cancel;
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
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    if (Array.isArray(obj)) {
        const arr = []; // copy
        for (let i = 0; i < obj.length; i++) {
            arr[i] = deepClone(obj[i]);
        }
        return arr;
    }
    const objC = {};
    for (const k in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, k)) {
            objC[k] = deepClone(obj[k]);
        }
    }
    return objC;
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
                }
                else if (value && typeof value === 'object') {
                    if (!result[key] || typeof result[key] !== 'object') {
                        result[key] = {};
                    }
                    result[key] = mergeDeep(result[key], value);
                }
                else {
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
    if (val == null) {
        return true;
    }
    if (typeof val === 'string' || Array.isArray(val)) {
        return val.length === 0;
    }
    if (typeof val === 'object') {
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
            if (!immediate)
                fn.apply(context, args);
        };
        const call = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (call)
            fn.apply(context, args);
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
        if (!throttle) {
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
    if (val === null) {
        return 'null';
    }
    if (Array.isArray(val)) {
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
}
;
/**
 * flatten a nested arr
 * @param {Array} arr array to flatten
 * @returns {Array} the flatten arr
 */
function flatten(arr) {
    const result = [];
    arr.forEach(i => {
        if (Array.isArray(i)) {
            result.push(...flatten(i));
        }
        else {
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
    if (obj === null || typeof obj === 'undefined') {
        return;
    }
    if (typeof obj !== 'object') {
        obj = [obj];
    }
    if (isArray(obj)) {
        for (let i = 0, l = obj.length; i < l; i++) {
            fn.call(null, obj[i], i, obj);
        }
    }
    else {
        for (const k in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, k)) {
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
function extend(x, y, tsArg) {
    forEach(y, (val, k) => {
        if (tsArg && isFunction(val)) {
            x[k] = bind(val, tsArg);
        }
        else {
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
    if (con.charCodeAt(0) === 0xFEFF) {
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
    if (props) {
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
            }
            else {
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
    while ((match = regex.exec(str)) !== null) {
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
    return Object.prototype.hasOwnProperty.call(obj, prop);
}
/**
 * build full path URI by combining the base URI and req URI
 * @param {string} baseURL base URI
 * @param {string} reqURI req URI
 * @return {string} the fulll URI path
 */
function buildFullPath(baseURL, reqURL) {
    if (baseURL && !/^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(reqURL)) {
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
                    reader.read().then(({ done, val }) => {
                        if (done) {
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
        .then(data => ({ data }))
        .catch(e => Promise.reject(e));
}
/**
 * set default API URL globally
 * @param {Object} config config object
 * @param {string} base base url
 * @returns {Object} updated config object
 */
function setBaseURL(config, base) {
    config.baseUrl = base;
    return config;
}
/**
 * merge global and req-specific configs
 * @param {Object} globalConfig global config
 * @param {Object} reqConfig req config
 * @returns {Object} merged config
 */
function mergeConfig(globalConfig, reqConfig) {
    const config = Object.assign(Object.assign({}, globalConfig), reqConfig);
    if (globalConfig.headers && reqConfig.headers) {
        config.headers = Object.assign(Object.assign({}, globalConfig.headers), reqConfig.headers);
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
