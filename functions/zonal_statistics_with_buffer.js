exports.zonal_statistics_with_buffer = function(img, points, reducer, scale_to_use){
  img = ee.Image(img);
  points = ee.Geometry.MultiPoint(points);
  scale_to_use = ee.Number(scale_to_use);
  
};