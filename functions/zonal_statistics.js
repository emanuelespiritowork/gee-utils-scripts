exports.zonal_statistics = function(img, AOI, reducer, scale_to_use){
  img = ee.Image(img);
  AOI = ee.FeatureCollection(AOI);
  scale_to_use = ee.Number(scale_to_use);
  
  var zonal_statistics = img.reduceRegions({
    collection: AOI,
    reducer: reducer,
    scale: scale_to_use
  });
  
  return zonal_statistics;
};