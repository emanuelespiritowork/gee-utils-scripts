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
 * Description: reduce the speckle for an Sentinel-1 Ground Range Detected image
*******************************************************/

exports.s1_speckle = function(img_coll){
  
  img_coll = ee.ImageCollection(img_coll);
  
  var speckle_lee = function(image){
    
  };
  
  return img_coll.map(speckle_lee);
};