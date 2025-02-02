/******************************************************
 * Author: Emanuele Spirito
 * Copyright: 2025
 * See latest stable version on my GitHub at 
 * https://github.com/emanuelespiritowork/gee-utils-scripts
*******************************************************/

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
  
  img = ee.Image(img);
  //transect = ee.Geometry(transect); it has to be a LineString
  scale_to_use = ee.Number(scale_to_use);
  
  var length = transect.length();
  var bands_names = img.bandNames();
  //print(bands_names);
  var single_band_name = ee.List([bands_names.getString(0)]);
  //print(single_band_name);
  var step = scale_to_use;
  //var step = img.select(single_band_name).projection().nominalScale();
  //print(step);
  var distances = ee.List.sequence({
    start: ee.Number(0), 
    end: length,
    step: step
  });
  
  var lines = transect.cutLines(distances).geometries();
  lines = lines.zip(distances).map(function(l) { 
    l = ee.List(l);
    
    var geom = ee.Geometry(l.get(0));
    var distance = ee.Number(l.get(1));
    
    geom = ee.Geometry.LineString(geom.coordinates());
    
    return ee.Feature(geom, {distance: distance});
  });
  
  lines = ee.FeatureCollection(lines);

  // reduce image for every segment
  var values = img.reduceRegions( {
    collection: ee.FeatureCollection(lines), 
    reducer: ee.Reducer.mean(), 
    scale: step
  });
  
  var property_names = values.first().propertyNames()
  .remove('distance')
  .remove('system:index')
  .cat(['distance']);
  
  //print(property_names);
  
  var values_renamed = values.select({
    propertySelectors: property_names,
    newProperties: img.bandNames().cat(['distance'])
  });
  
  //print(values_renamed);
  
  return values_renamed;
}