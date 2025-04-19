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
  var threshold = min_value || ee.Number(-16);
  var scale_to_use = min_scale || ee.Number(10);
  var compactness = connectedness || ee.Number(10);
  var size = radius || ee.Number(3);
  
  //create the img_coll to call the int_find_ships_any function
  var s1_coll = ee.ImageCollection("COPERNICUS/S1_GRD");
  var select_IW_VH_D_H = s1_select.s1_select(s1_coll, "IW", "VH", "DESCENDING", "H");
  var select_IW_HV_D_H = s1_select.s1_select(s1_coll, "IW", "HV", "DESCENDING", "H");
  var select_IW_VH_A_H = s1_select.s1_select(s1_coll, "IW", "VH", "ASCENDING", "H");
  var select_IW_HV_A_H = s1_select.s1_select(s1_coll, "IW", "HV", "ASCENDING", "H");
  print(select_IW_VH_D_H.filterBounds(AOI));
  print(select_IW_HV_D_H.filterBounds(AOI));
  if(select_IW_HV_D_H.filterBounds(AOI).size() === 0)
  {
    var select_IW_HV_D_H_filtered = null;
  }
  print(select_IW_VH_A_H.filterBounds(AOI));
  print(select_IW_HV_A_H.filterBounds(AOI));
  
  var using_img_coll = select_IW_HV_D_H_filtered || select_IW_VH_D_H.filterBounds(AOI) || select_IW_VH_A_H.filterBounds(AOI) ||  select_IW_HV_A_H.filterBounds(AOI);
  print(using_img_coll);
  
  //var select_IW_A_H = s1_select_all_pol.s1_select_all_pol(s1_coll, "IW", "ASCENDING", "H");
  //var select_IW_D_H = s1_select_all_pol.s1_select_all_pol(s1_coll, "IW", "DESCENDING", "H");
  //print(select_IW_A_H.filterBounds(AOI));
  //print(select_IW_D_H.filterBounds(AOI));

  
  
  return 0;
};