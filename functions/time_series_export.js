/******************************************************
 * Author: Emanuele Spirito
 * Copyright: 2025
 * See latest stable version on my GitHub at 
 * https://github.com/emanuelespiritowork/gee-utils-scripts
*******************************************************/

/******************************************************
 * PURPOSE OF THIS SCRIPT
 * Input: ee.FeatureCollection
 * Output: (nothing) 
 * Description: exports the time series as a csv on your Google Drive. 
 * Use the function time_series_create.js to create the time_series
*******************************************************/

exports.time_series_export = function(time_series, property_list, export_folder){
  
  time_series = ee.FeatureCollection(time_series);
  export_folder = ee.String(export_folder);
  property_list = ee.List(property_list);
  
  /*var selectors_name = ee.String(time_series.first().propertyNames()
  .remove("system:index")
  .remove("system:time_start")
  .join(", "))
  .getInfo();*/
  
  var selectors_name = property_list.cat(ee.String("id")).cat(ee.String("date"))
  .join(", ")
  .getInfo();
  print(selectors_name);
  
  Export.table.toDrive({
    collection: time_series, 
    description: "export_time_series",
    selectors: selectors_name,
    folder: export_folder.getInfo()});
  return 0;
};