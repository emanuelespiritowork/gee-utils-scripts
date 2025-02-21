/******************************************************
 * Author: Emanuele Spirito
 * Copyright: 2025
 * See latest stable version on my GitHub at 
 * https://github.com/emanuelespiritowork/gee-utils-scripts
*******************************************************/

/******************************************************
 * PURPOSE OF THIS SCRIPT
 * Input: ee.Image
 * Output: plot classification map
*******************************************************/

exports.plot_class = function(img){
  
  img = ee.Image(img);
  
  var palette = img.randomVisualizer();
  
  Map.addLayer(img, palette, "classification");
  
  return 0;
};






