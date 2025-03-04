exports.int_find_ships = function(img_coll, AOI, scale_to_use, threshold, connectedness, radius){
  img_coll = ee.ImageCollection(img_coll);
  AOI = ee.FeatureCollection(AOI);
  threshold = ee.Number(threshold);
  scale_to_use = ee.Number(scale_to_use);
  
  var compactness = connectedness || ee.Number(10);
  
  var size = radius || 3;
  
  var clip = clip_to.clip_to(img_coll,AOI,scale_to_use);
  
  var select = clip.select("VH") || clip.select("VV") || clip.select("HH") || clip.select("HV");
  
  var kernel_circle = ee.Kernel.circle({
    radius: size,
    units: "pixels",
    normalize: false
  });
  
  var get_image_to_reduce = function(image){
    var start_date = image.get("system:time_start");
    
    var over_threshold = image.gt(threshold);
    
    var compact = over_threshold
    .reduceNeighborhood({
      reducer: ee.Reducer.sum(),
      kernel: kernel_circle,
    })
    .gt(compactness)
    .rename("compact");
    
    var max = over_threshold
    .reduceNeighborhood({
      reducer: ee.Reducer.max(),
      kernel: kernel_circle
    }).rename("max");
    
    var image_to_reduce = max.addBands(compact)
    .set({
      "system:time_start": start_date
    });
    
    return image_to_reduce;
  };
  
  var image_to_reduce = select.map(get_image_to_reduce);
  
  
};