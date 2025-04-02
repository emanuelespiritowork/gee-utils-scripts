/******************************************************
 * Author: Emanuele Spirito
 * Copyright: 2025
 * See latest stable version on my GitHub at 
 * https://github.com/emanuelespiritowork/gee-utils-scripts
*******************************************************/

/******************************************************
 * REQUIRES THE FOLLOWING FUNCTIONS:
 * transect_get_property_names
*******************************************************/

var transect_get_property_names = require("users/emanuelespiritowork/SharedRepo:functions/transect_get_property_names.js");

/******************************************************
 * PURPOSE OF THIS SCRIPT
 * Input: ee.Image
 * Output: ee.FeatureCollection
 * Description: this script is a function that generates a transect
 * slice over an image averaging along the transect using the scale of
 * the image. Some parts are taken from:
 * https://code.earthengine.google.com/b09759b8ac60366ee2ae4eccdd19e615
*******************************************************/

exports.transect_create_slice = function(img, transect, scale_to_use) {
/******************************************************
 * Check variable types
*******************************************************/
  img = ee.Image(img);
  //transect = ee.Geometry(transect); it has to be a LineString
  scale_to_use = ee.Number(scale_to_use);
/******************************************************
 * Get length of the transect
*******************************************************/
  var length = transect.length();
/******************************************************
 * Get first band name
*******************************************************/
  var bands_names = img.bandNames();
  //print(bands_names);
  //var single_band_name = ee.List([bands_names.getString(0)]);
  //print(single_band_name);
/******************************************************
 * Compute distance list
*******************************************************/  
  var distances = ee.List.sequence({
    start: ee.Number(0), 
    end: length,
    step: scale_to_use
  });
/******************************************************
 * Split transect into subtransects
*******************************************************/
  var lines = transect.cutLines(distances).geometries();
  lines = lines.zip(distances).map(function(l) { 
    l = ee.List(l);
    
    var geom = ee.Geometry(l.get(0));
    var distance = ee.Number(l.get(1));
    
    geom = ee.Geometry.LineString(geom.coordinates());
    
    return ee.Feature(geom, {distance: distance});
  });
  
  lines = ee.FeatureCollection(lines);
/******************************************************
 * Reduce image for every segment
*******************************************************/
  var values = img.reduceRegions( {
    collection: ee.FeatureCollection(lines), 
    reducer: ee.Reducer.mean(), 
    scale: scale_to_use
  });
/******************************************************
 * Get image layer name
*******************************************************/
  //print(values.first().propertyNames());
  
  var property_names = transect_get_property_names.transect_get_property_names(values)
  .cat(['distance']);
  
  //print(property_names);
  
/******************************************************
 * Rename image values adding distance
*******************************************************/  
  var values_renamed = values.select({
    propertySelectors: property_names,
    newProperties: img.bandNames().cat(['distance'])
  });
  
  //print(values_renamed);
  
  return values_renamed;
}