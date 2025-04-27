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
var s1_longest_series = require("users/emanuelespiritowork/SharedRepo:functions/s1_longest_series.js");

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

exports.int_find_ships = function(start_date, last_date, AOI, min_scale, min_value, connectedness, radius){
  //mandatory inputs
  start_date = ee.Date(start_date);//"YYYY-MM-DD"
  last_date = ee.Date(last_date);//"YYYY-MM-DD"
  AOI = ee.FeatureCollection(AOI);
  //optional inputs
  var scale_to_use = min_scale || ee.Number(10);
  var threshold = min_value || ee.Number(-16);
  var compactness = connectedness || ee.Number(10);
  var size = radius || ee.Number(3);
  
  var s1_series = s1_longest_series.s1_longest_series(start_date,last_date,AOI);
  
  return int_find_ships_any.int_find_ships_any(s1_series,AOI,
  scale_to_use, threshold, compactness, size);
};