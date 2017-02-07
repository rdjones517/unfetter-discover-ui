import Ember from "ember";

/**
 * Equals returns matching status
 *
 * @module
 * @param {Array} values Array with values to be compared
 * @returns {boolean} Equals status
 */
export function equals([first, second]) {
    return (first === second);
}

export default Ember.Helper.helper(equals);
