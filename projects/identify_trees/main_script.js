/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var AOI = 
    /* color: #d63000 */
    /* shown: false */
    ee.Geometry.Polygon(
        [[[-50.782671292638184, -11.609685756929462],
          [-50.7778647740835, -11.655250516519137],
          [-50.707483609532716, -11.649870564495261],
          [-50.71761163077295, -11.6034641597931]]]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
var s2_coll = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED");

var mosaic_recent = require("users/emanuelespiritowork/SharedRepo:functions/mosaic_recent.js");
var plot_stretch = require("users/emanuelespiritowork/SharedRepo:functions/plot_stretch.js");

var mosaic = mosaic_recent.mosaic_recent(s2_coll,AOI,10);

var null_var = plot_stretch.plot_stretch(mosaic,undefined,2,10);
