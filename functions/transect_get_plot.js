/******************************************************
 * Author: Emanuele Spirito
 * Copyright: 2025
 * See latest stable version on my GitHub at 
 * https://github.com/emanuelespiritowork/gee-utils-scripts
*******************************************************/

/******************************************************
 * PURPOSE OF THIS SCRIPT
 * Input: ee.FeatureCollection
 * Output: ui.Chart
 * Description: generates a plot of the input transect slice done by 
 * transect_create_slice
*******************************************************/

exports.transect_get_plot = function(transect_slice){
/******************************************************
 * Check variable types
*******************************************************/
  transect_slice = ee.FeatureCollection(transect_slice);
/******************************************************
 * Get property name
*******************************************************/
  var yProperties = transect_slice.first().propertyNames()
  .remove('distance')
  .remove('system:index');
  
  //print("yProperties",yProperties);
  //print("transect_slice",transect_slice);
  
  var plot = ui.Chart.feature.byFeature({
    features: transect_slice, 
    xProperty: 'distance', 
    yProperties: yProperties.getInfo()
  });
  
  return plot;
};