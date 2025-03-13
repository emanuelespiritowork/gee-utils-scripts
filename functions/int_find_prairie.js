/******************************************************
 * Author: Emanuele Spirito
 * Copyright: 2025
 * See latest stable version on my GitHub at 
 * https://github.com/emanuelespiritowork/gee-utils-scripts
*******************************************************/

/******************************************************
 * REQUIRES THE FOLLOWING FUNCTIONS:
 * mosaic_date
*******************************************************/

var mosaic_date = require("users/emanuelespiritowork/SharedRepo:functions/mosaic_date.js");

/******************************************************
 * PURPOSE OF THIS SCRIPT
 * Input: ee.FeatureCollection
 * Output: ee.Image
 * Description: find prairies in the AOI using Sentinel-2 collection
*******************************************************/

exports.int_find_prairie = function(AOI, min_scale, min_wide, min_height, min_grass, max_slope, min_compactness){
/******************************************************
 * Check variable types
*******************************************************/
  AOI = ee.FeatureCollection(AOI);

  var scale_to_use = min_scale || ee.Number(10);
  var wide = min_wide || ee.Number(200);
  var height = min_height || ee.Number(300);
  var slope = max_slope || ee.Number(5);
  var grass = min_grass || ee.Number(0.2);
  var compactness = min_compactness || ee.Number(28);

/******************************************************
 * Take the image collections
*******************************************************/  
  var s2_coll = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED");
  var dem = ee.Image("CGIAR/SRTM90_V4").clip(AOI.geometry());

/******************************************************
 * First requirement: a prairie has a small slope
*******************************************************/
  
  var dem_slope = ee.Terrain.slope(dem);
  var slope_mask = dem_slope.lt(slope);

  Map.addLayer(slope_mask);
  
/******************************************************
 * Second requirement: a prairie has a great panorama 
*******************************************************/

  var elevation_mask = dem.gt(height);
  
  Map.addLayer(elevation_mask);
/******************************************************
 * Third requirement: a prairie has grass. We need to use not clouded s2_coll
*******************************************************/

  var latest_date = ee.Date(s2_coll.filterBounds(AOI)
  .sort("system:time_start",false)
  .first()
  .get("system:time_start"));
  
  var start_date = latest_date.advance({
    delta: -3,
    unit: "month"
  });
  
  var sort = s2_coll.filterDate(start_date.format('YYYY-MM-dd'),latest_date.format('YYYY-MM-dd'))
  .filter(ee.Filter.lt("CLOUDY_PIXEL_PERCENTAGE",10));
  
  var mosaic = mosaic_date.mosaic_date(sort,AOI,start_date,latest_date,scale_to_use);
  
  var ndvi = mosaic.normalizedDifference(["B8","B4"])
  .rename("ndvi");
  
  Map.addLayer(mosaic);
  
  var grass_mask = ndvi.gt(grass);
  
  //Map.addLayer(grass_mask);
/******************************************************
 * Fourth requirement: a prairie is wide
*******************************************************/
  
  var slope_elev_grass_mask = slope_mask.and(elevation_mask)
  .and(grass_mask);
  
  var compact_circle = ee.Kernel.circle({
    radius: scale_to_use.divide(10).multiply(3),
    units: "pixels",
    normalize: false
  });
  
  var max_circle = ee.Kernel.circle({
    radius: scale_to_use.divide(10).multiply(2),
    units: "pixels",
    normalize: false
  });
  
  var compact = slope_elev_grass_mask.reduceNeighborhood({
    reducer: ee.Reducer.sum(),
    kernel: compact_circle
  })
  .gt(compactness)
  .rename("compact");
  
  var max = slope_elev_grass_mask.reduceNeighborhood({
    reducer: ee.Reducer.max(),
    kernel: max_circle
  }).rename("over_threshold");
  
  var vector = max.reduceToVectors({
    scale: scale_to_use,
    bestEffort: true,
    reducer: null
  })
  .filter(ee.Filter.gt("label",0));
  
  //print(vector);
  
  var compact_vector = compact.reduceRegions({
    collection: vector,
    reducer: ee.Reducer.max(),
    scale: scale_to_use
  })
  .filter(ee.Filter.gt("max",0));
  
  //print(compact_vector);
  
  var wide_vector = compact_vector.filter(ee.Filter.gt("count",wide));
  
  return wide_vector;
};