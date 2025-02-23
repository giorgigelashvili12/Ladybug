'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const toObj_js_1 = __importDefault(require("./toObj.js"));
const ignored = (0, toObj_js_1.default)([
    'age', 'authorization', 'content-length', 'content-type', 'etag',
    'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
    'last-modified', 'location', 'max-forwards', 'proxy-authorization',
    'referer', 'retry-after', 'user-agent',
    'accept', 'accept-language', 'accept-encoding', 'cache-control',
    'connection', 'content-disposition', 'content-encoding',
    'content-language', 'content-range', 'cookie', 'date', 'etag',
    'if-match', 'if-none-match', 'if-range', 'link', 'location',
    'max-age', 'pragma', 'range', 'referrer-policy', 'set-cookie',
    'transfer-encoding', 'vary', 'via', 'x-forwarded-for',
    'x-frame-options', 'x-request-id', 'x-xss-protection'
]);
/**
 * @param {string} rawHeaders - The raw headers to convert
 * @returns {Object} - Headers parsed into an object
 */
const rawHeaders = r => {
    const headers = {};
    let k;
    let v;
    let ind;
    // undefined/null check
    r && r.split('\n').forEach(function parser(line) {
        ind = line.indexOf(':'); // find index of colon
        k = line.substring(0, ind).trim().toLowerCase();
        v = line.substring(ind + 1).trim();
        // exraction of k and v from line
        // checck validity of k
        if (!k || (headers[k] && ignored[k])) {
            return;
        }
        // handle header
        if (k === 'set-cookie') {
            if (headers[k]) {
                headers[k].push(v);
            }
            else {
                headers[k] = [v];
            }
        }
        else {
            // check if it exists. if yes append v, else set to v
            headers[k] = headers[k] ? headers[k] + ', ' + v : v;
        }
    });
};
exports.default = rawHeaders;
