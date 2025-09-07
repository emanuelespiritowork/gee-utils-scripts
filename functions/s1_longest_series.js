var s1_select = require("users/emanuelespiritowork/SharedRepo:functions/s1_select.js");

//qui manca la selezione dell'angolo
exports.s1_longest_series = function(start_date,last_date,AOI){
  //mandatory inputs
  start_date = ee.Date(start_date);//"YYYY-MM-DD"
  last_date = ee.Date(last_date);//"YYYY-MM-DD"
  AOI = ee.FeatureCollection(AOI);
  
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
  //.select('VH');
  .select(['VH','angle');
  
  var select_IW_HV_D_H_filtered = select_IW_HV_D_H.filterBounds(AOI)
  .set({'size':select_IW_HV_D_H.filterBounds(AOI).size()})
  //.select('HV');
  .select(['HV','angle']);
  
  var select_IW_VH_A_H_filtered = select_IW_VH_A_H.filterBounds(AOI)
  .set({'size':select_IW_VH_A_H.filterBounds(AOI).size()})
  //.select('VH');
  .select(['VH','angle']);
  
  var select_IW_HV_A_H_filtered = select_IW_HV_A_H.filterBounds(AOI)
  .set({'size':select_IW_HV_A_H.filterBounds(AOI).size()})
  //.select('HV');
  .select(['HV','angle']);
  
  var list_of_image_collections = ee.List([select_IW_VH_D_H_filtered,
  select_IW_HV_D_H_filtered,select_IW_VH_A_H_filtered,select_IW_HV_A_H_filtered]);
  
  var collection_of_collection_of = ee.FeatureCollection(list_of_image_collections);
  
  print(collection_of_collection_of);
  
  var collection_of_collection_of_sorted = collection_of_collection_of
  .sort('size',false);
  
  var longest_image_collection = ee.ImageCollection(collection_of_collection_of_sorted
  .first());
  
  print(longest_image_collection);
  
  return longest_image_collection;
};