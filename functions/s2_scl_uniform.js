/******************************************************
 * Author: Emanuele Spirito
 * Copyright: 2025
 * See latest stable version on my GitHub at 
 * https://github.com/emanuelespiritowork/gee-utils-scripts
*******************************************************/

/******************************************************
 * PURPOSE OF THIS SCRIPT
 * Input: ee.ImageCollection, ee.FeatureCollection
 * Output: ee.ImageCollection
 * Description: given an image collection with the Sentinel-2 SCL layer
 * this script creates an SCL layer uniform in each feature
*******************************************************/

exports.s2_scl_uniform = function(img_coll, AOI){
/******************************************************
 * Check variable types
*******************************************************/
  img_coll = ee.ImageCollection(img_coll);
  AOI = ee.FeatureCollection(AOI);
/******************************************************
 * Select SCL layer
*******************************************************/
  var scl = img_coll.select("SCL");

/******************************************************
 * Uniform SCL layer over each feature of the feature collection
 * by take the mode of SCL in each feature
*******************************************************/
  var set_scl_each_image = function(image){
    
    var set_scl_each_field = function(region){
      
      var scl_value = ee.Dictionary(image.reduceRegion({
        reducer: ee.Reducer.mode(),
        geometry: region.geometry(),
        scale: 20,
        bestEffort: true
      })).combine(ee.Dictionary.fromLists(ee.List(["SCL"]),ee.List([ee.Number(1)])),false)
      .getNumber("SCL");
      
      return ee.Image(scl_value).clipToBoundsAndScale({
        geometry: region.geometry(),
        scale: 20
      }).clip(region.geometry()).rename("SCL").toByte();
    };
    
    var time_start_value = image.get('system:time_start');
    var footprint = image.get('system:footprint');
    var mosaic = ee.ImageCollection(AOI.map(set_scl_each_field)).mosaic()
    .set({
      'system:time_start':time_start_value,
      'system:footprint':footprint
    });
    
    return mosaic;
  };
  
  var scl_mode = scl.map(set_scl_each_image);
  
  return scl_mode;
  
};