/******************************************************
 * Author: Emanuele Spirito
 * Copyright: 2025
 * See latest stable version on my GitHub at 
 * https://github.com/emanuelespiritowork/gee-utils-scripts
*******************************************************/

/******************************************************
 * REQUIRES THE FOLLOWING FUNCTIONS:
 * time_series_get_property_names
*******************************************************/
var time_series_get_property_names = require("users/emanuelespiritowork/SharedRepo:functions/time_series_get_property_names.js");

/******************************************************
 * PURPOSE OF THIS SCRIPT
 * Input: ee.FeatureCollection
 * Output: (nothing) 
 * Description: exports the time series as a csv on your Google Drive. 
 * Use the function time_series_create.js to create the time_series
*******************************************************/

exports.time_series_export = function(time_series, export_folder, property_list){
/******************************************************
 * Check variable types
*******************************************************/
  time_series = ee.FeatureCollection(time_series);
  export_folder = ee.String(export_folder);
  
/******************************************************
 * Get layers name
*******************************************************/
  /*var selectors_name = property_list.cat(["id"]).cat(["date"]).cat(["clock"])
  .join(", ");*/
  
  var property_names = time_series_get_property_names.time_series_get_property_names(time_series)
  .cat(["id"]).cat(["date"]).cat(["clock"])
  .join(", ");
  
  var selectors_name = property_list || property_names;
  
  print(selectors_name);

/******************************************************
 * Export to Drive
*******************************************************/
  Export.table.toDrive({
    collection: time_series, 
    description: "export_time_series",
    selectors: selectors_name.getInfo(),
    folder: export_folder.getInfo()});
  return 0;
};