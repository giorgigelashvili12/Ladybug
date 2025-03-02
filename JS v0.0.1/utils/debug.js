'use strict';

/**
 * improve err messages and stack traces for better debugging
 * @param {Error} e error object
 * @returns {Error} enhanced error object
 */
export default function debug(e) {
    console.error(`Error: ${e.message}`);
    console.error(`Stack trace: ${e.stack}`);
    return e;
}