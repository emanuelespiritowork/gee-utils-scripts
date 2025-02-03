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
 * Description: create an EVI2 layer over a Landsat-8/9 L2 image collection
*******************************************************/

exports.landsat_evi = function(img_coll){
  
  img_coll = ee.ImageCollection(img_coll);
  
  var landsat_evi_img = function(image){
    
    var evi = image.expression({
      expression: '2.5 * ((NIR - RED) / (NIR + 6 * RED - 7.5 * BLUE + 1))',
      map: { // Map between variables in the expression and images.
      'NIR': image.select('SR_B5'),
      'RED': image.select('SR_B4'),
      'BLUE': image.select('SR_B2')
      }
    }).rename('evi');
    
    var time_start_value = image.get('system:time_start');
    evi = evi.set({'system:time_start':time_start_value});
    return evi;
  };
  
  return img_coll.map(landsat_evi_img);
};