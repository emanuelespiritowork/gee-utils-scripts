exports.rbias = function(image, features){
  
  image = ee.Image(image);//with 1 band
  
  var AOI = ee.FeatureCollection(features) || ee.FeatureCollection(image.geometry());
  
  var divide_features = function(feature){
    var mean = image.clip(feature.geometry()).reduceRegion({
      reducer: ee.Reducer.mean()
    });
    
    var new_value = image.subtract(ee.Image(mean))
    .divide(ee.Image(mean))
    .clip(feature.geometry());
    
    return new_value;
  };
  
  var collection_of_new_image = ee.ImageCollection(AOI.map(divide_features));
  
  print(collection_of_new_image);
  
  var mosaic = collection_of_new_image.mosaic();
  
  return mosaic;
};