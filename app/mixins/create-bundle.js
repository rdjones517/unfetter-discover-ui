import Ember from "ember";
import { v4 } from "ember-uuid";
/**
 * Converts a STIX object into a bundle
 *
 * @module
 * @extends ember/Mixin
 */


export default Ember.Mixin.create({
    /** @type {Object} */
   saveData: function(data, fileName) {
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";

        var json = JSON.stringify(data, undefined, "    "),
            blob = new Blob([json], {type: "application/json"}),
            url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
    },
    typePathMapping: {
                attack_patterns: "attack-pattern",
                campaigns: "campaign",
                courses_of_action: "course-of-action",
                indicators: "indicator",
                relationships: "relationship",
                malware: "malware",
                marking_definitions: "marking-definition",
                reports: "report",
                threat_actors: "threat-actor",
                tools: "tool",
                intrusion_sets: "intrusion-set"
            },
    actions: {
        /**
         * Generate and return a bundle object
         *
         * @function actions:createBundle
         * @param {Object} STIX object(s) to be bundled
         * @returns {Object}
         */
        downloadBundle(items) {

            let bundleObject = {};
            bundleObject.type = "bundle";
            bundleObject.id = "bundle--"+v4();
            bundleObject.spec_version = "2.0";
            /**
             * Go through all the STIX objects, and create the bundle object array.  This allows us to pass a list
             * of any type of STIX objects, and multiple types in one array.
             */
            let bundleName = "empty";
            let createBundleObject = this;
            items.forEach(function(item){
                let typeValue = item.id.substr(0,item.id.indexOf("--"));
                let keyValue = Object.keys(createBundleObject.typePathMapping).find(key => createBundleObject.typePathMapping[key] === typeValue);
                bundleObject[keyValue]=[];
                if (bundleName === "empty"){
                    bundleName=keyValue;
                } else if (bundleName !== keyValue) {
                    bundleName = "bundle";

                }
            });
            items.forEach(function(item){
                let typeValue = item.id.substr(0,item.id.indexOf("--"));
                let keyValue=Object.keys(createBundleObject.typePathMapping).find(key => createBundleObject.typePathMapping[key] === typeValue);
                let jsonItem = item.toJSON();
                /**
                 * Rebuilding the missing ID and Value into the STIX object
                 */
                jsonItem.id = item.id;
                jsonItem.type = typeValue;
                bundleObject[keyValue].push(jsonItem);
            });

            this.saveData(bundleObject,bundleName+".json");
            return bundleObject;
        }
    }
});
