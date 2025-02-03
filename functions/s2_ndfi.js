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
 * Description: create an NDFI layer over a Sentinel-2 L2A image collection
*******************************************************/

exports.s2_ndfi = function(img_coll){
  
  img_coll = ee.ImageCollection(img_coll);
  
  var s2_ndfi_img = function(image){
    var ndfi = image.normalizedDifference(["B4","B12"]).rename('ndfi');
    var time_start_value = image.get('system:time_start');
    ndfi = ndfi.set({'system:time_start':time_start_value});
    return ndfi;
  };
  
  return img_coll.map(s2_ndfi_img);
};