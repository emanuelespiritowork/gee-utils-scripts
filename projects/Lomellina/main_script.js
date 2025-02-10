/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var AOI = ee.FeatureCollection("projects/ee-emanuelespiritowork/assets/Lomellina");
/***** End of imports. If edited, may not auto-convert in the playground. *****/


var s2_coll = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED");

var ndvi = 