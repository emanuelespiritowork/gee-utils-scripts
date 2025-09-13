var clip_to = require("users/emanuelespiritowork/SharedRepo:functions/clip_to.js");

exports.int_find_ships_s2 = function(img_coll,AOI,k_radius,n_iterations,min_scale){
  AOI = ee.FeatureCollection(AOI);
  var radius = k_radius || ee.Number(1);
  var iterations = n_iterations || ee.Number(1);
  var scale_to_use = min_scale || ee.Number(10);
  
  var clip = clip_to.clip_to(img_coll,AOI,scale_to_use);
  
  //CONTINUE
  
  
  var clip = clip_to.clip_to(s2_coll,AOI,scale_to_use);
  
  var scale = s2_scale.s2_scale(clip);
  
  var s2_series = s2_ndvi.s2_ndvi(scale);
  
  
var mask_1 = img_coll.first().normalizedDifference(["B8","B4"]).lt(-0.15);
var mask_2 = imageCollection.filterBounds(geometry).first().normalizedDifference(["B8","B4"]).gt(-0.4);
var mask = mask_2.and(mask_1);

var image = mask.clip(geometry);
// Define a kernel.
var kernel = ee.Kernel.circle({radius: radius});

// Perform an erosion followed by a dilation, display.
var opened = image
             .focalMin({kernel: kernel, iterations: iterations
             })
             .focalMax({kernel: kernel, iterations: iterations});
             
var ships = opened.reduceToVectors({
  bestEffort: true
}).filter(ee.Filter.eq("label",1));

return(ships);
}

