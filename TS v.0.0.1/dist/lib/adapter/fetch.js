"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fetchClient_js_1 = __importDefault(require("../utils/fetchClient.js"));
const FetchClient = new fetchClient_js_1.default();
const fetchAdapter = (config) => {
    const { url, method, headers, data, signal } = config;
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
};
exports.default = fetchAdapter;
