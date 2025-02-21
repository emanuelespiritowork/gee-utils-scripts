/******************************************************
 * Author: Emanuele Spirito
 * Copyright: 2025
 * See latest stable version on my GitHub at 
 * https://github.com/emanuelespiritowork/gee-utils-scripts
*******************************************************/

/******************************************************
 * PURPOSE OF THIS SCRIPT
 * Input: ee.Image, ee.FeatureCollection, ee.Number
 * Output: ee.Image
 * Description: unsupervised classification of an image
*******************************************************/

exports.class_unsup = function(img, sample_regions, classes, scale_to_use){
  
  img = ee.Image(img);
  sample_regions = ee.FeatureCollection(sample_regions);
  classes = ee.Number(classes);
  scale_to_use = ee.Number(scale_to_use);
  
  var clusterer = ee.Clusterer.wekaKMeans(classes);
  var sample = img.sample({
    region: sample_regions.geometry(),
    scale: scale_to_use
  });
  
  var trained = clusterer.train(sample);
  
  var classification = img.cluster(trained, "unsup");
  
  return classification;
  
};