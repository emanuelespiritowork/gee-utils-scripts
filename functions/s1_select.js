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
 * Description: select a desidered Sentinel-1 Ground Range Detected image
*******************************************************/

exports.s1_select = function(img_coll, acquisition, polarization, orbit){
  
  //refers to https://sentiwiki.copernicus.eu/web/s1-applications
  
  img_coll = ee.ImageCollection(img_coll);
  
  var select_image = function(image){
    
  };
  
  return img_coll.map(select_image);
};