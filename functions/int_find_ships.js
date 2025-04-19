/******************************************************
 * REQUIRES THE FOLLOWING FUNCTIONS:
 * int_find_ships_any
*******************************************************/

var int_find_ships_any = require("users/emanuelespiritowork/SharedRepo:functions/int_find_ships_any.js");
var s1_select = require("users/emanuelespiritowork/SharedRepo:functions/s1_select.js");
//var s1_select_all_pol = require("users/emanuelespiritowork/SharedRepo:functions/s1_select_all_pol.js");
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

exports.int_find_ships = function(start_date, last_date, AOI, min_scale, min_value, connectedness, radius){
  //mandatory inputs
  start_date = ee.Date(start_date);//"YYYY-MM-DD"
  last_date = ee.Date(last_date);//"YYYY-MM-DD"
  AOI = ee.FeatureCollection(AOI);
  //optional inputs
  var scale_to_use = min_scale || ee.Number(10);
  var threshold = min_value || ee.Number(-16);
  var compactness = connectedness || ee.Number(10);
  var size = radius || ee.Number(3);
  
  //create the img_coll to call the int_find_ships_any function
  var s1_coll = ee.ImageCollection("COPERNICUS/S1_GRD")
  .filterDate(start_date,last_date);
  var select_IW_VH_D_H = s1_select.s1_select(s1_coll, "IW", "VH", "DESCENDING", "H");
  var select_IW_HV_D_H = s1_select.s1_select(s1_coll, "IW", "HV", "DESCENDING", "H");
  var select_IW_VH_A_H = s1_select.s1_select(s1_coll, "IW", "VH", "ASCENDING", "H");
  var select_IW_HV_A_H = s1_select.s1_select(s1_coll, "IW", "HV", "ASCENDING", "H");
  
  /*
  var select_IW_VH_D_H_filtered = ee.Algorithms.If({
    condition: select_IW_VH_D_H.filterBounds(AOI).size().eq(0),
    trueCase: undefined,
    falseCase: select_IW_VH_D_H.filterBounds(AOI)
  });*/
  //print(select_IW_VH_D_H_filtered);
  
  
  var select_IW_VH_D_H_filtered = select_IW_VH_D_H.filterBounds(AOI)
  .set({'size': select_IW_VH_D_H.filterBounds(AOI).size()})
  .select('VH');
  
  var select_IW_HV_D_H_filtered = select_IW_HV_D_H.filterBounds(AOI)
  .set({'size':select_IW_HV_D_H.filterBounds(AOI).size()})
  .select('HV');
  
  var select_IW_VH_A_H_filtered = select_IW_VH_A_H.filterBounds(AOI)
  .set({'size':select_IW_VH_A_H.filterBounds(AOI).size()})
  .select('VH');
  
  var select_IW_HV_A_H_filtered = select_IW_HV_A_H.filterBounds(AOI)
  .set({'size':select_IW_HV_A_H.filterBounds(AOI).size()})
  .select('HV');
  
  var list_of_image_collections = ee.List([select_IW_VH_D_H_filtered,
  select_IW_HV_D_H_filtered,select_IW_VH_A_H_filtered,select_IW_HV_A_H_filtered]);
  
  var collection_of_collection_of = ee.FeatureCollection(list_of_image_collections);
  
  print(collection_of_collection_of);
  
  var collection_of_collection_of_sorted = collection_of_collection_of
  .sort('size',false);
  
  var longest_image_collection = ee.ImageCollection(collection_of_collection_of_sorted
  .first());
  
  print(longest_image_collection);
  
  return int_find_ships_any.int_find_ships_any(longest_image_collection,AOI,
  scale_to_use, threshold, compactness, size);
};