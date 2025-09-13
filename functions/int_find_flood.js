//refers to https://www.sciencedirect.com/science/article/pii/S1569843222001911?via%3Dihub#b0245


/*****************************
 *        FUNCTIONS
 ***************************/
var s1_select = require("users/emanuelespiritowork/SharedRepo:functions/s1_select.js");
var s1_speckle = require("users/emanuelespiritowork/SharedRepo:functions/s1_speckle.js");
var plot_map = require("users/emanuelespiritowork/SharedRepo:functions/plot_map.js");
var mosaic_date = require("users/emanuelespiritowork/SharedRepo:functions/mosaic_date.js");
var get_plot_histogram = require("users/emanuelespiritowork/SharedRepo:functions/get_plot_histogram.js");
var s1_rad_terr_flatten = require("users/emanuelespiritowork/SharedRepo:functions/s1_rad_terr_flatten.js");
var s1_longest_series = require("users/emanuelespiritowork/SharedRepo:functions/s1_longest_series.js");
var clip_to = require("users/emanuelespiritowork/SharedRepo:functions/clip_to.js");

exports.int_find_flood = function(flood_date, AOI, min_scale, min_value){
  //mandatory inputs
  flood_date = ee.Date(flood_date);//"YYYY-MM-DD"
  AOI = ee.FeatureCollection(AOI);
  //optional inputs
  var scale_to_use = min_scale || ee.Number(10);
  var threshold = min_value || ee.Number(-22);//see also Otsu 1979
  
  var ten_days_before_flood_date = flood_date.advance(-10,"day");
  var one_day_before_flood_date = flood_date.advance(-1,"day");
  var ten_days_after_flood_date = flood_date.advance(10,"day");
  var one_day_after_flood_date = flood_date.advance(0,"day");
  
  var s1_series_before = s1_longest_series.s1_longest_series(ten_days_before_flood_date,one_day_before_flood_date,AOI);
  var s1_series_after = s1_longest_series.s1_longest_series(one_day_after_flood_date,ten_days_after_flood_date,AOI);
  
  return(int_find_flood_any.int_find_flood_any(s1_series_before,s1_series_after,flood_date, AOI, min_scale, min_value))
};