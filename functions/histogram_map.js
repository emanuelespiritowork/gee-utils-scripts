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

exports.histogram_map = function(img, AOI, scale_to_use){
  
  img = ee.Image(img);
  
  var plot = ui.Chart.image.histogram({
    image: img,
    region: AOI,
    scale: scale_to_use
  });
  
  var histogram = img.reduceRegion({
    reducer: ee.Reducer.frequencyHistogram(),
    geometry: AOI.geometry(),
    scale: scale_to_use,
    bestEffort: true
  });
  
  print(plot);
  
  return histogram;
};