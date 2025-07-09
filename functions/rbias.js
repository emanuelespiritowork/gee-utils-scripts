exports.rbias = function(image, AOI){
  
  image = ee.Image(image);//with 1 band
  
  mean = image.reduce({
    reducer: ee.Reducer.mean()
  }).getNumber(0);
  
  new_value = image.subtract(ee.Image(mean)).divide(ee.Image(mean));
  
  return new_value;
};