/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var aoi = 
    /* color: #d63000 */
    /* shown: false */
    ee.Feature(
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
            [[[8.627132178290235, 45.48446966563759],
              [8.626732529147016, 45.484291017509406],
              [8.627000750048506, 45.48402210399559],
              [8.627121449454176, 45.48431546412881]]]),
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
var landsat_ndvi = require("users/emanuelespiritowork/SharedRepo:functions/landsat_ndvi.js");
var time_series_create = require("users/emanuelespiritowork/SharedRepo:functions/time_series_create.js");
var time_series_get_plot = require("users/emanuelespiritowork/SharedRepo:functions/time_series_get_plot.js");

/******************************************************
 * ABOUT THIS PROJECT
 * I computed the time series of ndvi to see if any flooding happened to the Vigne Vecchie
 * street of Pernate, 28100, Novara, Italy
*******************************************************/

//var AOI = ee.FeatureCollection(ee.List([aoi,geometry]));

var AOI = ee.FeatureCollection(geometry);

var l8_coll = ee.ImageCollection("LANDSAT/LC08/C02/T1_L2")
.filterDate("2013-01-01","2025-01-25")
.filterBounds(AOI);

//Map.addLayer(l8_coll);

var scale_to_use = ee.Number(30);

var l8_clipped = clip_to.clip_to(l8_coll,AOI,scale_to_use);

var l8_masked = landsat_mask.landsat_mask(l8_clipped);

var l8_scaled = landsat_scale.landsat_scale(l8_masked);


var ndvi = landsat_ndvi.landsat_ndvi(l8_scaled);

print(AOI);

var time_series = time_series_create.time_series_create(ndvi, AOI, "area", scale_to_use);

var plot = time_series_get_plot.time_series_get_plot(time_series,"ndvi");

print(time_series);
//print(time_series.sort("ndvi2",false).first().get("ndvi2"));
print(plot);


Map.addLayer(l8_coll.filterDate("2014-03-28","2014-03-30")
.filterBounds(geometry.geometry()).first());

Map.addLayer(l8_clipped.filterDate("2014-03-28","2014-03-30")
.filterBounds(geometry.geometry()).first());

Map.addLayer(l8_masked.filterDate("2014-03-28","2014-03-30")
.filterBounds(geometry.geometry()).first());

Map.addLayer(l8_scaled.filterDate("2014-03-28","2014-03-30")
.filterBounds(geometry.geometry()).first());

Map.addLayer(ndvi.filterDate("2014-03-28","2014-03-30")
.filterBounds(geometry.geometry()).first());

print(ndvi.filterDate("2014-03-28","2014-03-30")
.filterBounds(geometry.geometry()));

//Map.addLayer(ndvi);
/*
var landsat_mask_img = function(image){
    var qa_pixel_layer = image.select("QA_PIXEL");
    
    var dilated_clouds = 1 << 1;
    var cirrus = 1 << 2;
    var cloud = 1 << 3;
    var cloud_shadow = 1 << 4;
    var snow = 1 << 5;
    
    var dilated_clouds_mask = qa_pixel_layer
    .bitwiseAnd(dilated_clouds).neq(0);
    var cirrus_mask = qa_pixel_layer
    .bitwiseAnd(cirrus).neq(0);
    var cloud_mask = qa_pixel_layer
    .bitwiseAnd(cloud).neq(0);
    var cloud_shadow_mask = qa_pixel_layer
    .bitwiseAnd(cloud_shadow).neq(0);
    var snow_mask = qa_pixel_layer
    .bitwiseAnd(snow).neq(0);
    
    var cloud_confidence_high = ee.Image(3 << 10);
    var cloud_confidence_medium = ee.Image(2 << 10);
    var snow_confidence_high = ee.Image(3 << 12);
    var snow_confidence_medium = ee.Image(2 << 12);
    var cirrus_confidence_high = ee.Image(3 << 14);
    var cirrus_confidence_medium = ee.Image(2 << 14);
    
    var select_cloud_bit = qa_pixel_layer.bitwiseAnd(cloud_confidence_high);
    
    var cloud_confidence_high_mask = select_cloud_bit
    .eq(cloud_confidence_high);
    
    var cloud_confidence_medium_mask = select_cloud_bit
    .eq(cloud_confidence_medium);
    
    var select_snow_bit = qa_pixel_layer.bitwiseAnd(snow_confidence_high);
    
    var snow_confidence_high_mask = select_snow_bit
    .eq(snow_confidence_high);
    
    var snow_confidence_medium_mask = select_snow_bit
    .eq(snow_confidence_medium);
    
    var select_cirrus_bit = qa_pixel_layer.bitwiseAnd(cirrus_confidence_high);
    
    var cirrus_confidence_high_mask = select_cirrus_bit
    .eq(cirrus_confidence_high);
    
    var cirrus_confidence_medium_mask = select_cirrus_bit
    .eq(cirrus_confidence_medium);
    
    
    Map.addLayer(cirrus_confidence_medium_mask);
    Map.addLayer(snow_confidence_medium_mask);
    Map.addLayer(cloud_confidence_medium_mask);
    //Apply masks
    
    var opposite_mask = ee.Image(0)
    .or(dilated_clouds_mask)
    .or(cirrus_mask)
    .or(cloud_mask)
    .or(cloud_shadow_mask)
    .or(snow_mask)
    .or(cloud_confidence_high_mask)
    .or(cloud_confidence_medium_mask)
    .or(snow_confidence_high_mask)
    .or(snow_confidence_medium_mask)
    .or(cirrus_confidence_high_mask)
    .or(cirrus_confidence_medium_mask);
    //.or(image.select("SR_B2").multiply(0.0000275).add(-0.2).gt(5000));//my mask
    
    //creating the xor (1 will be not cloud pixel, 0 will be cloud pixel)
    var mask = opposite_mask.eq(0);
    
    return image.updateMask(mask);
  };
  
var img = l8_coll.filterDate("2014-03-28","2014-03-30")
.filterBounds(ee.Feature(geometry).geometry()).first();
  
var image_mask = landsat_mask_img(l8_coll.filterDate("2014-03-28","2014-03-30")
.filterBounds(ee.Feature(geometry).geometry()).first());

var image_mask_2 = landsat_mask.landsat_mask(l8_coll.filterDate("2014-03-28","2014-03-30")
.filterBounds(ee.Feature(geometry).geometry()).first());

Map.addLayer(img);
Map.addLayer(image_mask);
Map.addLayer(image_mask_2.first());
*/









