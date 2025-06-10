exports.s2_sigma = function(img_coll, AOI){
  img_coll = ee.ImageCollection(img_coll);
  AOI = ee.FeatureCollection(AOI);
  
  var kernel = ee.Kernel.circle({
    radius: 3,
    units: "pixels"
  });
  
  var compute_sigma = function(img){
    
  };
};