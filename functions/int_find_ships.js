/******************************************************
 * REQUIRES THE FOLLOWING FUNCTIONS:
 * clip_to
*******************************************************/

var clip_to = require("users/emanuelespiritowork/SharedRepo:functions/clip_to.js");

/******************************************************
 * PURPOSE OF THIS SCRIPT
 * Input: ee.FeatureCollection (mandatory), 
 *        ee.Number (optional), 
 *        ee.String (optional), 
 *        ee.Number (optional)
 * Output: ee.FeatureCollection
 * Description: find ships in the AOI using a image collection of the past
*******************************************************/

exports.int_find_ships = function(AOI, scale_to_use, threshold, connectedness, radius){
  
  AOI = ee.FeatureCollection(AOI);
  threshold = ee.Number(threshold);
  scale_to_use = ee.Number(scale_to_use);
  
  var compactness = connectedness || ee.Number(10);
  
  var size = radius || 3;
  
};