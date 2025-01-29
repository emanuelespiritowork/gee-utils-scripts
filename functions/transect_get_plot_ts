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
 * Description: this script is a function that generates a plot
 * of the input transect slice done by transect_create_slice_img or
 * by transect_create_mosaic_img_coll
*******************************************************/

exports.transect_get_plot_ts = function(transect_slice){
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