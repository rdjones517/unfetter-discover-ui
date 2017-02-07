import Ember from "ember";

/**
 * STIX Object Icon Switch
 *
 * @module
 * @extends ember/Component
 */
export default Ember.Component.extend({
    classNames: ["stix-object-icon-switch"],

    classNameBindings: ["checked:checked:unchecked"],

    checked: false,

    click() {
        let checked = this.get("checked");
        if (checked) {
            checked = false;
        } else {
            checked = true;
        }
        this.set("checked", checked);
    }
});
