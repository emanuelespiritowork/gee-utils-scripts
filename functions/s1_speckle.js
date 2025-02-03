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
 * Description: create an evi layer for a Sentinel-2 L2A image collection
*******************************************************/

exports.s1_speckle = function(img_coll){
  
  img_coll = ee.ImageCollection(img_coll);
  
  var s2_evi_img = function(image){
    var evi = image.expression({
      expression: '2.5 * ((NIR - RED) / (NIR + 6 * RED - 7.5 * BLUE + 1))',
      map: { // Map between variables in the expression and images.
      'NIR': image.select('B8'),
      'RED': image.select('B4'),
      'BLUE': image.select('B2')
      }
    }).rename('evi');
    var time_start_value = image.get('system:time_start');
    evi = evi.set({'system:time_start':time_start_value});
    return evi;
  };
  
  return img_coll.map(s2_evi_img);
};