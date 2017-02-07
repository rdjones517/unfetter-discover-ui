import Ember from 'ember';

/**
 * Attack Pattern Service supports grouping and sorting records using Kill Chain Phases
 * 
 * @module
 * @extends ember/Service
 */
export default Ember.Service.extend({
    /** 
     * Set Sort Key for Phase Name based on standard ordering
     * 
     * @type {Object}
     */
    phaseNameSortKeys: {
        "persistence": 10,
        "privilege-escalation": 20,
        "defense-evasion": 30,
        "credential-access": 40,
        "discovery": 50,
        "lateral-movement": 60,
        "execution": 70,
        "collection": 80,
        "exfiltration": 90,
        "command-and-control": 100
    },

    /**
     * Get Attack Patterns grouped based on Kill Chain Phase Name
     * 
     * @param {Array} attackPatterns Attack Patterns
     * @return {Object} Hash of Phase Name to Attack Patterns
     */
    getPhaseNameAttackPatterns(attackPatterns) {
        const hash = {};

        attackPatterns.forEach(function(attackPattern) {
            let killChainPhases = attackPattern.get("kill_chain_phases");
            killChainPhases.forEach(function(killChainPhase) {
                let phaseName = killChainPhase.phase_name;
                let attackPatternsProxies = hash[phaseName];
                if (attackPatternsProxies === undefined) {
                    attackPatternsProxies = [];
                    hash[phaseName] = attackPatternsProxies;
                }

                let attackPatternProxy = Ember.ObjectProxy.create({
                    content: attackPattern
                });

                attackPatternsProxies.push(attackPatternProxy);
            });
        });
        
        return hash;
    },

    /**
     * Get Phase Name Groups
     * 
     * @param {Array} attackPatterns Attack Patterns
     * @return {Array} Array of Phase Name Groups
     */
    getPhaseNameGroups(attackPatterns) {
        const phaseNameAttackPatterns = this.getPhaseNameAttackPatterns(attackPatterns);

        const phaseNameGroups = [];

        for (let phaseName in phaseNameAttackPatterns) {
            let attackPatternsSorted = phaseNameAttackPatterns[phaseName];
            attackPatternsSorted.sortBy("name");

            let phaseNameGroup = Ember.Object.create({
                phaseName: phaseName,
                attackPatterns: attackPatternsSorted
            });

            phaseNameGroups.push(phaseNameGroup);
        }

        phaseNameGroups.sort(Ember.$.proxy(this.phaseNameSortHandler, this));

        return phaseNameGroups;
    },

    /**
     * Phase Name Sort Handler based on standard ordering
     * 
     * @param {Object} first First Object
     * @param {Object} second Second Object
     * @return {number} Sort Order Comparison
     */
    phaseNameSortHandler(first, second) {        
        const firstNumber = this.phaseNameSortKeys[first.phaseName];
        const secondNumber = this.phaseNameSortKeys[second.phaseName];

        if (firstNumber < secondNumber) {
            return -1;
        }
        if (firstNumber > secondNumber) {
            return 1;
        }
        return 0;
    }
});