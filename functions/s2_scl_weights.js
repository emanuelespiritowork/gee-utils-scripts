exports.s2_scl_weights = function(img_coll, AOI, scale_to_use){
  
  var scl = img_coll.select("SCL");
  
  var set_scl_each_image = function(image){
    
    var set_scl_each_field = function(region){
      
      var scl_value = ee.Dictionary(image.reduceRegion({
        reducer: ee.Reducer.mode(),
        geometry: region.geometry(),
        scale: scale_to_use
      })).combine(ee.Dictionary.fromLists(ee.List(["SCL"]),ee.List([ee.Number(1).int()])),false)
      .getNumber("SCL").toInt();
      
      return ee.Image(scl_value).clipToBoundsAndScale({
        geometry: region.geometry(),
        scale: scale_to_use
      }).clip(region.geometry()).rename("SCL").toInt();
    };
    
    var time_start_value = image.get('system:time_start');
    var footprint = image.get('system:footprint');
    var mosaic = ee.ImageCollection(AOI.map(set_scl_each_field)).mosaic()
    .set({
      'system:time_start':time_start_value,
      'system:footprint':footprint
    }).toInt();
    
    return mosaic;
  };
  
  var scl_mode = scl.map(set_scl_each_image);
  
  return scl_mode;
  
};