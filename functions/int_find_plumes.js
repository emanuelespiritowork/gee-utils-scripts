
var clip_to = require("users/emanuelespiritowork/SharedRepo:functions/clip_to.js");
var s2_scale = require("users/emanuelespiritowork/SharedRepo:functions/s2_scale.js");
//var mosaic_recent = require("users/emanuelespiritowork/SharedRepo:functions/mosaic_recent.js");
//var plot_stretch = require("users/emanuelespiritowork/SharedRepo:functions/plot_stretch.js");
//var plot_map = require("users/emanuelespiritowork/SharedRepo:functions/plot_map.js");


exports.int_find_plumes = function(AOI, scale_to_use, aerosol_band, threshold){
  var s2_coll = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
  .filter(ee.Filter.lt("CLOUDY_PIXEL_PERCENTAGE",30));
  
  var clip = clip_to.clip_to(s2_coll, AOI2, scale_to_use);
}