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
  var propertyNames = time_series.first().propertyNames();
  var counter = 0;
  var counter_end = time_series.size();
  while(counter <= counter_end){
    feature = time_series.get(counter);
    propertyNames = propertyNames.cat(feature.propertyNames()).distinct();
  }
  
  var yProperties = propertyNames.remove('date')
  .remove('system:time_start')
  .remove('id')
  .remove('clock')
  .remove('system:index');
  
  return yProperties;
};