exports.time_series_for_pixels_create = function(img_coll, AOI){
  img_coll = ee.ImageCollection(img_coll);
  AOI = ee.FeatureCollection(AOI);
  
  var reducing_image = function(image){
    var image_index = image.get("system:index");
    var image_time_start = image.get("system:time_start");
    var date = ee.Date(image.get("system:time_start")).format('Y/M/d');
    var clock = ee.Date(image.get("system:time_start")).format('H:m:s');
    
    var set_values = function(feature){
      return feature.set(
      'image:index', image_index,
      'image:time_start', image_time_start,
      'date', date,
      'clock', clock
    );
    };
    
    var setting_feature_descriptors = image.addBands(ee.Image.pixelCoordinates(image.projection().crs()))
    .addBands(ee.Image.constant(ee.Number.parse(image.projection().crs())))
    .sampleRegions(AOI).map(set_values);
    
    return setting_feature_descriptors;
};
  
  var reduced_time_series = img_coll.map(reducing_image).flatten();
  
  return reduced_time_series;
};