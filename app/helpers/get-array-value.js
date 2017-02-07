import Ember from "ember";

/**
 * Get Array Value using specified index number
 * 
 * @module
 * @param {Array} values Array with array as first element and index number as second
 * @returns {string} Array Value from specified index number
 */
export function getArrayValue(values) {
    let listOfNames = values[0];
    let index = values[1];
    let value = listOfNames[index];
    return Ember.String.htmlSafe(value);
}

export default Ember.Helper.helper(getArrayValue);