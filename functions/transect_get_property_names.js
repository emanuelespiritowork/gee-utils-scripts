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
 * Description: find the list of property layer names of a transect
 * slice
*******************************************************/
exports.transect_get_property_names = function(transect_slice){
/******************************************************
 * Check variable types
*******************************************************/
  transect_slice = ee.FeatureCollection(transect_slice);
/******************************************************
 * Get property names
*******************************************************/
  var propertyNames = transect_slice.first().propertyNames();
  var counter = 0;
  var counter_end = transect_slice.size();
  while(counter <= counter_end){
    feature = transect_slice.get(counter);
    propertyNames = propertyNames.cat(feature.propertyNames()).distinct();
  }
  
  var yProperties = propertyNames.remove('distance')
  .remove('system:index');
  
  return yProperties;
};