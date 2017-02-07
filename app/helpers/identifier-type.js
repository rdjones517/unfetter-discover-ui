import Ember from "ember";

/**
 * Identifier Type returns type name from first portion of identifier
 * 
 * @module
 * @param {Array} values Array with identifier as first element
 * @returns {string} Type name section of identifier
 */
export function identifierType([value]) {
    let type = value;

    if (Ember.isPresent(value)) {
        let valueElements = value.split("--");
        type = valueElements[0];
    }

    return type;
}

export default Ember.Helper.helper(identifierType);