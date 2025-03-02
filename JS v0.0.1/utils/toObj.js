/**
 * convert an array of strings to an object
 * @param {string[]} arr array to convert
 * @returns {Object} object created from the array
 */

const toObj = (arr) => { 
    const set = {};
    arr.forEach((item) => {
        set[item] = true;
    });
    return set;
};

export default toObj;