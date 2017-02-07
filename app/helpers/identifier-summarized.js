import Ember from "ember";

/**
 * Identifier Summarized returns trailing section of UUID
 * 
 * @module
 * @param {Array} values Array with identifier as first element
 * @returns {string} Trailing section of UUID
 */
export function identifierSummarized([value]) {
    let summarized = value;

    if (Ember.isPresent(value)) {
        const valueElements = value.split("--");
        if (valueElements.length === 2) {
            const id = valueElements[1];
            const idSummary = id.substring(29);
            summarized = idSummary;
        }
    }

    return summarized;
}

export default Ember.Helper.helper(identifierSummarized);