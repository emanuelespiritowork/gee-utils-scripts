exports.int_find_objects = function(image,object_linear_dimension,scale_to_use){
  
  image = ee.Image(image);
  object_linear_dimension = ee.Number(object_linear_dimension);
  scale_to_use = ee.Number(scale_to_use);
  
  var band_name = image.bandNames();
  
  var clusterer = ee.Clusterer.wekaXMeans(2,10);
  
  var pixelArea = ee.Image.pixelArea();
  var areaImage = pixelArea.clip(image.geometry());
  var area = areaImage.reduceRegion({
    reducer: ee.Reducer.sum(),
    geometry: image.geometry(),
    scale: scale_to_use,
    bestEffort: true
  }).getNumber("area");
  
  var sample = image.sample({
    scale: object_linear_dimension.divide(scale_to_use).divide(2),
    region: image.geometry(),
    numPixels: area.sqrt().divide(object_linear_dimension).multiply(13).round(),
    dropNulls: false
  });
  
  var trained = clusterer.train(sample);
  
  var seg_alg = ee.Algorithms.Image.Segmentation.SNIC({
    image: image,
    size: object_linear_dimension.divide(scale_to_use).divide(2)
  }).select('[^seed].*');
  
  var classification = seg_alg.rename(ee.List(["clusters"])
  .cat(band_name)).cluster(trained,"classification")
  .addBands(seg_alg.select("clusters"))
  .set({
    "system:time_start": image.get("system:time_start"),
    "min_class": image.select("classification").reduceRegion({reducer: ee.Reducer.min()}),
    "max_class": image.select("classification").reduceRegion({reducer: ee.Reducer.max()})
  });
  
  return classification;
};