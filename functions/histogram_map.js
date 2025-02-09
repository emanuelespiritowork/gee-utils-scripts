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

exports.plot_histogram = function(img, AOI, scale_to_use){
  
  img = ee.Image(img);
  AOI = ee.FeatureCollection(AOI);
  scale_to_use = ee.Number(scale_to_use);
  //all_data is boolean
  
  var plot = ui.Chart.image.histogram({
    image: img,
    region: AOI,
    scale: scale_to_use
  });
  
  print(plot);
  
  return 0;
};