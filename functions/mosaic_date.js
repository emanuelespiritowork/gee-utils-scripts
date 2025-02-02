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

exports.mosaic_date = function(img_coll, AOI, start_date, latest_date, scale_to_use){
  
  img_coll = ee.ImageCollection(img_coll);
  start_date = ee.Date(start_date);//"YYYY-MM-DD"
  latest_date = ee.Date(latest_date);//"YYYY-MM-DD"
  //print(start_date);
  //print(latest_date);
  AOI = ee.FeatureCollection(AOI);
  scale_to_use = ee.Number(scale_to_use);
  
  var clip = clip_to.clip_to(img_coll, AOI, scale_to_use);
  //print(clip);
  var latest_img_coll = clip.filterDate(start_date,latest_date);
  //print(latest_img_coll);
  var footprint = clip.first().geometry();
  
  var mosaic = mosaic_to.mosaic_to(latest_img_coll);
  
  return mosaic;
};