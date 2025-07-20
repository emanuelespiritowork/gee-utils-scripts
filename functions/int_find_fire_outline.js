//second part: compute fire outline

exports.int_find_fire_outline = function(fire_point, start_date, end_date, buffer){
  fire_point = ee.Feature(fire_point);
  start_date = ee.Date(start_date);
  var true_end_date = ee.Date(end_date);
  
  var buffer_value = buffer || ee.Number(10000);
  
  var AOI = fire_point.buffer(buffer_value);
};