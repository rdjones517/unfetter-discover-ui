import Ember from "ember";

/**
 * Build the URL of icons based on STIX Object Type
 * 
 * @module
 * @param {stix_type} The name of the stix object.
 * @param {showText} if showText is included as a parameter value, than the text display will show
 * @param {png} if png is included as a parameter value, then the png icon will be displayed.
 * @returns {string} The full URL for the basic version of the .svg
 */
export default Ember.Helper.helper(function(params) {
    let basicValue = params.indexOf("showText") === -1 ? '-b' : '',
        stixType = params[0],
        ext = params.indexOf("png") === -1 ? 'svg' : "png";
    if (ext === "png") {
        basicValue = '';
    }
    return Ember.String.htmlSafe("/unfetter-discover-ui/stix-icons/"+ext+"/"+stixType+basicValue+"."+ext);
});
