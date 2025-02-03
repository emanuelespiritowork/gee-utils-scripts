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
    var ndfi = image.expression({
      expression: '(RED - SWIR_2)/(RED + SWIR_2)',
      map: { // Map between variables in the expression and images.
      'SWIR_2': image.select('SR_B7'),
      'RED': image.select('SR_B4'),
      }
    }).rename('ndfi');
    
    var time_start_value = image.get('system:time_start');
    ndfi = ndfi.set({'system:time_start':time_start_value});
    return ndfi;
  };
  
  return img_coll.map(landsat_ndfi_img);
};