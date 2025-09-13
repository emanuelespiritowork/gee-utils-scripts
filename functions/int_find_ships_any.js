/******************************************************
 * Author: Emanuele Spirito
 * Copyright: 2025
 * See latest stable version on my GitHub at 
 * https://github.com/emanuelespiritowork/gee-utils-scripts
*******************************************************/

/******************************************************
 * REQUIRES THE FOLLOWING FUNCTIONS:
 * clip_to
*******************************************************/

var clip_to = require("users/emanuelespiritowork/SharedRepo:functions/clip_to.js");

/******************************************************
 * PURPOSE OF THIS SCRIPT
 * Input: ee.ImageCollection, ee.FeatureCollection, ee.Number, ee.String, ee.Number
 * Output: ee.FeatureCollection
 * Description: find ships in the AOI using a generic image collection of the past
*******************************************************/

exports.int_find_ships_any = function(img_coll, AOI, scale_to_use, low_threshold, up_threshold, compactness, size){
/******************************************************
 * Check variable types
*******************************************************/
  img_coll = ee.ImageCollection(img_coll);
  AOI = ee.FeatureCollection(AOI);
  low_threshold = ee.Number(low_threshold);
  up_threshold = ee.Number(up_threshold);
  scale_to_use = ee.Number(scale_to_use);
  compactness = ee.Number(compactness);
  size = ee.Number(size);

/******************************************************
 * Clip image collection
*******************************************************/
  var select = clip_to.clip_to(img_coll,AOI,scale_to_use);
/******************************************************
 * Define the kernel for compactness and maximization
*******************************************************/
  var kernel_circle = ee.Kernel.circle({
    radius: size,
    units: "pixels",
    normalize: false
  });

/******************************************************
 * Get vectors of ships
*******************************************************/
  var get_vectors = function(image){
    /******************************************************
     * Get info from image 
     *******************************************************/
    var time_start = image.get("system:time_start");
    var start_date = ee.Date(time_start).format('Y/M/d');
    var clock = ee.Date(time_start).format('H:m:s'); 
    
    /******************************************************
     * Get image above low_threshold
     *******************************************************/
    var over_low_threshold = image.gt(low_threshold);
    
    /******************************************************
     * Get image under up_threshold
     *******************************************************/
    var under_low_threshold = image.lt(up_threshold);
    
    /******************************************************
     * Get image between thresholds
     *******************************************************/
    var between_thresholds = over_low_threshold.and(under_low_threshold);
    
    /******************************************************
     * Create compactness layer
     *******************************************************/
    var compact = between_thresholds
    .reduceNeighborhood({
      reducer: ee.Reducer.sum(),
      kernel: kernel_circle,
    })
    .gt(compactness)
    .rename("compact");
    
    /******************************************************
     * Create maximization layer
     *******************************************************/
    var max = between_thresholds
    .reduceNeighborhood({
      reducer: ee.Reducer.max(),
      kernel: kernel_circle
    }).rename("between_thresholds");
    
    /******************************************************
     * Create a two-band image to find ships
     *******************************************************/
    var image_to_reduce = max.addBands(compact);
    
    /******************************************************
     * Find ships using max layer and give a value of compactness
     * as an attribute using the max reducer over the compact layer
     *******************************************************/
    var vector = image_to_reduce.reduceToVectors({
      scale: scale_to_use,
      bestEffort: true,
      reducer: ee.Reducer.max()
    })
    .filter(ee.Filter.gt("label",0))
    .filter(ee.Filter.gt("max",0));
    
    /******************************************************
     * Count pixels inside each vector
     *******************************************************/
    var count_size = max.reduceRegions({
      collection: vector,
      reducer: ee.Reducer.count(),
      scale: scale_to_use
    });
    
    /******************************************************
     * Set properties to the vector
     *******************************************************/
    var set_time_to_feature = function(feature){
      return feature.select(["count"]).set({
        "system:time_start": time_start,
        "date": start_date,
        "clock": clock
      });
    };
    
    return count_size.map(set_time_to_feature);
  };
  
  var ship_vectors = select.select('[^a].*').map(get_vectors).flatten();
  
  return ship_vectors;
};