exports.s2_scl_weights = function(img_coll, AOI, scale_to_use){
  
  var scl = img_coll.select("SCL");
  
  var set_scl_each_image = function(image){
    
    var set_scl_each_field = function(region){
      
      var scl_value = image.reduceRegion({
        reducer: ee.Reducer.mode(),
        geometry: region.geometry(),
        scale: scale_to_use
      }).getNumber("SCL");
      
      return ee.Image(scl_value).clipToBoundsAndScale({
        geometry: region.geometry(),
        scale: scale_to_use
      }).clip(region.geometry());
    };
    
    var mosaic = ee.ImageCollection(AOI.map(set_scl_each_field)).mosaic();
    
    return mosaic;
  };
  
  var scl_mode = scl.map(set_scl_each_image);
  
  return scl_mode;
  
};