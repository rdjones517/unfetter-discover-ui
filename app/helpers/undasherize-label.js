import Ember from "ember";

/**
 * Undasherize Label converts a lowercased and dashed string to a capitalized string with spaces
 * 
 * @module
 * @param {Array} values Array with lowercased and dashed string as first element
 * @returns {string} Capitalized string with spaces
 */
export function undasherizeLabel([value]) {
    let label = value;

    if (Ember.isPresent(value)) {
        const valueElements = value.split("-");
        const labelElements = [];
        valueElements.forEach(function(valueElement) {
            let labelElement = Ember.String.capitalize(valueElement);
            if (valueElement === "and") {
                labelElements.push(valueElement);    
            } else if (valueElement === "or") {
                labelElements.push(valueElement);
            } else {
                labelElements.push(labelElement);
            }
            label = labelElements.join(" ");
        });
    }

    return label;
}

export default Ember.Helper.helper(undasherizeLabel);