var clip_to = require("users/emanuelespiritowork/SharedRepo:functions/clip_to.js");
exports.int_find_ships = function(img_coll, AOI, scale_to_use, threshold, connectedness, radius){
  img_coll = ee.ImageCollection(img_coll);
  AOI = ee.FeatureCollection(AOI);
  threshold = ee.Number(threshold);
  scale_to_use = ee.Number(scale_to_use);
  
  var compactness = connectedness || ee.Number(10);
  
  var size = radius || 3;
  
  var clip = clip_to.clip_to(img_coll,AOI,scale_to_use);
  
  var select = clip.select("VH") || clip.select("VV") || clip.select("HH") || clip.select("HV");
  
  print(select);
  
  var kernel_circle = ee.Kernel.circle({
    radius: size,
    units: "pixels",
    normalize: false
  });
  
  var get_vectors = function(image){
    var time_start = image.get("system:time_start");
    var start_date = ee.Date(time_start)
    .format('Y/M/d');
    
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
    }).rename("over_threshold");
    
    var image_to_reduce = max.addBands(compact);
    
    var vector = image_to_reduce.reduceToVectors({
      scale: scale_to_use,
      bestEffort: true,
      reducer: ee.Reducer.max()
    })
    .filter(ee.Filter.gt("label",0))
    .filter(ee.Filter.gt("max",0));
    
    var count_size = max.reduceRegions({
      collection: vector,
      reducer: ee.Reducer.count(),
      scale: scale_to_use
    });
    
    var set_time_to_feature = function(feature){
      return feature.select("count").set({
        "system:time_start": time_start,
        "date": start_date
      });
    };
    
    return count_size.map(set_time_to_feature);
  };
  
  var ship_vectors = select.map(get_vectors).flatten();
  
  return ship_vectors;
};