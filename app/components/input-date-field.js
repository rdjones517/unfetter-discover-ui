import MaterializeInputDate from "ember-cli-materialize/components/md-input-date";

/**
 * Input Date Field supports setting JavaScript Date property for improved processing
 * 
 * @module
 * @extends ember-cli-materialize/components/md-input-date
 */
export default MaterializeInputDate.extend({
    /** @type {Date} */
    dateValue: undefined,

    /**
     * Did Insert Element adds a set event handler on Date Picker for updating dateValue field
     * 
     * @override
     * @returns {undefined}
     */
    didInsertElement() {
        this._super(...arguments);
        var self = this;
        var picker = this.$(".datepicker").data("pickadate");
        if (picker) {
            picker.on({
                set: function(event) {
                    var date = new Date(event.select);
                    self.set("dateValue", date);
                }
            });

            var dateValue = this.get("dateValue");
            if (dateValue) {
                picker.set("select", dateValue);
            }
        }
    }
});
