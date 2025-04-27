/******************************************************
 * Author: Emanuele Spirito
 * Copyright: 2025
 * See latest stable version on my GitHub at 
 * https://github.com/emanuelespiritowork/gee-utils-scripts
*******************************************************/

/******************************************************
 * REQUIRES THE FOLLOWING FUNCTIONS:
 * int_find_ships_any
 * s1_select
 * clip_to
 * s1_longest_series
*******************************************************/

var int_find_ships_any = require("users/emanuelespiritowork/SharedRepo:functions/int_find_ships_any.js");
var clip_to = require("users/emanuelespiritowork/SharedRepo:functions/clip_to.js");

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
exports.int_find_radar_any = function(img_coll, AOI, min_value, min_scale){
  AOI = ee.FeatureCollection(AOI);
  img_coll = ee.ImageCollection(img_coll);
  
  var threshold = min_value || ee.Number(0);
  var scale_to_use = min_scale || ee.Number(10);
  
  var clip = clip_to.clip_to(img_coll,AOI,scale_to_use);
  
  var max_value_pixel = clip.reduce(ee.Reducer.max());
  
  var radar_location = max_value_pixel.gt(threshold);
  
  return clip_to.clip_to(radar_location,AOI,scale_to_use);
};