/******************************************************
 * REQUIRES THE FOLLOWING FUNCTIONS:
 * int_find_ships_any
*******************************************************/

var int_find_ships_any = require("users/emanuelespiritowork/SharedRepo:functions/int_find_ships_any.js");

/******************************************************
 * PURPOSE OF THIS SCRIPT
 * Input: ee.FeatureCollection (mandatory), 
 *        ee.Number (optional), 
 *        ee.String (optional), 
 *        ee.Number (optional)
 * Output: ee.FeatureCollection
 * Description: find ships in the AOI using a image collection of the past
*******************************************************/

exports.int_find_ships = function(start_date, end_date, AOI, min_scale, min_value, connectedness, radius){
  //mandatory inputs
  start_date = ee.Date(start_date);//"YYYY-MM-DD"
  last_date = ee.Date(last_date);//"YYYY-MM-DD"
  AOI = ee.FeatureCollection(AOI);
  //optional inputs
  var threshold = min_value || ee.Number(-16);
  var scale_to_use = min_scale || ee.Number(10);
  var compactness = connectedness || ee.Number(10);
  var size = radius || 3;
  
  //create the img_coll to call the int_find_ships_any function
  
  
  
};