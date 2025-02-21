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

/******************************************************
 * Check variable types
 *******************************************************/
  img_coll = ee.ImageCollection(img_coll);

/******************************************************
 * Create ndfi layer
 *******************************************************/
 
  var landsat_ndfi_img = function(image){
    var ndfi = image.normalizedDifference(["SR_B4","SR_B7"]).rename('ndfi');
    var time_start_value = image.get('system:time_start');
    var footprint = image.get('system:footprint');
    ndfi = ndfi.set({
      'system:time_start':time_start_value,
      'system:footprint':footprint
    });
    return ndfi;
  };
  
  return img_coll.map(landsat_ndfi_img);
};