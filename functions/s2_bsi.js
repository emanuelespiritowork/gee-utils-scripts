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
 * Description: create an bsi layer for a Sentinel-2 L2A image collection
*******************************************************/

exports.s2_bsi = function(img_coll){
/******************************************************
 * Check variable types
*******************************************************/
  img_coll = ee.ImageCollection(img_coll);

/******************************************************
 * Create bsi layer
*******************************************************/
  var s2_bsi_img = function(image){
    var bsi = image.expression({
      expression: '((SWIR_1 + RED) - (NIR + BLUE)) / ((SWIR_1 + RED) + (NIR + BLUE))',
      map: { // Map between variables in the expression and images.
      'NIR': image.select('B8'),
      'RED': image.select('B4'),
      'BLUE': image.select('B2'),
      'SWIR_1': image.select('B11'),
      'SWIR_2': image.select('B12')
      }
    }).rename('bsi');
    var time_start_value = image.get('system:time_start');
    var footprint = image.get("system:footprint");
    var index = image.get('system:index');
    bsi = bsi.set({
      'system:time_start':time_start_value,
      "system:footprint": footprint,
      'system:index': index
    });
    return bsi;
  };
  
  return img_coll.map(s2_bsi_img);
};