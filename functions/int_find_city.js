var int_find_city_any = require("users/emanuelespiritowork/SharedRepo:functions/int_find_city_any.js");

exports.int_find_city = function(start_date, end_date, AOI, min_scale, min_value){
  //mandatory inputs
  start_date = ee.Date(start_date);//"YYYY-MM-DD"
  end_date = ee.Date(end_date);//"YYYY-MM-DD"
  AOI = ee.FeatureCollection(AOI);
  //optional inputs
  var scale_to_use = ee.Number(min_scale || 10);
  var threshold = ee.Number(min_value || 40);
  
  print(start_date);
  print(end_date);
  
  var result = int_find_city_any.int_find_city_any({
    date_start: "2023-11-11",
    date_end: "2023-11-13",
    img_coll: ee.ImageCollection("NASA/VIIRS/002/VNP46A2"),
    AOI: AOI,
    scale_to_use: scale_to_use,
    threshold: threshold 
  });
  
  return(result);
};