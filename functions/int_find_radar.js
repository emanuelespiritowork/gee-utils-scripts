/******************************************************
 * Author: Emanuele Spirito
 * Copyright: 2025
 * See latest stable version on my GitHub at 
 * https://github.com/emanuelespiritowork/gee-utils-scripts
*******************************************************/

/******************************************************
 * REQUIRES THE FOLLOWING FUNCTIONS:
 * int_find_radar_any
 * s1_longest_series
*******************************************************/

var int_find_radar_any = require("users/emanuelespiritowork/SharedRepo:functions/int_find_radar_any.js");
var s1_longest_series = require("users/emanuelespiritowork/SharedRepo:functions/s1_longest_series.js");

/******************************************************
 * PURPOSE OF THIS SCRIPT
 * Input: ee.String(mandatory),
 *        ee.String(mandatory),
 *        ee.FeatureCollection (mandatory), 
 *        ee.Number (optional), 
 *        ee.Number (optional),
 * Output: ee.FeatureCollection
 * Description: find radar in the AOI in a period of time
*******************************************************/

exports.int_find_radar = function(start_date, last_date, AOI, min_value, min_scale){
  //mandatory inputs
  start_date = ee.Date(start_date);//"YYYY-MM-DD"
  last_date = ee.Date(last_date);//"YYYY-MM-DD"
  AOI = ee.FeatureCollection(AOI);
  //optional inputs
  var scale_to_use = min_scale || ee.Number(10);
  var threshold = min_valuesh || ee.Number(0);
  
  var s1_series = s1_longest_series.s1_longest_series(start_date,last_date,AOI);
  
  return int_find_radar_any.int_find_radar_any(s1_series,AOI,
  threshold, scale_to_use);
};