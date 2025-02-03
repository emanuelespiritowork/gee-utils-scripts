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
  
  var speckle_lee = function(image){
    
  };
  
  return img_coll.map(speckle_lee);
};