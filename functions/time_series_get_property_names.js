/******************************************************
 * Author: Emanuele Spirito
 * Copyright: 2025
 * See latest stable version on my GitHub at 
 * https://github.com/emanuelespiritowork/gee-utils-scripts
*******************************************************/

/******************************************************
 * PURPOSE OF THIS SCRIPT
 * Input: ee.FeatureCollection
 * Output: ee.List 
 * Description: find the list of property layer names of a time
 * series
*******************************************************/
exports.time_series_get_property_names = function(time_series){
/******************************************************
 * Check variable types
*******************************************************/
  time_series = ee.FeatureCollection(time_series);
/******************************************************
 * Get property names
*******************************************************/
  var size = time_series.size();
  var time_series_list = time_series.toList({
    count: size
  });

  var get_property_names_list = function(feature){
    return ee.Feature(feature).propertyNames();
  };

  var property_list = ee.List(time_series_list.map(get_property_names_list)).flatten().distinct();

  //print(property_list);
  
  var yProperties = propertyNames.remove('date')
    .remove('image:time_start')
    .remove('id')
    .remove('clock')
    .remove('image:index')
    .remove('system:index');
  
  return yProperties;
};