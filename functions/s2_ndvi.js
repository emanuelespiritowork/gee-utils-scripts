/******************************************************
 * Author: Emanuele Spirito
 * Copyright: 2025
 * See latest stable version on my GitHub at 
 * https://github.com/emanuelespiritowork/gee-utils-scripts
*******************************************************/

/******************************************************
 * PURPOSE OF THIS SCRIPT
 * Input: ee.ImageCollection or ee.Image
 * Output: ee.ImageCollection or ee.Image
 * Description: create an NDVI layer for a Sentinel-2 L2A image collection
*******************************************************/

exports.s2_ndvi = function(img_coll){
  
  img_coll = ee.ImageCollection(img_coll);
  
  var s2_ndvi_img = function(image){
    var ndvi = image.normalizedDifference(["B8","B4"]).rename('ndvi');
    var time_start_value = image.get('system:time_start');
    var footprint = image.get('system:footprint');
    ndvi = ndvi.set({
      'system:time_start':time_start_value,
      'system:footprint': footprint
    });
    return ndvi;
  };
  
  return img_coll.map(s2_ndvi_img);
};