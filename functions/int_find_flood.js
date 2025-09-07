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

exports.int_find_flood = function(flood_date, AOI, min_scale, min_value){
  //mandatory inputs
  flood_date = ee.Date(flood_date);//"YYYY-MM-DD"
  AOI = ee.FeatureCollection(AOI);
  //optional inputs
  var scale_to_use = min_scale || ee.Number(10);
  var threshold = min_value || ee.Number(-16);
  
  var ten_days_before_flood_date = flood_date.advance(-10,"day");
  var one_day_before_flood_date = flood_date.advance(-1,"day");
  var ten_days_after_flood_date = flood_date.advance(10,"day");
  var one_day_after_flood_date = flood_date.advance(0,"day");
  
  print(ten_days_before_flood_date);
  print(one_day_before_flood_date);
  print(ten_days_after_flood_date);
  print(one_day_after_flood_date);
  var s1_series_before = s1_longest_series.s1_longest_series(ten_days_before_flood_date,one_day_before_flood_date,AOI);
  var s1_series_after = s1_longest_series.s1_longest_series(one_day_after_flood_date,ten_days_after_flood_date,AOI);
  
  
  var surface_water = ee.Image("JRC/GSW1_4/GlobalSurfaceWater");
  var elevation = ee.Image("WWF/HydroSHEDS/03CONDEM");
  
  var visualization = {
    bands: ['occurrence'],
    min: 0.0,
    max: 100.0,
    palette: ['ffffff', 'ffbbbb', '0000ff']
  };
  
  
  var mosaic_before = mosaic_date.mosaic_date(s1_series_before,AOI,ten_days_before_flood_date,one_day_before_flood_date,scale_to_use);
  var mosaic_after = mosaic_date.mosaic_date(s1_series_after,AOI,one_day_after_flood_date,ten_days_after_flood_date,scale_to_use);

  Map.addLayer(mosaic_before,{},"mosaic_before");
  Map.addLayer(mosaic_after,{},"mosaic_after");

  var flatten_before = s1_rad_terr_flatten.s1_rad_terr_flatten(mosaic_before,scale_to_use,undefined).first();
  var flatten_after = s1_rad_terr_flatten.s1_rad_terr_flatten(mosaic_after,scale_to_use,undefined).first();
  
  Map.addLayer(flatten_before);
  Map.addLayer(flatten_after);
  
  /*
  print(flatten_before);
  */
  //TO CONTINUE

};