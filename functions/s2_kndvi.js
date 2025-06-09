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
 * Description: create an kndvi layer for a Sentinel-2 L2A image collection
*******************************************************/

exports.s2_kndvi = function(img_coll){
/******************************************************
 * Check variable types
*******************************************************/
  img_coll = ee.ImageCollection(img_coll);

/******************************************************
 * Create kndvi layer
*******************************************************/
  var s2_kndvi_img = function(image){
    var kndvi = image.expression({
      expression: 'tanh( ( (NIR - RED) / (NIR + RED) )^2 )',
      map: { // Map between variables in the expression and images.
      'NIR': image.select('B8'),
      'RED': image.select('B4'),
      'BLUE': image.select('B2')
      }
    }).rename('kndvi');
    var time_start_value = image.get('system:time_start');
    var footprint = image.get("system:footprint");
    var index = image.get('system:index');
    kndvi = kndvi.set({
      'system:time_start':time_start_value,
      "system:footprint": footprint,
      'system:index': index
    });
    return kndvi;
  };
  
  return img_coll.map(s2_kndvi_img);
};