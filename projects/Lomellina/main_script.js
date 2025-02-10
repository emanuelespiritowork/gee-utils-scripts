/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var AOI = ee.FeatureCollection("projects/ee-emanuelespiritowork/assets/Lomellina");
/***** End of imports. If edited, may not auto-convert in the playground. *****/
/******************************************************
 * Author: Emanuele Spirito
 * Copyright: 2025
 * See latest stable version on my GitHub at 
 * https://github.com/emanuelespiritowork/gee-utils-scripts
*******************************************************/

/******************************************************
 * PURPOSE OF THIS SCRIPT
 * Create Lomellina time series
*******************************************************/

/******************************************************
 * LIBRARIES
*******************************************************/

var s2_ndvi = require("users/emanuelespiritowork/SharedRepo:functions/s2_ndvi.js");
var s2_mask = require("users/emanuelespiritowork/SharedRepo:functions/s2_mask.js");
var s2_scale = require("users/emanuelespiritowork/SharedRepo:functions/s2_scale.js");
var clip_to = require("users/emanuelespiritowork/SharedRepo:functions/clip_to.js");

/******************************************************
 * SCRIPT
*******************************************************/

var s2_coll = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED");

var s2_mask = 

var ndvi = s2_ndvi.s2_ndvi(s2_coll);

