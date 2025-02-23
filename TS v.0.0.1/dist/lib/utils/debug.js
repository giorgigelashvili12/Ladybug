'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * improve err msgs and stack traces for better debugging
 * @param {Error} e error obj
 * @returns {Error} enhanced err obj
 */
function debug(e) {
    console.error(`Error: ${e.message}`);
    console.error(`Stack Trace: ${e.stack}`);
    return e;
}
exports.default = debug;
