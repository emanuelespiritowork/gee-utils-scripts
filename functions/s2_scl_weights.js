exports.s2_scl_weights = function(img_coll, AOI){
  
  var scl = img_coll.select("SCL");
  
  var set_scl_each_image = function(image){
    
    var set_scl_each_field = function(region){
      
      var scl_value = ee.Dictionary(image.reduceRegion({
        reducer: ee.Reducer.mode(),
        geometry: region.geometry(),
        scale: 20,
        bestEffort: true
      })).combine(ee.Dictionary.fromLists(ee.List(["SCL"]),ee.List([ee.Number(1).float()])),false)
      .getNumber("SCL").round();
      
      return ee.Image(scl_value).clipToBoundsAndScale({
        geometry: region.geometry(),
        scale: 20
      }).clip(region.geometry()).rename("SCL").byte();
    };
    
    var time_start_value = image.get('system:time_start');
    var footprint = image.get('system:footprint');
    var mosaic = ee.ImageCollection(AOI.map(set_scl_each_field)).mosaic()
    .set({
      'system:time_start':time_start_value,
      'system:footprint':footprint
    }).byte();
    
    return mosaic;
  };
  
  var scl_mode = scl.map(set_scl_each_image);
  
  return scl_mode;
  
};