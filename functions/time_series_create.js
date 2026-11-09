/******************************************************
 * Author: Emanuele Spirito
 * Copyright: 2025
 * See latest stable version on my GitHub at 
 * https://github.com/emanuelespiritowork/gee-utils-scripts
*******************************************************/

/******************************************************
 * PURPOSE OF THIS SCRIPT
 * Input: ee.ImageCollection (mandatory),
 *        ee.FeatureCollection (mandatory),
 *        ee.String (mandatory),
 *        ee.Number (mandatory)
 * Output: ee.FeatureCollection
 * Description: create a time series of an image collection for all the 
 * cropfields contained in the AOI. The table generated contains the 
 * columns id_name that tells the id of the cropfield, the date of the image, 
 * the system:time_start that is the date of the image but using milliseconds.
 * The rows are all the image collection values averaged in each field in 
 * each date. 
*******************************************************/

exports.time_series_create = function(img_coll, AOI, scale_to_use){
/******************************************************
 * Check variable types
*******************************************************/
  img_coll = ee.ImageCollection(img_coll);
  AOI = ee.FeatureCollection(AOI);
  scale_to_use = ee.Number(scale_to_use);

/******************************************************
 * Create time series for each feature
*******************************************************/
  var reducing_image = function(image){
    var feature_with_values = image.reduceRegions({
    collection: AOI,
    reducer: ee.Reducer.median().combine({
      reducer2: ee.Reducer.count(),
      sharedInputs: true
    }),
    scale: scale_to_use,
    tileScale: ee.Number(16)
    });
    
    var image_index = image.get("system:index");
    var image_time_start = image.get("system:time_start");
    var date = ee.Date(image.get("system:time_start")).format('Y/M/d');
    var clock = ee.Date(image.get("system:time_start")).format('H:m:s');
    
    var set_values = function(feature){
      return feature.set(
      'image:index', image_index,
      'image:time_start', image_time_start,
      'date', date,
      'clock', clock
    );
    };
    
    var setting_feature_descriptors = feature_with_values.map(set_values);
    
    return setting_feature_descriptors;
};
  
  var reduced_time_series = img_coll.map(reducing_image);
  
  return reduced_time_series.flatten();
};

