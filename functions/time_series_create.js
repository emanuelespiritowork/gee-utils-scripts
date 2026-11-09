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

exports.time_series_create = function(img_coll, AOI, id_name, scale_to_use){
/******************************************************
 * Check variable types
*******************************************************/
  img_coll = ee.ImageCollection(img_coll);
  AOI = ee.FeatureCollection(AOI);
  id_name = ee.String(id_name);
  scale_to_use = ee.Number(scale_to_use);

/******************************************************
 * Get layer name
*******************************************************/
  var layer_names = img_coll.first().bandNames().sort();
  print(layer_names);

/******************************************************
 * Create time series for each feature
*******************************************************/
  var reducing_image = function(image){
    return image.reduceRegions({
    collection: AOI.select(id_name),
    reducer: ee.Reducer.median().combine({
      reducer2: ee.Reducer.count(),
      sharedInputs: true
    }),
    scale: scale_to_use
    });
  };

  var reduced_time_series = img_coll.map(reducing_image);
  
  var get_metadata = function(image){
    var list_of_metadata = [
      image.get("system:index"),
      image.get("system:time_start"),
      ee.Date(image.get("system:time_start")).format('Y/M/d'),
      ee.Date(image.get("system:time_start")).format('H:m:s')
    ];
    
    var list_of_names = [
      'image:index',
      'image:time_start',
      'date',
      'clock'
    ];
  };
  
  return reduced_time_series;
};

