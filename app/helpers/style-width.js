import Ember from "ember";

/**
 * Style Width returns HTML Safe width percentage number
 * 
 * @module
 * @param {Array} values Array with percentage number as first element
 * @returns {string} HTML Safe string containing width percentage number
 */
export function styleWidth([value]) {
    return Ember.String.htmlSafe(`width: ${value}%`);
}

export default Ember.Helper.helper(styleWidth);