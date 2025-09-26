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

exports.int_find_ships = function(start_date, last_date, AOI, min_scale, s1_min_value, s1_max_value, s2_min_value, s2_max_value, connectedness, radius){
  //mandatory inputs
  start_date = ee.Date(start_date);//"YYYY-MM-DD"
  last_date = ee.Date(last_date);//"YYYY-MM-DD"
  AOI = ee.FeatureCollection(AOI);
  //optional inputs
  var scale_to_use = min_scale || ee.Number(10);
  var s1_low_threshold = s1_min_value || ee.Number(-16);
  var s1_up_threshold = s1_max_value || ee.Number(0);
  var s2_low_threshold = s2_min_value || ee.Number(-0.4);
  var s2_up_threshold = s2_max_value || ee.Number(-0.15);
  var compactness = connectedness || ee.Number(10);
  var size = radius || ee.Number(3);
  
  var s1_series = s1_longest_series.s1_longest_series(start_date,last_date,AOI);
  
  Map.addLayer(s1_series.first());
  print(s1_series.first());
  
  Map.addLayer(s1_series.sort("start_date").first());
  print(s1_series.sort("start_date",false).first());
  
  var s1_ships = int_find_ships_any.int_find_ships_any(s1_series,AOI,
  scale_to_use, s1_low_threshold, s1_up_threshold, compactness, size);
  
  /*
  var s2_series = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
  .filterBounds(AOI)
  .filterDate(start_date,last_date);
  
  var s2_ships = int_find_ships_s2.int_find_ships_s2(s2_series,AOI,
  scale_to_use, s2_low_threshold, s2_up_threshold, compactness, 1);
  */
  return(s1_ships);
};