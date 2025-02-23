/**
 * Convert an array of strings to an object  
 * @param {string[]} array - The array to convert
 * @returns {Object} - The object created from the array
*/

interface StringObject {
    [key: string]: boolean;
}

const toObj = (arr: string[]): StringObject => { 
    const set: StringObject = {};
    arr.forEach((item: string) => {
        set[item] = true;
    });
    return set;
};

export default toObj;