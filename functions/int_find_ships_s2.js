var clip_to = require("users/emanuelespiritowork/SharedRepo:functions/clip_to.js");
var s2_scale = require("users/emanuelespiritowork/SharedRepo:functions/s2_scale.js");
var s2_ndvi = require("users/emanuelespiritowork/SharedRepo:functions/s2_ndvi.js");

exports.int_find_ships_s2 = function(img_coll,AOI,max_value,min_value,min_water,k_radius,n_iterations,min_scale){
  AOI = ee.FeatureCollection(AOI);
  var low_threshold = ee.Number(min_value || -0.4);
  var high_threshold = ee.Number(max_value || 0.1);
  var water_threshold = ee.Number(min_water || 0.1);
  var radius = ee.Number(k_radius || 1);
  var iterations = ee.Number(n_iterations || 1);
  var scale_to_use = ee.Number(min_scale || 10);
  
  var clip = clip_to.clip_to(img_coll,AOI,scale_to_use);
  
  var scale = s2_scale.s2_scale(clip);
  
  var find_ships = function(image){
    var mask_water = image.select(["B8"]).gt(water_threshold);
    
    var ndvi = image.normalizedDifference(["B8","B4"]);
    
    var mask_1 = ndvi.lt(high_threshold);
    var mask_2 = ndvi.gt(low_threshold);
    
    var mask = mask_2.and(mask_1).and(mask_water);
    
    var masked = mask.clip(AOI);
    
    // Define a kernel.
    var kernel = ee.Kernel.circle({radius: radius});
    
    // Perform an erosion followed by a dilation, display.
    var opened = masked
    .focalMin({
      kernel: kernel, 
      iterations: iterations
    })
    .focalMax({
      kernel: kernel, 
      iterations: iterations
    });
    
    var ships = opened.reduceToVectors({
      bestEffort: true
    })
    .filter(ee.Filter.eq("label",1));
    
    return(ships);
  };
  
  var all_ships = scale.map(find_ships).flatten();
  
  return(all_ships);
};

