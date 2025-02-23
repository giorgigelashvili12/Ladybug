"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_js_1 = __importDefault(require("./http.js"));
const xhr_js_1 = __importDefault(require("./xhr.js"));
const fetch_js_1 = __importDefault(require("./fetch.js"));
const knownAdapters = {
    http: http_js_1.default,
    xhr: xhr_js_1.default,
    fetch: fetch_js_1.default
};
/**
 * returns the correct adapter based on the adapter name
 * throw an error if unkown adapter
 * @param {string} a adapter ('http/xhr/fetch')
 * @returns {Function} the adapter function
 */
const getAdapter = (a) => {
    const adapter = knownAdapters[a];
    if (!adapter) {
        throw new Error(`Unknown adapter: ${a}`);
    }
    return adapter;
};
exports.default = getAdapter;
