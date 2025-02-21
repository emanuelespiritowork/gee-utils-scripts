/******************************************************
 * Author: Emanuele Spirito
 * Copyright: 2025
 * See latest stable version on my GitHub at 
 * https://github.com/emanuelespiritowork/gee-utils-scripts
*******************************************************/

/******************************************************
 * PURPOSE OF THIS SCRIPT
 * Input: ee.ImageCollection
 * Output: ee.Image 
 * Description: make a mosaic of an image collection
*******************************************************/

exports.mosaic_to = function(img_coll){

/******************************************************
 * Check variable types
 *******************************************************/
  img_coll = ee.ImageCollection(img_coll);

/******************************************************
 * Get bands names
 *******************************************************/
  var bands_names = img_coll.first().bandNames();

/******************************************************
 * Change band order. Image collection can have images 
 * with bands order changed through time and they cannot 
 * be merged
 *******************************************************/
  var change_band_order = function(img){
    var bands_types = img.bandTypes();
    var band_ordered_img = img.cast(bands_types,bands_names);
    return band_ordered_img;
  };
  
  var img_coll_reordered = img_coll.map(change_band_order);

/******************************************************
 * Get true latest date. Satellites are not passing every 
 * date over each area so this function computes the true 
 * latest date
 *******************************************************/
  var true_latest_date = img_coll_reordered.sort({
    property: "system:time_start",
    ascending: false
  }).first().date();
  var true_start_date = img_coll_reordered.sort({
    property: "system:time_start",
    ascending: true
  }).first().date();

/******************************************************
 * Get footprint of the mosaic
 *******************************************************/
  var footprint = img_coll.union().first().geometry();

/******************************************************
 * Create mosaic
 *******************************************************/
  var img_mosaic = img_coll_reordered.mosaic().set({
    "system:footprint": footprint,
    "system:time_start": true_start_date.millis(),
    "system:time_end": true_latest_date.millis(),
    "date_start": true_start_date,
    "date_end": true_latest_date
  });
  
  return ee.Image(img_mosaic);
};