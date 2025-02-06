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
  
  var bands_names = img_coll.first().bandNames();
  
  var change_band_order = function(img){
    var bands_types = img.bandTypes();
    var band_ordered_img = img.cast(bands_types,bands_names);
    return band_ordered_img;
  };
  
  var img_coll_reordered = img_coll.map(change_band_order);
  
  var true_latest_date = img_coll_reordered.sort({
    property: "system:time_start",
    ascending: false
  }).first().date();
  var true_start_date = img_coll_reordered.sort({
    property: "system:time_start",
    ascending: true
  }).first().date();
  
  var footprint = img_coll.union().first().geometry();
  
  var img_mosaic = img_coll_reordered.mosaic().set({
    "system:footprint": footprint,
    "system:time_start": true_start_date.millis(),
    "system:time_end": true_latest_date.millis(),
    "date_start": true_start_date,
    "date_end": true_latest_date
  });
  
  return ee.Image(img_mosaic);
};