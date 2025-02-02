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
 * Description: create an NDWI layer over a Sentinel-2 L2A image collection
*******************************************************/

exports.s2_ndwi = function(img_coll){
  
  img_coll = ee.ImageCollection(img_coll);
  
  var s2_ndwi_img = function(image){
    var ndwi = image.normalizedDifference(['B8A','B11']).rename('ndwi');
    var time_start_value = image.get('system:time_start');
    ndwi = ndwi.set({'system:time_start':time_start_value});
    return ndwi;
  };
  
  return img_coll.map(s2_ndwi_img);
};