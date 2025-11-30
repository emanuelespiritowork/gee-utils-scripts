/******************************************************
 * Author: Emanuele Spirito
 * Copyright: 2025
 * See latest stable version on my GitHub at 
 * https://github.com/emanuelespiritowork/gee-utils-scripts
*******************************************************/

/******************************************************
 * REQUIRES THE FOLLOWING FUNCTIONS:
 * int_find_ships_any
 * s1_longest_series
*******************************************************/

var int_find_ships_any = require("users/emanuelespiritowork/SharedRepo:functions/int_find_ships_any.js");
var int_find_ships_s2 = require("users/emanuelespiritowork/SharedRepo:functions/int_find_ships_s2.js");
var s1_longest_series = require("users/emanuelespiritowork/SharedRepo:functions/s1_longest_series.js");
var clip_to = require("users/emanuelespiritowork/SharedRepo:functions/clip_to.js");
var s2_scale = require("users/emanuelespiritowork/SharedRepo:functions/s2_scale.js");
var s2_ndvi = require("users/emanuelespiritowork/SharedRepo:functions/s2_ndvi.js");


/******************************************************
 * PURPOSE OF THIS SCRIPT
 * Input: ee.String(mandatory),
 *        ee.String(mandatory),
 *        ee.FeatureCollection (mandatory), 
 *        ee.Number (optional), 
 *        ee.Number (optional), 
 *        ee.Number (optional),
 *        ee.Number (optional)
 * Output: ee.FeatureCollection
 * Description: find ships in the AOI in a period of time
*******************************************************/

exports.int_find_ships = function(start_date, last_date, AOI, min_scale, s1_min_value, s1_max_value, s1_connectedness, s1_radius, s2_min_value, s2_max_value, s2_min_water,s2_k_radius,s2_n_iterations,s2_cloud_coverage){
  //mandatory inputs
  start_date = ee.Date(start_date);//"YYYY-MM-DD"
  last_date = ee.Date(last_date);//"YYYY-MM-DD"
  AOI = ee.FeatureCollection(AOI);
  //optional inputs
  var scale_to_use = ee.Number(min_scale || 10);
  var s1_low_threshold = ee.Number(s1_min_value || -16);
  var s1_up_threshold = ee.Number(s1_max_value || 0);
  var s2_low_threshold = ee.Number(s2_min_value || -0.4);
  var s2_up_threshold = ee.Number(s2_max_value || -0.15);
  var s1_compactness = ee.Number(s1_connectedness || 10);
  var s1_size = ee.Number(s1_radius || 3);
  var s2_water_low_threshold = ee.Number(s2_min_water || 0.1);
  var s2_radius = ee.Number(s2_k_radius || 1);
  var s2_iterations = ee.Number(s2_n_iterations || 1);
  var s2_max_cloud_coverage = ee.Number(s2_cloud_coverage || 10);
  
  var s1_series = s1_longest_series.s1_longest_series(start_date,last_date,AOI);
  
  Map.addLayer(s1_series);
  /*
  Map.addLayer(s1_series.first());
  print(s1_series.first());
  
  Map.addLayer(s1_series.sort("system:time_start",true).first());
  print(s1_series.sort("system:time_start",true).first());
  */
  var s1_ships = int_find_ships_any.int_find_ships_any(s1_series,AOI,
  scale_to_use, s1_low_threshold, s1_up_threshold, s1_compactness, s1_size);
  
  var s2_series = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
  .filterBounds(AOI)
  .filterDate(start_date,last_date)
  .filter(ee.Filter.lt("CLOUDY_PIXEL_PERCENTAGE",s2_max_cloud_coverage));
  
  var s2_ships = int_find_ships_s2.int_find_ships_s2(s2_series,
  AOI,
  s2_up_threshold,
  s2_low_threshold,
  s2_water_low_threshold,
  s2_radius,
  s2_iterations,
  scale_to_use);
  
  return(s1_ships);
};