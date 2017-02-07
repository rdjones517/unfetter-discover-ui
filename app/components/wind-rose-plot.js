/* global Plotly */
import Ember from "ember";

/**
 * Wind Rose Plot Component based on Plotly.js for rendering Wind Rose Charts
 *
 * @module
 * @extends ember/Component
 */
export default Ember.Component.extend({
    type: "area",

    data: undefined,

    values: [45, 65],

    labels: [],

    title: undefined,

    height: 200,

    width: 200,

    showlegend: false,

    displayModeBar: false,

    marginLeft: 0,

    marginRight: 0,

    marginTop: 0,

    marginBottom: 0,

    markerColor: undefined,

    annotationText: undefined,

    annotationFontSize: undefined,

    orientation: 270,

    radialOrientation: 0,

    ticksuffix: undefined,

    showline: true,

    angularTicksCount: 10,

    /** @type {function} */
    plotlyClick: undefined,

    /**
     * Did Insert Element calls newPlot() to render charts
     *
     * @override
     * @returns {undefined}
     */
    didInsertElement() {
        this._super(...arguments);

        this.newPlot();
    },

    /**
     * Values Observer monitors the values array and schedules invocation of newPlot() method on render
     *
     * @function
     * @returns {undefined}
     */
    valuesObserver: Ember.observer("values.[]", "data", function() {
        Ember.run.scheduleOnce("render", this, this.newPlot);
    }),

    /**
     * New Plot gathers configuration settings and renders Plotly Pie Charts
     *
     * @returns {undefined}
     */
    newPlot() {
        const data = this.getData();
        const layout = this.getLayout();
        const options = this.getOptions();

        Plotly.newPlot(this.element, data, layout, options);
        this.setEvents();
    },

    /**
     * Set Events adds listener for plotly_click Events when plotlyClick property is configured
     *
     * @returns {undefined}
     */
    setEvents() {
        const plotlyClick = this.get("plotlyClick");
        if (plotlyClick instanceof Function) {
            this.element.on("plotly_click", plotlyClick);
        }
    },

    /**
     * Get Data for plotting
     *
     * @returns {Array} Array of Data Values and associated configuration
     */
    getData() {
        let data = this.get("data");
        if (data === undefined) {
            data = [];
            const series = {};

            series.r = this.get("values");
            series.t = this.get("labels");
            series.type = this.get("type");

            series.marker = {};
            series.marker.color = this.get("markerColor");

            data.push(series);
        }

        return data;
    },

    /**
     * Get Layout Options
     *
     * @returns {Object} Layout Options for plotting
     */
    getLayout() {
        const layout = {};

        layout.height = this.get("height");
        layout.width = this.get("width");
        layout.showlegend = this.get("showlegend");
        layout.orientation = this.get("orientation");
        layout.title = this.get("title");

        layout.margin = {};
        layout.margin.l = this.get("marginLeft");
        layout.margin.r = this.get("marginRight");
        layout.margin.b = this.get("marginBottom");
        layout.margin.t = this.get("marginTop");

        const annotationText = this.get("annotationText");
        if (annotationText) {
            const annotation = {
                text: annotationText,
                showarrow: false
            };
            const annotationFontSize = this.get("annotationFontSize");
            if (annotationFontSize) {
                annotation.font = {
                    size: annotationFontSize
                };
            }
            layout.annotations = [
                annotation
            ];
        }

        layout.radialaxis = {};
        layout.radialaxis.ticksuffix = this.get("ticksuffix");
        layout.radialaxis.orientation = this.get("radialOrientation");

        layout.angularaxis = {};
        layout.angularaxis.ticksCount = this.get("angularTicksCount");

        return layout;
    },

    /**
     * Get Options for plotting
     *
     * @returns {Object} Options
     */
    getOptions() {
        const options = {};

        options.displayModeBar = this.get("displayModeBar");

        return options;
    }
});
