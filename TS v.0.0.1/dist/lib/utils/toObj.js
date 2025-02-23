"use strict";
/**
 * Convert an array of strings to an object
 * @param {string[]} array - The array to convert
 * @returns {Object} - The object created from the array
*/
Object.defineProperty(exports, "__esModule", { value: true });
const toObj = (arr) => {
    const set = {};
    arr.forEach((item) => {
        set[item] = true;
    });
    return set;
};
exports.default = toObj;
