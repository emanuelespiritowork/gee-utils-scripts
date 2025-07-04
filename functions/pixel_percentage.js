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
 * Description: taken an already masked image (with any mask applied), 
 * considers as valid only the cropfields that are not masked for more 
 * than threshold_percentage*100%. All the other cropfields are 
 * completely masked.
*******************************************************/

exports.pixel_percentage = function(img_coll,AOI,threshold_percentage,scale_to_use){

/******************************************************
 * Check variable types
 *******************************************************/
  img_coll = ee.ImageCollection(img_coll);
  AOI = ee.FeatureCollection(AOI);
  threshold_percentage = ee.Number(threshold_percentage);
  scale_to_use = ee.Number(scale_to_use); 

/******************************************************
 * Apply pixel percentage mask
 *******************************************************/
  var pixel_percentage_img = function(image){
    var clip_image_following_feature = function(region){
      /******************************************************
      * Clip image to the region
      *******************************************************/
      var clipped_image = image.clip(region); 
      
      /******************************************************
      * Compute pixels that are not masked
      *******************************************************/
      var not_masked_pixels = clipped_image.reduceRegion({
        reducer: ee.Reducer.count(),
        geometry: region.geometry(),
        scale: scale_to_use,
        bestEffort: true
      }).getNumber(ee.String(image.bandNames().get(0)));
      
      /******************************************************
      * Compute all pixels
      *******************************************************/
      var all_pixels = clipped_image.unmask(ee.Number(0)).reduceRegion({
        reducer: ee.Reducer.count(),
        geometry: region.geometry(),
        scale: scale_to_use,
        bestEffort: true
      }).getNumber(ee.String(image.bandNames().get(0)));
      
      /******************************************************
      * Create a conditional function. If the percentage of not masked pixel
      * over the threshold the image is kept
      *******************************************************/
      var possible_mask = ee.Algorithms.If({
        condition: not_masked_pixels.divide(all_pixels)
        .gte(ee.Number(threshold_percentage).float()),
        trueCase: ee.Image(ee.Number(1)),
        falseCase: ee.Image(ee.Number(0))
      });
      
      var updateMask_image = clipped_image.updateMask(possible_mask)
      .clip(region);
      
      return updateMask_image;
    };
    
    /******************************************************
    * Apply pixel percentage
    *******************************************************/
    var imageCollection_of_clipped_image = AOI
    .map(clip_image_following_feature);
    
    /******************************************************
    * Create a mosaic of the new masked image collection
    *******************************************************/
    var imageMosaic = ee.ImageCollection(imageCollection_of_clipped_image)
    .mosaic();
    
    /******************************************************
    * Get footprint and time_start
    *******************************************************/
    var footprint = image.get('system:footprint');
    var time_start_value = image.get('system:time_start');
    var index = image.get('system:index');
    
    imageMosaic = imageMosaic
    .set({
      'system:time_start':time_start_value,
      'system:footprint': footprint,
      'system:index': index
    });
    
    return imageMosaic;
  };
  
  return img_coll.map(pixel_percentage_img);
};