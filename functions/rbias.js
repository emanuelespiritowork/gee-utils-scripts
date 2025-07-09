exports.rbias = function(image){
  
  image = ee.Image(image);
  
  mean = image.reduce({
    reducer: ee.Reducer.mean()
  }).getNumber(0);
};