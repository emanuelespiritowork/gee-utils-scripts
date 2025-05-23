/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var geometry = 
    /* color: #d63000 */
    /* shown: false */
    ee.Geometry.Point([8.559971074299169, 45.247780994502996]),
    geometry2 = 
    /* color: #98ff00 */
    /* shown: false */
    ee.Geometry.Point([8.636188725666356, 45.18925615611129]),
    AOI = ee.FeatureCollection("projects/ee-emanuelespiritowork/assets/sen2rts/Lomellina");
/***** End of imports. If edited, may not auto-convert in the playground. *****/
/******************************************************
 * Author: Emanuele Spirito
 * Copyright: 2025
 * See latest stable version on my GitHub at 
 * https://github.com/emanuelespiritowork/gee-utils-scripts
*******************************************************/

/******************************************************
 * PURPOSE OF THIS SCRIPT
 * Create Lomellina/Chiavenna/JDS time series
*******************************************************/

/******************************************************
 * LIBRARIES
*******************************************************/

var s2_evi = require("users/emanuelespiritowork/SharedRepo:functions/s2_evi.js");
var s2_mask = require("users/emanuelespiritowork/SharedRepo:functions/s2_mask.js");
var s2_scale = require("users/emanuelespiritowork/SharedRepo:functions/s2_scale.js");
var s2_scl_uniform = require("users/emanuelespiritowork/SharedRepo:functions/s2_scl_uniform.js");
var s2_scl_weights = require("users/emanuelespiritowork/SharedRepo:functions/s2_scl_weights.js");
var clip_to = require("users/emanuelespiritowork/SharedRepo:functions/clip_to.js");
var pixel_percentage = require("users/emanuelespiritowork/SharedRepo:functions/pixel_percentage.js");
var plot_map = require("users/emanuelespiritowork/SharedRepo:functions/plot_map.js");
var time_series_create = require("users/emanuelespiritowork/SharedRepo:functions/time_series_create.js");
var time_series_get_plot = require("users/emanuelespiritowork/SharedRepo:functions/time_series_get_plot.js");
var time_series_export = require("users/emanuelespiritowork/SharedRepo:functions/time_series_export.js");

/******************************************************
 * SCRIPT
*******************************************************/

var s2_coll = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
.filterDate("2016-09-01","2025-01-01");

//Map.addLayer(s2_coll.filterBounds(geometry2),undefined,undefined,false);
//print(s2_coll.filterBounds(geometry2));
//Map.addLayer(AOI);

var scale_to_use = ee.Number(10);

var clip = clip_to.clip_to(s2_coll,AOI,scale_to_use);

//print(clip);

//var mask = s2_mask.s2_mask(clip);

//var pixel = pixel_percentage.pixel_percentage(mask,AOI,0.5,scale_to_use);

//var scale = s2_scale.s2_scale(pixel);

//print("scale",scale);

//Map.addLayer(scale.first().geometry());

var scale = s2_scale.s2_scale(clip);

var evi = s2_evi.s2_evi(scale);

print("evi",evi);

print("evi.first().geometry()",evi.first().geometry());

Map.centerObject(AOI);
Map.addLayer(evi.first());

var scl = s2_scl_uniform.s2_scl_uniform(scale,AOI);

var scl_weights = s2_scl_weights.s2_scl_weights(scl,AOI);

//print("scl",scl);
//Map.addLayer(scl);

var evi_scl = scl_weights.combine(evi);

print(evi_scl);

//Map.addLayer(evi_scl);

//print(evi);

//var null_var = plot_map.plot_map(evi.first(),2,scale_to_use);

var time_series = time_series_create.time_series_create(evi_scl,AOI,"field_name",scale_to_use);

//var time_series = time_series_create.time_series_create(evi,AOI,"fid",scale_to_use);

//print(time_series.limit(100));

var null_var = time_series_export.time_series_export(time_series, "Exports_sen2rts", ["evi","qa"]);

//var null_var = time_series_export.time_series_export(time_series, ["evi"], "Exports_sen2rts");

//var plot = time_series_get_plot.time_series_get_plot(time_series, "evi");

/*
print(ee.Date("2025-01-01"));

var min = ee.Date("2022-01-01");
var max = ee.Date("2025-01-01");

plot = plot.setOptions({
    title: "Time series of EVI",
    width: 400,
    height: 240,
    vAxis: {
            viewWindow: {min: 0, max: 1}
          },
    linewidth: 1,
    pointsize: 3,
    interpolateNulls: true
  });
*/
//print(plot);


