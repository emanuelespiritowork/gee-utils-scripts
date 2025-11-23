var clip_to = require("users/emanuelespiritowork/SharedRepo:functions/clip_to.js");

exports.int_find_city_any = function(img_coll, start_date, end_date, AOI, scale_to_use, threshold){
  //mandatory inputs
  start_date = ee.Date(start_date);//"YYYY-MM-DD"
  end_date = ee.Date(end_date);//"YYYY-MM-DD"
  AOI = ee.FeatureCollection(AOI);
  scale_to_use = ee.Number(scale_to_use);
  threshold = ee.Number(threshold);
  
  var result = int_find_city_any.int_find_city_any({
    img_coll: ee.ImageCollection("NASA/VIIRS/002/VNP46A2"),
    start_date: start_date,
    end_date: end_date,
    AOI: AOI,
    scale_to_use: scale_to_use,
    threshold: threshold 
  });
  
  return(result);
};