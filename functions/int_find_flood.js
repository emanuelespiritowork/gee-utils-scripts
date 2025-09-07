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
  var threshold = min_value || ee.Number(-22);//see also Otsu 1979
  
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

  var flatten_before = s1_rad_terr_flatten.s1_rad_terr_flatten(mosaic_before,scale_to_use,undefined).first();
  var flatten_after = s1_rad_terr_flatten.s1_rad_terr_flatten(mosaic_after,scale_to_use,undefined).first();
  
  Map.addLayer(flatten_before,{},'flatten_before');
  Map.addLayer(flatten_after,{},'flatten_after');
  
  var speckle_before = s1_speckle.s1_speckle(flatten_before,scale_to_use.multiply(5),"meters","circle").first();
  var speckle_after = s1_speckle.s1_speckle(flatten_after,scale_to_use.multiply(5),"meters","circle").first();
  
  var threshold_mask_after = speckle_after.lt(threshold);
  var threshold_mask_before = speckle_before.lt(threshold);

  var low_reflectance_before = speckle_before.updateMask(threshold_mask_before);
  var low_reflectance_after = speckle_after.updateMask(threshold_mask_after);

  Map.addLayer(low_reflectance_before,{},'low_reflectance_before');
  Map.addLayer(low_reflectance_after,{},'low_reflectance_after');
  
  /**********************
   * FILTER THE BEFORE 
   **********************/
  var before_filter = ee.Image(0).gt(low_reflectance_before).not().unmask(1);
  var before_filtered = low_reflectance_after.updateMask(before_filter);
  //var null_var_1 = plot_map.plot_map(before_filtered,2,10);
  
  /**********************
   * FILTER PERMANENT WATER 
   **********************/
  //now I remove permanent water using JRC asset
  var permanent_water_mask = surface_water.select("seasonality").unmask(0).lt(2);
  var non_permanent_water = before_filtered.updateMask(permanent_water_mask);
  //var null_var_2 = plot_map.plot_map(non_permanent_water,2,10);
  
  /**********************
   * FILTER UNCONNECTED PIXELS 
 **********************/
  // connectedPixelCount is Zoom dependent, so visual result will vary
  //as found in https://courses.spatialthoughts.com/gee-water-resources-management.html
  var connectedPixels = non_permanent_water.toInt().connectedPixelCount({
    maxSize: 100,
    eightConnected: true
  });
  var unconnected_mask = connectedPixels.gte(25);
  var connected_water = non_permanent_water.updateMask(unconnected_mask);
  //var null_var_3 = plot_map.plot_map(connected_water,2,10);
  
  /**********************
  * REMOVE PIXEL WITH HIGH SLOPE
  **********************/
  var slope = ee.Terrain.slope(elevation);
  var max_degree = 2.862; //arctan(5/100);
  var slope_mask = slope.lt(max_degree);
  var plain_water = connected_water.updateMask(slope_mask);
  //var null_var_4 = plot_map.plot_map(plain_water,2,10);

  var flood_area = plain_water.select('[^n].*').lt(0);
  Map.addLayer(plain_water,{},'plain_water');
  
  return flood_area;
  
//TO CONTINUE

};