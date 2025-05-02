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
 * Description: create an NDSI layer for a Sentinel-2 L2A image collection
*******************************************************/

exports.s2_ndsi = function(img_coll){

/******************************************************
 * Check variable types
*******************************************************/
  img_coll = ee.ImageCollection(img_coll);

/******************************************************
 * Create ndsi layer
*******************************************************/
  var s2_ndsi_img = function(image){
    var ndsi = image.normalizedDifference(["B3","B11"]).rename('ndsi');
    var time_start_value = image.get('system:time_start');
    var footprint = image.get('system:footprint');
    ndsi = ndsi.set({
      'system:time_start':time_start_value,
      'system:footprint': footprint
    });
    return ndsi;
  };
  
  return img_coll.map(s2_ndsi_img);
};