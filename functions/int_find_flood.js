var s1_longest_series = require("users/emanuelespiritowork/SharedRepo:functions/s1_longest_series.js");

exports.int_find_flood = function(start_date, last_date, AOI, min_scale, min_value, connectedness, radius){
  //mandatory inputs
  start_date = ee.Date(start_date);//"YYYY-MM-DD"
  last_date = ee.Date(last_date);//"YYYY-MM-DD"
  AOI = ee.FeatureCollection(AOI);
  //optional inputs
  var scale_to_use = min_scale || ee.Number(10);
  var threshold = min_value || ee.Number(-16);
  
  var s1_series = s1_longest_series.s1_longest_series(start_date,last_date,AOI);
  
  return int_find_ships_any.int_find_ships_any(s1_series,AOI,
  scale_to_use, threshold, compactness, size);
};