/******************************************************
 * Author: Emanuele Spirito
 * Copyright: 2025
 * See latest stable version on my GitHub at 
 * https://github.com/emanuelespiritowork/gee-utils-scripts
*******************************************************/

/******************************************************
 * PURPOSE OF THIS SCRIPT
 * Input: ee.ImageCollection
 * Output: ee.FeatureCollection
 * Description: create a time series of an image collection for all the 
 * cropfields contained in the AOI. The table generated contains the 
 * columns id_name that tells the id of the cropfield, the date of the image, 
 * the system:time_start that is the date of the image but using milliseconds.
 * The rows are all the image collection values averaged in each field in 
 * each date. 
*******************************************************/

exports.time_series_create = function(img_coll, AOI, id_name, scale_to_use){
  
  img_coll = ee.ImageCollection(img_coll);
  AOI = ee.FeatureCollection(AOI);
  id_name = ee.String(id_name);
  scale_to_use = ee.Number(scale_to_use);
  
  var layer_names = img_coll.first().bandNames().sort();
  print(layer_names);
  
  var space_series_img = function(img){
    var date = img.get('system:time_start');
    
    var make_number = function(element){
      return ee.Number(element);
    };
    
    var create_single_field_value = function(feature_of_cycle){
      
      var values = ee.List(img.reduceRegion({
        geometry: feature_of_cycle.geometry(),
        reducer: ee.Reducer.median(),
        scale: scale_to_use,
        bestEffort: true}).values());
        
      values = values.map(make_number);
        
      var keys_list = ['system:time_start','date','clock','id'];
      keys_list = ee.List(keys_list).cat(layer_names);
        
        
      var values_list = [date,ee.Date(date).format('Y/M/d'), ee.Date(date).format('H:m:s'), ee.String(feature_of_cycle.get(id_name))];
      values_list = ee.List(values_list).cat(values);
        
        
      var feature_of_single_field = ee.Feature(feature_of_cycle.geometry(), ee.Dictionary.fromLists({
        keys: keys_list,
        values: values_list
      }));
        
      return feature_of_single_field;
    };
    
    var all_field_features = AOI.map(create_single_field_value);
    
    //var all_field_features = create_single_field_value(single_feature.single_feature);
    
    return all_field_features;
  };
  
  return img_coll.map(space_series_img).flatten();
};

