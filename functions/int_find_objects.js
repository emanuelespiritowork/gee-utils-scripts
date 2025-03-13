exports.int_find_objects = function(image,object_linear_dimension,scale_to_use){
  
  image = ee.Image(image);
  object_linear_dimension = ee.Number(object_linear_dimension);
  scale_to_use = ee.Number(scale_to_use);
  
  var clusterer = ee.Clusterer.wekaXMeans(2,10);
  
  var sample = image.sample({
    scale: scale_to_use
  });
  
  var trained = clusterer.train(sample);
  
  var seg_alg = ee.Algorithms.Image.Segmentation.SNIC({
    image: image,
    size: object_linear_dimension.divide(scale_to_use).divide(2)
  });
  
  var clusters = seg_alg.reduceToVectors({
    reducer: ee.Reducer.mean(),
    bestEffort: true,
    scale: object_linear_dimension.divide(scale_to_use).divide(2)
  });
  
  Map.addLayer(clusters);
  
  
  
  
  
  
  var classification = seg_alg.cluster(trained, "unsup");
  
  return seg_alg;
};