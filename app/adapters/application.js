import DS from "ember-data";

/**
 * Application Adapter with custom response handling for HTTP Headers
 *
 * @module
 * @extends ember-data/JSONAPIAdapter
 */
export default DS.JSONAPIAdapter.extend({
    namespace: "cti-stix-store-api",

    securityMarkingLabelHeader: "Security-Marking-Label",

    securityMarkingLabel: undefined,

    /**
     * Handle Response and process headers
     *
     * @param {number} status HTTP Response Status
     * @param {Object} headers HTTP Response Headers
     * @returns {Object} Processed Response Object
     */
    handleResponse(status, headers) {
        this.handleResponseHeaders(headers);
        return this._super(...arguments);
    },

    /**
     * Handle Response HTTP Headers and set Security Marking Label
     *
     * @param {Object} headers HTTP Response Headers
     * @returns {undefined}
     */
    handleResponseHeaders(headers) {
        let securityMarkingLabel = headers[this.securityMarkingLabelHeader];
        if (securityMarkingLabel) {
            this.set("securityMarkingLabel", securityMarkingLabel);
        }
    }
});
