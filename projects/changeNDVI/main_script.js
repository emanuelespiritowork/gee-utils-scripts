/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var geometry = /* color: #d63000 */ee.Geometry.Polygon(
        [[[6.624159327632477, 45.67138455329722],
          [6.256117335444977, 45.28815326302539],
          [6.959242335444977, 45.15466545129098],
          [7.544264308101227, 45.50608683737846],
          [8.730787745601226, 45.29588207588355],
          [8.972486964351226, 45.66754594891986],
          [6.983961573726227, 45.83619551585288]]]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
var image_coll = ee.ImageCollection("LANDSAT/LC08/C02/T1_L2")
.filterBounds(geometry);


var recent_mosaic_img_coll = require("users/emanuelespiritowork/SharedRepo:functions/recent_mosaic_img_coll");

var image = recent_mosaic_img_coll.recent_mosaic_img_coll(image_coll, geometry, 30);

Map.addLayer(image);

/*
var landsat_scale_img_coll = require("users/emanuelespiritowork/SharedRepo:functions/landsat_scale_img_coll");

var scaled = landsat_scale_img_coll.landsat_scale_img_coll(image_coll);

var landsat_mask_img_coll =  require("users/emanuelespiritowork/SharedRepo:functions/landsat_mask_img_coll");



Map.addLayer(image_coll.first())
Map.addLayer(scaled_image.first());
Map.centerObject(scaled_image.first());
*/

/*

var plot_stretch_img = require("users/emanuelespiritowork/SharedRepo:functions/plot_stretch_img");

var null_var = plot_stretch_img.plot_stretch_img(image_coll.first(),["SR_B5","SR_B4","SR_B3"],2,30);

*/