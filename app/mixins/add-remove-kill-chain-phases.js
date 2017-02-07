import Ember from "ember";

/**
 * Add Remove Kill Chain Phases Mixin for new records
 * 
 * @module
 * @extends ember/Mixin
 */
export default Ember.Mixin.create({
    /** @type {Object} */
    actions: {
        /**
         * Add Kill Chain Phase object to array for editing
         * 
         * @function actions:addKillChainPhase
         * @param {Object} item Object to be created
         * @returns {undefined}
         */
        addKillChainPhase(item) {
            const killChainPhase = {
                kill_chain_name: "kill-chain",
                phase_name: undefined
            };

            let phases = Ember.get(item, "kill_chain_phases");
            phases.pushObject(killChainPhase);
        },

        /**
         * Remove Kill Chain Phase object from array
         * 
         * @function actions:removeKillChainPhase
         * @param {Object} killChainPhase Object to be removed
         * @returns {undefined}
         */
        removeKillChainPhase(killChainPhase) {
            const phases = this.get("model.item.kill_chain_phases");
            phases.removeObject(killChainPhase);
        }
    }
});