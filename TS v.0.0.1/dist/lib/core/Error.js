'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
//import utils from "../utils.js";
const errorSet_js_1 = require("../assets/errorSet.js");
/**
 * Custom error constructor for handling API errors
 * @param {string} msg error message
 * @param {string} [code] error code
 * @param {Object} [config] request configuration
 * @param {Object} [req] request object
 * @param {Object} [res] response object
 */
function errStack(msg, code, config, req, res) {
    Error.call(this);
    if (Error.captureStackTrace) {
        Error.captureStackTrace(this, errStack);
    }
    else {
        this.stack = (new Error()).stack;
    }
    this.message = msg || 'An error occurred';
    this.name = 'CustomError';
    this.code = code || errorSet_js_1.ERR_CODES.CUSTOM;
    this.config = config || null;
    this.request = req || null;
    this.response = res || null;
    this.status = (res === null || res === void 0 ? void 0 : res.status) || null;
    this.data = (res === null || res === void 0 ? void 0 : res.data) || null;
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
exports.default = errStack;
