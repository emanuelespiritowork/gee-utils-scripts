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
 * ee.ImageCollection and clip it into AOI at a specific scale removing
 * cloudy images
*******************************************************/

exports.mosaic_recent_without_clouds = function(img_coll, AOI, cloud_property_name, highest_cloud_value, scale_to_use){
/******************************************************
 * Check variable types
 *******************************************************/
  img_coll = ee.ImageCollection(img_coll);
  AOI = ee.FeatureCollection(AOI);
  scale_to_use = ee.Number(scale_to_use);
  cloud_property_name = ee.String(cloud_property_name);
  highest_cloud_value = ee.Number(highest_cloud_value);

/******************************************************
 * Clip image collection
 *******************************************************/
  var clip = clip_to.clip_to(img_coll, AOI, scale_to_use);
/******************************************************
 * Sort from the latest to the oldest
 *******************************************************/
  var sorted_img_coll = clip.sort({
    property: "system:time_start", 
    ascending: false
  });
/******************************************************
 * Get latest date
 *******************************************************/
  var latest_date = ee.Date(sorted_img_coll.first().get("system:time_start"));
/******************************************************
 * Get date of one month earlier
 *******************************************************/  
  var start_date = latest_date.advance({
    delta: -2,
    unit: "month"
  });
/******************************************************
 * Generate collection from two months earlier to the latest date and
 * without clouds
 *******************************************************/  
  var latest_img_coll = sorted_img_coll.filterDate(start_date,latest_date)
  .filter(ee.Filter.lt(cloud_property_name,highest_cloud_value))
  .sort(cloud_property_name,false);

/******************************************************
 * Get mosaic
 *******************************************************/  
  var mosaic = mosaic_to.mosaic_to(latest_img_coll);
  
  return ee.Image(mosaic);
};