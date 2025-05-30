/******************************************************
 * Author: Emanuele Spirito
 * Copyright: 2025
 * See latest stable version on my GitHub at 
 * https://github.com/emanuelespiritowork/gee-utils-scripts
*******************************************************/

/******************************************************
 * PURPOSE OF THIS SCRIPT
 * Input: ee.FeatureCollection (mandatory),
 *        ee.String (mandatory),
 *        ee.List (optional)
 * Output: (nothing) 
 * Description: exports the time series as a csv on your Google Drive. 
 * Use the function time_series_create.js to create the time_series
*******************************************************/

exports.time_series_export_asy = function(time_series, export_folder){
/******************************************************
 * Check variable types (mandatory inputs)
*******************************************************/
  time_series = ee.FeatureCollection(time_series);
  export_folder = ee.String(export_folder);
/******************************************************
 * Export to Drive
*******************************************************/
  Export.table.toDrive({
    collection: time_series, 
    description: "export_time_series"
  });
  return 0;
};