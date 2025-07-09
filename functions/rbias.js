exports.rbias = function(multi_image, features){
  
  multi_image = ee.Image(multi_image);//with 1 band
  
  var AOI = ee.FeatureCollection(features) || ee.FeatureCollection(image.geometry());
  
  var band_names = image.bandNames();
  
  var conversion = function(band){
    return multi_image.select(band);
  }
  
  var img_coll = 
  
  var apply_to_image = function(band){
    var divide_features = function(feature){
    var band_name = image.bandNames().get(0);
    
    var mean = image.reduceRegion({
      reducer: ee.Reducer.mean(),
      geometry: feature.geometry()
    }).getNumber(band_name);
    
    var new_value = image.subtract(ee.Image(mean))
    .divide(ee.Image(mean))
    .clip(feature.geometry());
    
    return new_value.toFloat();
  };
  
  var collection_of_new_image = ee.ImageCollection(AOI.map(divide_features));
  
  print(collection_of_new_image);
  
  var mosaic = collection_of_new_image.mosaic();
  
  return mosaic;
}
  
  
};