import Ember from "ember";
import undasherizeLabel from "unfetter-discover-ui/helpers/undasherize-label";

/**
 * Intrusion Sets Dashboard Controller for visualization for records associated with Intrusion Set model
 *
 * @module
 * @extends ember/Controller
 */
export default Ember.Controller.extend({
    queryParams: ["intrusionSetId", "phaseNameSelected", "attackPatternsExpanded"],

    intrusionSetId: null,

    phaseNameSelected: null,

    attackPatternsExpanded: false,

    markerColor: "#239fdd",

    comparisonColor: "#c1272c",

    comparisonOpacity: 0.75,

    /**
     * Attack Pattern Service for calculating groups
     *
     * @type {Object}
     */
    attackPatternService: Ember.inject.service("attack-pattern"),

    /**
     * Phase Name Attack Patterns group on Attack Pattern Kill Chain Phases
     *
     * @function
     * @return {Array} Array of Kill Chain Phase Name groups of Attack Patterns
     */
    phaseNameAttackPatterns: Ember.computed("intrusionSetAttackPatterns", function() {
        const attackPatterns = this.get("intrusionSetAttackPatterns");
        return this.get("attackPatternService").getPhaseNameAttackPatterns(attackPatterns);
    }),

    /**
     * Intrusion Sets
     *
     * @return {Array}
     */
    intrusionSets: Ember.computed("intrusionSet", "model.intrusionSets", function() {
        const intrusionSets = this.get("model.intrusionSets");
        const proxiedintrusionSets = [];
        const selectedintrusionSet = this.get("intrusionSet");
        const selectedintrusionSetId = selectedintrusionSet.get("id");

        intrusionSets.forEach((intrusionSet) => {
            const intrusionSetId = intrusionSet.get("id");
            const selected = (selectedintrusionSetId === intrusionSetId);
            const proxiedintrusionSet = Ember.ObjectProxy.create({
                content: intrusionSet,
                selected: selected
            });
            proxiedintrusionSets.push(proxiedintrusionSet);
        });

        return proxiedintrusionSets;
    }),

    /**
     * Intrusion Sets Selected
     *
     * @return {Array}
     */
    intrusionSetsSelected: Ember.computed("intrusionSets.@each.selected", function() {
        const intrusionSets = this.get("intrusionSets");
        return intrusionSets.filterBy("selected");
    }),

    /**
     * Intrusion Sets Selected Plot Data
     *
     * @return {Array}
     */
    intrusionSetsSelectedPlotData: Ember.computed("intrusionSetsSelected", function() {
        const intrusionSetsSelected = this.get("intrusionSetsSelected");
        const selectedintrusionSet = this.get("intrusionSet");
        const selectedintrusionSetId = selectedintrusionSet.get("id");

        let data = [];
        let order = 1;
        const selectedOrder = 0;

        const markerColor = this.get("markerColor");
        intrusionSetsSelected.forEach((intrusionSet) => {
            const intrusionSetId = intrusionSet.get("id");
            const selected = (selectedintrusionSetId === intrusionSetId);
            let phaseNameAttackPatterns = this.getintrusionSetPhaseNameAttackPatterns(intrusionSet);

            const t = [];
            const r = [];

            for (let phaseName in phaseNameAttackPatterns) {
                const phaseNameDescription = phaseNameAttackPatterns[phaseName];

                const label = undasherizeLabel.compute([phaseName]);
                t.push(label);
                r.push(phaseNameDescription.attackPatternsUsedPercentRounded);
            }

            const series = {
                t: t,
                r: r,
                type: "area",
                name: intrusionSet.get("name"),
                order: order++
            };
            if (selected) {
                series.order = selectedOrder;
            }

            data.push(series);
        }, this);

        data = data.sortBy("order");
        if (data.length) {
            data[0].marker = {
                color: markerColor
            };
        }

        this.setPlaceholderSeries(data);
        this.setComparisonColors(data);
        return data;
    }),

    /**
     * Intrusion Set Phase Name Plot with Labels and Values
     *
     * @return {Object}
     */
    intrusionSetPhaseNamePlot: Ember.computed("intrusionSetPhaseNameAttackPatterns", function() {
        const intrusionSetPhaseNameAttackPatterns = this.get("intrusionSetPhaseNameAttackPatterns");
        const labels = [];
        const values = [];

        for (let phaseName in intrusionSetPhaseNameAttackPatterns) {
            const phaseNameDescription = intrusionSetPhaseNameAttackPatterns[phaseName];

            const label = undasherizeLabel.compute([phaseName]);
            labels.push(label);
            values.push(phaseNameDescription.attackPatternsUsedPercentRounded);
        }

        const intrusionSetPhaseNamePlot = {
            labels: labels,
            values: values
        };

        return intrusionSetPhaseNamePlot;
    }),

    /**
     * Phase Name Attack Patterns group on Attack Pattern Kill Chain Phases
     *
     * @function
     * @return {Array} Array of Kill Chain Phase Name groups of Attack Patterns
     */
    intrusionSetPhaseNameAttackPatterns: Ember.computed("intrusionSet", "phaseNameAttackPatterns", function() {
        const intrusionSet = this.get("intrusionSet");
        return this.getintrusionSetPhaseNameAttackPatterns(intrusionSet);
    }),

    /**
     * Percent Attack Patterns Used
     *
     */
    percentAttackPatternsUsed: Ember.computed("usesAttackPatternRelationships", "model.attackPatterns", function() {
        let percentUsedRounded = 0;
        const usesAttackPatternRelationships = this.get("usesAttackPatternRelationships");
        if (usesAttackPatternRelationships) {
            const numberUsed = usesAttackPatternRelationships.get("length");
            const attackPatterns = this.get("model.attackPatterns");
            if (attackPatterns) {
                const numberTotal = attackPatterns.get("length");
                const percentUsed = numberUsed / numberTotal * 100;
                percentUsedRounded = Math.round(percentUsed);
            }
        }

        return percentUsedRounded;
    }),

    /**
     * Intrusion Set
     *
     * @return {Object}
     */
    intrusionSet: Ember.computed("model.intrusionSets", "intrusionSetId", function() {
        const intrusionSets = this.get("model.intrusionSets");
        let intrusionSet;

        const intrusionSetId = this.get("intrusionSetId");
        if (intrusionSetId) {
            intrusionSet = intrusionSets.findBy("id", intrusionSetId);
        } else {
            intrusionSet = intrusionSets.objectAt(0);
        }

        return intrusionSet;
    }),

    /**
     * Uses Attack Pattern Relationships
     *
     * @return {Array}
     */
    usesAttackPatternRelationships: Ember.computed("intrusionSet", "model.relationships", function() {
        const intrusionSet = this.get("intrusionSet");
        return this.getAttackPatternRelationships(intrusionSet);
    }),

    /**
     * Intrusion Set Attack Patterns
     *
     * @return {Array}
     */
    intrusionSetAttackPatterns: Ember.computed("intrusionSet", "usesAttackPatternRelationships", "model.attackPatterns", function() {
        const intrusionSet = this.get("intrusionSet");
        return this.getAttackPatternsUsed(intrusionSet);
    }),

    /**
     * Get Attack Pattern Relationships for Intrusion Set
     *
     * @param {Object} intrusionSet Intrusion Set
     * @return {Array} Relationships related to specified Intrusion Set
     */
    getAttackPatternRelationships(intrusionSet) {
        const relationships = this.get("model.relationships");

        const intrusionSetId = intrusionSet.get("id");
        const intrusionSetRelationships = relationships.filterBy("source_ref", intrusionSetId);
        return intrusionSetRelationships.filter((relationship) => {
            const targetRef = relationship.get("target_ref");
            let included = false;
            if (targetRef.indexOf("attack-pattern") === 0) {
                included = true;
            }
            return included;
        });
    },

    /**
     * Get Attack Patterns used for Intrusion Set
     *
     * @param {Object} intrusionSet Intrusion Set
     * @return {Array} Attack Patterns related to specified Intrusion Set
     */
    getAttackPatternsUsed(intrusionSet) {
        const attackPatterns = this.get("model.attackPatterns");
        const intrusionSetAttackPatterns = [];

        const usesAttackPatternRelationships = this.getAttackPatternRelationships(intrusionSet);
        attackPatterns.forEach((attackPattern) => {
            const attackPatternId = attackPattern.get("id");
            const relationship = usesAttackPatternRelationships.findBy("target_ref", attackPatternId);
            const attackPatternProxy = Ember.ObjectProxy.create({
                content: attackPattern,
                relationship: relationship
            });
            intrusionSetAttackPatterns.push(attackPatternProxy);
        });

        return intrusionSetAttackPatterns;
    },

    /**
     * Get Intrusion Set Phase Name Attack Patterns based on Attack Patterns Used
     *
     * @param {Object} intrusionSet Intrusion Set
     * @return {Object} Phase Name Descriptions of Attack Patterns related to specified Intrusion Set keyed on Phase Name label
     */
    getintrusionSetPhaseNameAttackPatterns(intrusionSet) {
        const attackPatternsUsed = this.getAttackPatternsUsed(intrusionSet);
        const phaseNameAttackPatterns = this.get("attackPatternService").getPhaseNameAttackPatterns(attackPatternsUsed);

        const intrusionSetPhaseNameAttackPatterns = {};
        for (let phaseName in phaseNameAttackPatterns) {
            const attackPatterns = phaseNameAttackPatterns[phaseName];
            const attackPatternsUsed = attackPatterns.filterBy("relationship");
            const attackPatternsUsedNumber = attackPatternsUsed.get("length");
            const attackPatternsUsedPercentRounded = Math.round(attackPatternsUsedNumber / attackPatterns.get("length") * 100);

            const phaseNameDescription = {
                attackPatterns: attackPatterns,
                attackPatternsUsedNumber: attackPatternsUsedNumber,
                attackPatternsUsedPercentRounded: attackPatternsUsedPercentRounded
            };
            intrusionSetPhaseNameAttackPatterns[phaseName] = phaseNameDescription;
        }
        return intrusionSetPhaseNameAttackPatterns;
    },

    /**
     * Set Comparison Colors on Data Series
     *
     * @param {Array} data Data Series Records
     */
    setComparisonColors(data) {
        let comparisonColorNotSet = true;
        const comparisonColor = this.get("comparisonColor");
        const comparisonOpacity = this.get("comparisonOpacity");
        data.forEach((series) => {
            if (series.marker === undefined) {
                series.marker = {
                    opacity: comparisonOpacity
                };
            }

            if (comparisonColorNotSet) {
                const intrusionSetName = this.get("intrusionSet.name");
                if (intrusionSetName !== series.name) {
                    series.marker.color = comparisonColor;
                    comparisonColorNotSet = false;
                }
            }
        });
    },

    /**
     * Set Placeholder Series objects to override default values from Polar Charts
     *
     * @param {Array} data Data Series Records
     */
    setPlaceholderSeries(data) {
        if (data.length === 1) {
            const first = data[0];
            const cloned = Ember.copy(first, true);
            cloned.showlegend = false;
            cloned.opacity = 0;
            data.push(cloned);
            data.push(cloned);
        } else if (data.length === 2) {
            const first = data[0];
            const cloned = Ember.copy(first, true);
            cloned.showlegend = false;
            cloned.opacity = 0;
            data.push(cloned);
        }

    }
});
