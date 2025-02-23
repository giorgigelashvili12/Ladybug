'use strict';

//import utils from "../utils.js";
import { ERR_CODES } from "../assets/errorSet.js";

interface ErrorConfig {
    message: string;
    name: string; 
    code: string;
    config: any;
    request: any;
    response: any;
    status: number | null;
    data: any;
    stack?: string;
}

/**
 * Custom error constructor for handling API errors
 * @param {string} msg error message
 * @param {string} [code] error code
 * @param {Object} [config] request configuration
 * @param {Object} [req] request object
 * @param {Object} [res] response object
 */
export default function errStack(
    this: ErrorConfig,
    msg: string,
    code?: string,
    config?: any,
    req?: any,
    res?: any 
) {
    Error.call(this);
    if(Error.captureStackTrace) {
        Error.captureStackTrace(this, errStack);
    } else {
        this.stack = (new Error()).stack;
    }

    this.message = msg || 'an error occured';
    this.name = 'LadybugError';
    this.code = code || ERR_CODES.CUSTOM;
    this.config = config || null;
    this.request = req || null;
    this.response = res || null;
    this.status = res?.status || null;
    this.data = res?.data || null;
}

errStack.prototype = Object.create(Error.prototype);
errStack.prototype.constructor = errStack;

errStack.prototype.toJSON = function toJSON() {
    return {
        message: this.message,
        name: this.name,
        code: this.code,
        config: this.config,
        request: this.request,
        response: this.response,
        status: this.status,
        data: this.data,
        stack: this.stack 
    };
};