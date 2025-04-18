/******************************************************
 * Author: Emanuele Spirito
 * Copyright: 2025
 * See latest stable version on my GitHub at 
 * https://github.com/emanuelespiritowork/gee-utils-scripts
*******************************************************/

/******************************************************
 * PURPOSE OF THIS SCRIPT
 * Input: ee.Image, ee.Number, ee.Number
 * Output: (no output) it prints an image as a greyscale 
 * Description: this script has a function that want to create an image 
 * stretch of stretch*sigma of a ee.Image and print it on 
 * your map.
*******************************************************/

exports.plot_map = function(img,stretch,scale_to_use){
/******************************************************
 * Check variable types
*******************************************************/
  img = ee.Image(img);
  stretch = ee.Number(stretch);
  scale_to_use = ee.Number(scale_to_use);

/******************************************************
 * Get geometry
*******************************************************/
  var geometry_of_image = img.geometry();

/******************************************************
 * Get first band name
*******************************************************/
  var first_band = ee.Image(img).bandNames().getString(0);

/******************************************************
 * Compute standard deviation
*******************************************************/
  var computed_img_std_1 = img.select(first_band).reduceRegion({
    reducer: ee.Reducer.stdDev(),
    scale: scale_to_use,
    geometry: geometry_of_image,
    bestEffort: true
  }).getNumber(first_band);

/******************************************************
 * Compute mean
*******************************************************/
  var computed_img_mean_1 = img.select(first_band).reduceRegion({
    reducer: ee.Reducer.mean(),
    scale: scale_to_use,
    geometry: geometry_of_image,
    bestEffort: true
  }).getNumber(first_band);

/******************************************************
 * Compute stretch
*******************************************************/
  var computed_img_mean = ee.Array(ee.List([computed_img_mean_1]));
  
  var computed_img_std = ee.Array(ee.List([computed_img_std_1]));
  
  var array_of_stretch = ee.Array(ee.List([stretch]));
  
  var computed_img_min = computed_img_mean.subtract(array_of_stretch.multiply(computed_img_std));
  //print("computed_img_min",computed_img_min);
  
  var computed_img_max = computed_img_mean.add(array_of_stretch.multiply(computed_img_std));
  //print("computed_img_max",computed_img_max);

/******************************************************
 * Print stretched image
*******************************************************/
  var vis_specific_image = {
    bands: first_band.getInfo(),
    min: computed_img_min.toList().getInfo(),
    max: computed_img_max.toList().getInfo()
  };
  
  var name = first_band.cat("_stretched");
  
  Map.addLayer(img, vis_specific_image, name.getInfo(), true);
  Map.centerObject(img);
  
  return 0;
};
