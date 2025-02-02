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
 * Description: create an NDVI layer over a Landsat-8/9 L2 image collection
*******************************************************/

exports.landsat_ndvi = function(img_coll){
  
  img_coll = ee.ImageCollection(img_coll);
  
  var landsat_ndvi_img = function(image){
    var ndvi = image.normalizedDifference(['SR_B5','SR_B4']).rename('ndvi');
    var time_start_value = image.get('system:time_start');
    ndvi = ndvi.set({'system:time_start':time_start_value});
    return ndvi;
  };
  
  return img_coll.map(landsat_ndvi_img);
};