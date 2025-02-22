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
 * Description: supervised classification of an image
*******************************************************/

exports.class_sup = function(img, points, scale_to_use, classProperty){
/******************************************************
 * Check variable types
*******************************************************/
  img = ee.Image(img);
  points = ee.FeatureCollection(points);
  scale_to_use = ee.Number(scale_to_use);
/******************************************************
 * Get property name
*******************************************************/
  var property_name = classProperty || points.first().propertyNames()
  .remove("system:index").getString(0);
/******************************************************
 * Define the classifier
*******************************************************/
  var classifier = ee.Classifier.smileCart();
/******************************************************
 * Get sample points band values
*******************************************************/
  var samples = img.sampleRegions({
    collection: points,
    scale: scale_to_use,
  });
/******************************************************
 * Train the classifier
*******************************************************/
  var trained = classifier.train({
    features: samples,
    classProperty: property_name
  });
/******************************************************
 * Create classification
*******************************************************/
  var classification = img.classify(trained);
  
  return classification;
};