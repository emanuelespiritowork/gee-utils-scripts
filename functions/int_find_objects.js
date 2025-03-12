var class_unsup = require("users/emanuelespiritowork/SharedRepo:functions/class_unsup.js");

exports.int_find_objects = function(image,object_linear_dimension,scale_to_use){
  
  image = ee.Image(image);
  object_linear_dimension = ee.Number(object_linear_dimension);
  scale_to_use = ee.Number(scale_to_use);
  
  var seg_alg = ee.Algorithms.Image.Segmentation.SNIC({
    image: image,
    size: object_linear_dimension.divide(scale_to_use).divide(2)
  });
  
  var clusters = seg_alg.reduceToVectors({
    reducer: ee.Reducer.mean(),
    bestEffort: true,
    scale: object_linear_dimension.divide(scale_to_use).divide(2)
  });
  
  var clusterer = ee.Clusterer.wekaXMeans(2,10);
  var sample = seg_alg.sampleRegions({
    collection: clusters
    scale: scale_to_use
  });
  
  var trained = clusterer.train(sample);
  
  var classification = seg_alg.cluster(trained, "unsup");
  
  return seg_alg;
};