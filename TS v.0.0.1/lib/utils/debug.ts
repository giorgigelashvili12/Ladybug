'use strict'

/**
 * improve err msgs and stack traces for better debugging
 * @param {Error} e error obj
 * @returns {Error} enhanced err obj
 */
export default function debug(e: Error): Error {
    console.error(`Error: ${e.message}`);
    console.error(`Stack Trace: ${e.stack}`);
    return e;
}