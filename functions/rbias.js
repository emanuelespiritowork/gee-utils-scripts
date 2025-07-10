exports.rbias = function(multi_image, features){
  
  multi_image = ee.Image(multi_image);//with 1 band
  
  var AOI = ee.FeatureCollection(features) || ee.FeatureCollection(multi_image.geometry());
  
  print(AOI);
  
  var band_names = multi_image.bandNames();
  
  print(band_names);
  
  var conversion = function(band){
    return multi_image.select(ee.List([band]));
  };
  
  var img_coll = ee.ImageCollection(band_names.map(conversion)); 
  
  print(img_coll);
  
  var apply_to_image = function(image){
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
  
  //print(collection_of_new_image);
  
  var mosaic = collection_of_new_image.mosaic();
  
  return mosaic;
};
  
  return ee.ImageCollection(img_coll.map(apply_to_image)).toBands();
};