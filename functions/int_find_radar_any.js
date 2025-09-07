/******************************************************
 * Author: Emanuele Spirito
 * Copyright: 2025
 * See latest stable version on my GitHub at 
 * https://github.com/emanuelespiritowork/gee-utils-scripts
*******************************************************/

/******************************************************
 * REQUIRES THE FOLLOWING FUNCTIONS:
 * clip_to
*******************************************************/

var clip_to = require("users/emanuelespiritowork/SharedRepo:functions/clip_to.js");

/******************************************************
 * PURPOSE OF THIS SCRIPT
 * Input: ee.ImageCollection(mandatory),
 *        ee.FeatureCollection(mandatory),
 *        ee.Number (optional), 
 *        ee.Number (optional), 
 * Output: ee.Image
 * Description: find radar in the AOI using the image collection
*******************************************************/
exports.int_find_radar_any = function(img_coll, AOI, min_value, min_scale){
  AOI = ee.FeatureCollection(AOI);
  img_coll = ee.ImageCollection(img_coll);
  
  var threshold = min_value || ee.Number(0);
  var scale_to_use = min_scale || ee.Number(10);
  
  var clip = clip_to.clip_to(img_coll,AOI,scale_to_use);
  
  var max_value_pixel = clip.select('[^a].*')
  .reduce(ee.Reducer.max());
  
  Map.addLayer(max_value_pixel);
  
  /*
  .reduceToVectors({
      scale: scale_to_use,
      bestEffort: true,
      reducer: ee.Reducer.max()
    })
  .filter(ee.Filter.gt("label",0))
  .filter(ee.Filter.gt("max",threshold));*/
  
  return radar_location;
};