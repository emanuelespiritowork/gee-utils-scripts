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
    not_aoi = /* color: #d63000 */ee.Feature(
        ee.Geometry.Polygon(
            [[[8.569313683898438, 45.7473038418586],
              [8.569478821854508, 45.747012069033346],
              [8.569768500428117, 45.74713934585177]]]),
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
var landsat_ndfi = require("users/emanuelespiritowork/SharedRepo:functions/landsat_ndfi.js");
var time_series_create = require("users/emanuelespiritowork/SharedRepo:functions/time_series_create.js");
var time_series_get_plot = require("users/emanuelespiritowork/SharedRepo:functions/time_series_get_plot.js");

/******************************************************
 * ABOUT THIS PROJECT
 * I computed the time series of NDFI to see if any flooding happened to the Vigne Vecchie
 * street of Pernate, 28100, Novara, Italy
*******************************************************/

var AOI = ee.FeatureCollection(ee.List([aoi]));

var l8_coll = ee.ImageCollection("LANDSAT/LC08/C02/T1_L2")
.filterDate("2023-01-01","2025-01-25")
.filterBounds(aoi);

Map.addLayer(l8_coll);

var scale_to_use = ee.Number(30);

var l8_clipped = clip_to.clip_to(l8_coll,AOI,scale_to_use);

var l8_masked = landsat_mask.landsat_mask(l8_clipped);

var l8_scaled = landsat_scale.landsat_scale(l8_masked);

var ndfi = landsat_ndfi.landsat_ndfi(l8_scaled);

print(AOI);

var time_series = time_series_create.time_series_create(ndfi, AOI, "area", scale_to_use);

var plot = time_series_get_plot.time_series_get_plot(time_series,"ndfi2");

print(time_series);
print(time_series.sort("ndfi2",false).first().get("ndfi2"));
print(plot);



Map.addLayer(ndfi);












