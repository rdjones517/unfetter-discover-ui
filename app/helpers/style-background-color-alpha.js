import Ember from "ember";

/**
 * Style Opacity returns HTML Safe width percentage number
 *
 * @module
 * @param {Array} values Array with percentage number as first element
 * @returns {string} HTML Safe string containing opacity percentage number
 */
export function styleBackgroundColorAlpha([red, green, blue, percentAlpha]) {
    return Ember.String.htmlSafe(`background-color: rgba(${red}, ${green}, ${blue}, ${percentAlpha/100}`);
}

export default Ember.Helper.helper(styleBackgroundColorAlpha);
