exports.int_find_ships = function(img_coll, AOI, scale_to_use, threshold, connectedness){
  img_coll = ee.ImageCollection(img_coll);
  AOI = ee.FeatureCollection(AOI);
  threshold = ee.Number(threshold);
  scale_to_use = ee.Number(scale_to_use);
  
  var compact = connectedness || ee.Number(10);
};