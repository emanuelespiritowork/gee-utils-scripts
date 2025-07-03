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
 * Description: create an ndre layer over a Sentinel-2 L2A image collection
*******************************************************/

exports.s2_ndre = function(img_coll){
/******************************************************
 * Check variable types
*******************************************************/
  img_coll = ee.ImageCollection(img_coll);

/******************************************************
 * Create ndre layer
*******************************************************/
  var s2_ndre_img = function(image){
    var ndre = image.normalizedDifference(["B9","B5"]).rename('ndre');
    var time_start_value = image.get('system:time_start');
    var footprint = image.get('system:footprint');
    ndre = ndre.set({
      'system:time_start':time_start_value,
      'system:footprint': footprint
    });
    return ndre;
  };
  
  return img_coll.map(s2_ndre_img);
};