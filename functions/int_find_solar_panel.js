var clip_to = require("users/emanuelespiritowork/SharedRepo:functions/clip_to.js");
var s2_scale = require("users/emanuelespiritowork/SharedRepo:functions/s2_scale.js");


exports.int_find_solar_panel = function(AOI, start_date, end_date, min_scale){
  AOI = ee.FeatureCollection(AOI);
  start_date = ee.Date(start_date);
  end_date = ee.Date(end_date);
  
  var scale_to_use = min_scale || ee.Number(10);
  
  var s2_coll = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
  .filterBounds(AOI)
  .filterDate(start_date,end_date);
  
  var clip = clip_to.clip_to(s2_coll,AOI,scale_to_use);
  
  var scale = s2_scale.s2_scale(clip);
  
  var max = scale.select("B1").reduce({
    reducer: ee.Reducer.max()
  });
  
  Map.addLayer(max);
  
  var mask = max.gt(1);
  
  return(mask);
};