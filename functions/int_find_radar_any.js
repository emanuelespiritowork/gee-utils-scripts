
var clip_to = require("users/emanuelespiritowork/SharedRepo:functions/clip_to.js");

exports.int_find_radar_any = function(img_coll, AOI, min_value, min_scale){
  AOI = ee.FeatureCollection(AOI);
  img_coll = ee.ImageCollection(img_coll);
  
  var threshold = min_value || ee.Number(0);
  var scale_to_use = min_scale || ee.Number(10);
  
  
};