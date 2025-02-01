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
 * Description: create an NDFI layer over a Landsat-8/9 L2 image collection
*******************************************************/

exports.landsat_ndfi = function(img_coll){
  
  img_coll = ee.ImageCollection(img_coll);
  
  var landsat_ndfi_img = function(image){
    var ndfi2 = image.normalizedDifference(['SR_B4','SR_B7']).rename('ndfi2');
    var time_start_value = image.get('system:time_start');
    ndfi2 = ndfi2.set({'system:time_start':time_start_value});
    return ndfi2;
  };
  
  return img_coll.map(landsat_ndfi_img);
};