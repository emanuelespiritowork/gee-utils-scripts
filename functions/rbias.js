exports.rbias = function(image){
  
  image = ee.Image(image);//with 1 band
  
  mean = image.reduce({
    reducer: ee.Reducer.mean()
  }).getNumber(0);
  
  
  
};