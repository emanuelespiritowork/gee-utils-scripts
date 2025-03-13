exports.int_find_objects = function(image,object_linear_dimension,scale_to_use){
  
  image = ee.Image(image);
  object_linear_dimension = ee.Number(object_linear_dimension);
  scale_to_use = ee.Number(scale_to_use);
  
  var clusterer = ee.Clusterer.wekaXMeans(2,10);
  
  Map.addLayer(image.geometry());
  
  var pixelArea = ee.Image.pixelArea();
  var areaImage = pixelArea.clip(image.geometry());
  var area = areaImage.reduceRegion({
    reducer: ee.Reducer.sum(),
    geometry: image.geometry(),
    scale: scale_to_use,
    bestEffort: true
  }).getNumber("area");
  
  print(area);
  
  var sample = image.sample({
    scale: object_linear_dimension.divide(scale_to_use).divide(2),
    region: image.geometry(),
    numPixels: area.sqrt().divide(object_linear_dimension).multiply(13),
    dropNulls: false
  });
  
  print(sample);
  
  var trained = clusterer.train(sample);
  
  var seg_alg = ee.Algorithms.Image.Segmentation.SNIC({
    image: image,
    size: object_linear_dimension.divide(scale_to_use).divide(2)
  });
  
  Map.addLayer(seg_alg);
  
  var clusters_vectors = seg_alg.reduceToVectors({
    bestEffort: true,
    reducer: ee.Reducer.mean(),
    scale: object_linear_dimension.divide(scale_to_use).divide(2)
  });
  
  Map.addLayer(clusters_vectors);
  
  var classification = clusters_vectors.cluster(trained);
  
  return classification;
};