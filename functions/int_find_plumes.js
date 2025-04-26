
var clip_to = require("users/emanuelespiritowork/SharedRepo:functions/clip_to.js");
var s2_scale = require("users/emanuelespiritowork/SharedRepo:functions/s2_scale.js");
var int_find_plumes_any = require("users/emanuelespiritowork/SharedRepo:functions/int_find_plumes_any.js");
//var mosaic_recent = require("users/emanuelespiritowork/SharedRepo:functions/mosaic_recent.js");
//var plot_stretch = require("users/emanuelespiritowork/SharedRepo:functions/plot_stretch.js");
//var plot_map = require("users/emanuelespiritowork/SharedRepo:functions/plot_map.js");


exports.int_find_plumes = function(AOI, min_scale, min_value, band){
  /******************************************************
  * Mandatory inputs
  *******************************************************/
  AOI = ee.FeatureCollection(AOI);
  /******************************************************
  * Optional inputs
  *******************************************************/
  scale_to_use = min_scale || ee.Number(10);
  threshold = min_value || ee.Number(0.2);
  aerosol_band = band || ee.String("B1");
  
  
  var s2_coll = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
  .filter(ee.Filter.lt("CLOUDY_PIXEL_PERCENTAGE",30));
  
  var clip = clip_to.clip_to(s2_coll, AOI, scale_to_use);
  
  var scale = s2_scale.s2_scale(clip);
  
  return int_find_plumes_any.int_find_plumes_any(scale, AOI, scale_to_use, aerosol_band, threshold);
}