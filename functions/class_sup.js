/******************************************************
 * Author: Emanuele Spirito
 * Copyright: 2025
 * See latest stable version on my GitHub at 
 * https://github.com/emanuelespiritowork/gee-utils-scripts
*******************************************************/

/******************************************************
 * PURPOSE OF THIS SCRIPT
 * Input: ee.Image, ee.FeatureCollection, ee.Number, ee.Number
 * Output: ee.Image
 * Description: unsupervised classification of an image
*******************************************************/

exports.class_sup = function(img, samples, scale_to_use){
/******************************************************
 * Check variable types
*******************************************************/
  img = ee.Image(img);
  samples = ee.FeatureCollection(samples);
  scale_to_use = ee.Number(scale_to_use);
/******************************************************
 * Get property name
*******************************************************/
  var property_name = samples.first().propertyNames().getString(0);
/******************************************************
 * Define the classifier
*******************************************************/
  var classifier = ee.Classifier.smileCart();

  var trained = classifier.train({
    features: samples,
    classProperty: property_name
  });
  
  var classification = img.classify(trained);
  
  return classification;
};