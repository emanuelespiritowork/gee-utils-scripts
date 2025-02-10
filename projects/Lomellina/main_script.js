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
var pixel_percentage = require("users/emanuelespiritowork/SharedRepo:functions/pixel_percentage.js");

/******************************************************
 * SCRIPT
*******************************************************/

var s2_coll = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED");

var scale_to_use = ee.Number(10);

var clip = clip_to.clip_to(s2_coll,AOI,scale_to_use);

var mask = s2_mask.s2_mask(clip);

var scale = s2_scale.s2_scale(mask);

var ndvi = s2_ndvi.s2_ndvi(scale);

Map.addLayer(ndvi.first());

