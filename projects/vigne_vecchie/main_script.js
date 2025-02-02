/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var aoi = /* color: #d63000 */ee.Feature(
        ee.Geometry.Polygon(
            [[[8.667363735022805, 45.45548958753395],
              [8.667798252883218, 45.45468054930045],
              [8.668779941382668, 45.45496653623484],
              [8.668329330268167, 45.455824488336106]]]),
        {
          "area": "vigne",
          "system:index": "0"
        }),
    geometry = /* color: #98ff00 */ee.Feature(
        ee.Geometry.Polygon(
            [[[8.683478950314857, 44.38985101866895],
              [8.685641226128297, 44.389347748219464],
              [8.686666528643507, 44.390694741668156],
              [8.684858161803355, 44.39183688780296]]]),
        {
          "area": "water",
          "system:index": "0"
        });
/***** End of imports. If edited, may not auto-convert in the playground. *****/
/******************************************************
 * Author: Emanuele Spirito
 * Copyright: 2025
 * See latest stable version on my GitHub at 
 * https://github.com/emanuelespiritowork/gee-utils-scripts
*******************************************************/

/******************************************************
 * FUNCTIONS
*******************************************************/

var clip_to = require("users/emanuelespiritowork/SharedRepo:functions/clip_to.js");
var landsat_mask = require("users/emanuelespiritowork/SharedRepo:functions/landsat_mask.js");
var landsat_scale = require("users/emanuelespiritowork/SharedRepo:functions/landsat_scale.js");
var landsat_ndwi = require("users/emanuelespiritowork/SharedRepo:functions/landsat_ndwi.js");
var time_series_create = require("users/emanuelespiritowork/SharedRepo:functions/time_series_create.js");
var time_series_get_plot = require("users/emanuelespiritowork/SharedRepo:functions/time_series_get_plot.js");

/******************************************************
 * ABOUT THIS PROJECT
 * I computed the time series of ndwi to see if any flooding happened to the Vigne Vecchie
 * street of Pernate, 28100, Novara, Italy
*******************************************************/

var AOI = ee.FeatureCollection(ee.List([aoi,geometry]));

//var AOI = ee.FeatureCollection(aoi);

var l8_coll = ee.ImageCollection("LANDSAT/LC08/C02/T1_L2")
.filterDate("2013-01-01","2025-01-25")
.filterBounds(AOI);

//Map.addLayer(l8_coll);

var scale_to_use = ee.Number(30);

var l8_clipped = clip_to.clip_to(l8_coll,AOI,scale_to_use);

var l8_masked = landsat_mask.landsat_mask(l8_clipped);

var l8_scaled = landsat_scale.landsat_scale(l8_masked);

var ndwi = landsat_ndwi.landsat_ndwi(l8_scaled);

print(AOI);

var time_series = time_series_create.time_series_create(ndwi, AOI, "area", scale_to_use);

var plot = time_series_get_plot.time_series_get_plot(time_series,"ndwi");

print(time_series);
//print(time_series.sort("ndwi2",false).first().get("ndwi2"));
print(plot);



//Map.addLayer(ndwi);












