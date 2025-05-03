/******************************************************
 * Author: Emanuele Spirito
 * Copyright: 2025
 * See latest stable version on my GitHub at 
 * https://github.com/emanuelespiritowork/gee-utils-scripts
*******************************************************/

/******************************************************
 * REQUIRES THE FOLLOWING FUNCTIONS:
 * clip_to
 * mosaic_to
*******************************************************/

var clip_to = require("users/emanuelespiritowork/SharedRepo:functions/clip_to.js");
var mosaic_to = require("users/emanuelespiritowork/SharedRepo:functions/mosaic_to.js");

/******************************************************
 * PURPOSE OF THIS SCRIPT
 * Input: ee.ImageCollection
 * Output: ee.Image 
 * Description: this script is a function that makes a mosaic of an
 * ee.ImageCollection and clip it into AOI at a specific scale
*******************************************************/

exports.mosaic_recent = function(img_coll, AOI, scale_to_use){
/******************************************************
 * Check variable types
 *******************************************************/
  img_coll = ee.ImageCollection(img_coll);
  AOI = ee.FeatureCollection(AOI);
  scale_to_use = ee.Number(scale_to_use);

/******************************************************
 * Clip image collection
 *******************************************************/
  var clip = clip_to.clip_to(img_coll, AOI, scale_to_use);
/******************************************************
 * Sort from the latest to the oldest
 *******************************************************/
  var sorted_img_coll = clip.sort({
    property: "system:time_start", 
    ascending: true
  });
  print(sorted_img_coll);
/******************************************************
 * Get latest date
 *******************************************************/
  var latest_date = ee.Date(sorted_img_coll.first().get("system:time_start"));
/******************************************************
 * Get date of one month earlier
 *******************************************************/  
  var start_date = latest_date.advance({
    delta: -1,
    unit: "month"
  });
/******************************************************
 * Generate collection from a month earlier to the latest date
 *******************************************************/  
  var latest_img_coll = sorted_img_coll.filterDate(start_date,latest_date);

/******************************************************
 * Get mosaic
 *******************************************************/  
  var mosaic = mosaic_to.mosaic_to(latest_img_coll);
  
  return ee.Image(mosaic);
};