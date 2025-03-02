// isFormData, isBlob, isBuffer, isString

'use strict';

/**
 * create a function to test if a value of a specific primitive type
 * @param {string} t a type to test for
 * @returns {Function} function to test
 */
const typeOfTest = (t) => (th) => typeof th === t;

/**
 * check if a value is undefined
 * @param {any} val value to check
 * @returns {boolean} true if value is undefined
 */
const isUndefined = typeOfTest('undefined');

/**
 * check if a value is a form data
 * @param {*} val value to test
 * @returns {boolean} true if value is a form data
 */
const isFormData = (val) => {
    return (typeof FormData !== 'undefined' && val instanceof FormData)
        || (val && val.constructor && val.constructor.name === 'FormData');
};

/**
 * check if a value is a buffer
 * @param {any} val the value to check
 * @returns {boolean} true if value is a buffer
 */
const isBuffer = (val) => {
    return val !== null && !isUndefined(val) && (val instanceof ArrayBuffer || Buffer.isBuffer(val));
}

/**
 * check if a string
 * @param {any} val value to check
 * @returns {boolean} true if a string
 */
const isString = val => {
    return typeof val === 'string';
};

export {
    isFormData,
    isBuffer,
    isString,
}