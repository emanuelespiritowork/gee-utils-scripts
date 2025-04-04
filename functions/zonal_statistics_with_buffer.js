var zonal_statistics = require("users/emanuelespiritowork/SharedRepo:functions/zonal_statistics.js");

exports.zonal_statistics_with_buffer = function(img, points, distance, reducer, scale_to_use){
  img = ee.Image(img);
  points = ee.FeatureCollection(points);
  distance = ee.Number(distance);
  scale_to_use = ee.Number(scale_to_use);
  
  //create buffer
  var create_buffer = function(point){
    return point.buffer(distance);
  };
  
  var collection_of_buffers = points.map(create_buffer);
  
  Map.addLayer(collection_of_buffers);
  
  return zonal_statistics.zonal_statistics(img, collection_of_buffers, reducer, scale_to_use);
};