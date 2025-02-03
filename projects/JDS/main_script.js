/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var square = 
    /* color: #d63000 */
    /* shown: false */
    ee.Geometry.Polygon(
        [[[11.8332053984878, 44.950951330959384],
          [11.7782737578628, 44.79523758054879],
          [12.1243430938003, 44.76306921047978],
          [12.1573020781753, 44.92470418537108]]]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
/******************************************************
 * Author: Emanuele Spirito
 * Copyright: 2025
 * See latest stable version on my GitHub at 
 * https://github.com/emanuelespiritowork/gee-utils-scripts
*******************************************************/

/******************************************************
 * ABOUT THIS PROJECT
*******************************************************/

/******************************************************
 * LOAD FUNCTIONS PATH
*******************************************************/

var clip_to = require('users/emanuelespiritowork/SharedRepo:functions/clip_to.js');
var s2_mask = require('users/emanuelespiritowork/SharedRepo:functions/s2_mask.js');

/******************************************************
 * SCRIPT
*******************************************************/

var AOI = ee.FeatureCollection("projects/ee-emanuelespiritowork/assets/AOI");
var export_folder = ee.String("Exports");
var id_name = ee.String("id_geom");
var scale_to_use = ee.Number(10);
var stretch = ee.Number(2);
var threshold_percentage = ee.Number(0.5);
var transect = null;

//print(AOI);
//print(ee.FeatureCollection(AOI));
//print(ee.FeatureCollection(ee.FeatureCollection(AOI)));

var image_coll = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
.filterDate('2023-10-01','2023-12-28')
.filterBounds(AOI)
//.filter(ee.Filter.gt("CLOUDY_PIXEL_PERCENTAGE",30))
//.sort("CLOUDY_PIXEL_PERCENTAGE",true);

var first_image = image_coll.first();

AOI = AOI;
//AOI = ee.FeatureCollection(square);
var geometry = AOI.geometry();
//print(AOI);
//print(geometry);

var clip_img = function(image){
    var clipped_image = image.clipToBoundsAndScale({
      geometry: geometry,
      scale: scale_to_use
    }).clip(AOI);
    var previous_geometry = image.geometry();
    var intersection = geometry.intersection(previous_geometry);
    print("intersection",intersection);
    var footprint = ee.Algorithms.GeometryConstructors.MultiGeometry({
      geometries: intersection.geometries()
    });
    return clipped_image.set({"system:footprint": footprint});
  };
  
//var clipped_image = clip_img(first_image);

var clipped_image = clip_to.clip_to(image_coll,AOI,scale_to_use);

var masked_image = s2_mask.s2_mask(clipped_image);

var pixel_percentage = require('users/emanuelespiritowork/SharedRepo:functions/pixel_percentage.js');

//print(masked_image);

var pixel_percentage_image = pixel_percentage.pixel_percentage(masked_image,AOI,0.1,scale_to_use);

//Map.addLayer(clipped_image.first());
//Map.addLayer(masked_image.first());
//Map.addLayer(pixel_percentage_image.first());

var s2_evi = require('users/emanuelespiritowork/SharedRepo:functions/s2_evi.js');

var evi = s2_evi.s2_evi(masked_image);

print(evi.filterDate("2023-10-03","2023-10-06").sort("evi",true).first().bandNames());

var null_var = ee.List([null,10]);

print(null_var.filter(ee.Filter.notNull(["item"])).equals([]));

evi = evi.sort("evi",true);

var time_series_create = require('users/emanuelespiritowork/SharedRepo:functions/time_series_create.js');

var time_series = time_series_create.time_series_create(evi,AOI,"id_geom",scale_to_use);

print(time_series.sort("evi",true).limit(4999));

var time_series_name = ""; 
var null_var = time_series.select("[^date].*")
.select("[^system:].*")
.select("[^id].*")
.first()
.propertyNames();
print(time_series_name);

//print(time_series);
//print(time_series.propertyNames());

var time_series_get_plot = require('users/emanuelespiritowork/SharedRepo:functions/time_series_get_plot.js');

var plot = time_series_get_plot.time_series_get_plot(time_series,"evi");

//print(time_series);
print(plot);
