/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var AOI = /* color: #d63000 */ee.Geometry.Polygon(
        [[[8.667363735022805, 45.45548958753395],
          [8.667798252883218, 45.45468054930045],
          [8.668779941382668, 45.45496653623484],
          [8.668329330268167, 45.455824488336106]]]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
/******************************************************
 * Author: Emanuele Spirito
 * Copyright: 2025
 * See latest stable version on my GitHub at 
 * https://github.com/emanuelespiritowork/gee-utils-scripts
*******************************************************/

/******************************************************
 * ABOUT THIS PROJECT
 * I computed the time series of NDFI to see if any flooding happened to the Vigne Vecchie
 * street of Pernate, 28100, Novara, Italy
*******************************************************/

/******************************************************
 * FUNCTIONS
*******************************************************/

var clip_to = require("users/emanuelespiritowork/SharedRepo:functions/clip_to.js");
var landsat_mask = require("users/emanuelespiritowork/SharedRepo:functions/landsat_mask.js");
var landsat_scale = require("users/emanuelespiritowork/SharedRepo:functions/landsat_scale.js");

var l8_coll = ee.ImageCollection("LANDSAT/LC08/C02/T1_L2")
.filterDate("2013-01-01","2025-01-25");

var scale_to_use = ee.Number(30);

var l8_clipped = clip_to.clip_to(l8_coll,AOI,scale_to_use);

var l8_masked = landsat_mask.landsat_mask(l8_clipped);

var l8_scaled = landsat_scale.landsat_scale(l8_masked);

Map.addLayer(l8_scaled);












