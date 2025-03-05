/******************************************************
 * Author: Emanuele Spirito
 * Copyright: 2025
 * See latest stable version on my GitHub at 
 * https://github.com/emanuelespiritowork/gee-utils-scripts
*******************************************************/

/******************************************************
 * REQUIRES THE FOLLOWING FUNCTIONS:
 * mosaic_recent
*******************************************************/

var mosaic_recent = require("users/emanuelespiritowork/SharedRepo:functions/mosaic_recent.js");

/******************************************************
 * PURPOSE OF THIS SCRIPT
 * Input: ee.FeatureCollection
 * Output: ee.Image
 * Description: find prairies in the AOI using Sentinel-2 collection
*******************************************************/

exports.int_find_prairie = function(AOI, min_scale, min_wide, min_height, min_grass, max_slope, min_compactness){
  AOI = ee.FeatureCollection(AOI);
  
  var scale_to_use = min_scale || ee.Number(10);
  
  var wide = min_wide || ee.Number(200);
  var height = min_height || ee.Number(300);
  var slope = max_slope || ee.Number(5);
  var grass = min_grass || ee.Number(0.2);
  var compactness = min_compactness || ee.Number(28);
  //print(scale_to_use,wide,height,slope,grass,compactness);
  
  var s2_coll = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED");
  var dem = ee.Image("CGIAR/SRTM90_V4").clip(AOI.geometry());
  
  //a prairie has to be with small slope
  
  var dem_slope = ee.Terrain.slope(dem);
  var slope_mask = dem_slope.lt(slope);
  
  //a prairie has a great panorama 
  var elevation_mask = dem.gt(height);
  
  //a prairie has grass
  var mosaic = mosaic_recent.mosaic_recent(s2_coll,AOI,scale_to_use);
  
  var ndvi = mosaic.normalizedDifference(["B8","B4"])
  .rename("ndvi");
  
  var grass_mask = ndvi.gt(grass);
  
  //a prairie is wide: create a compact layer
  var slope_elev_grass_mask = slope_mask.and(elevation_mask)
  .and(grass_mask);
  
  //Map.addLayer(slope_elev_grass_mask,undefined,"slope_elev_grass_mask");
  
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
  
  //Map.addLayer(compact,undefined,"compact");
  
  var max = slope_elev_grass_mask.reduceNeighborhood({
    reducer: ee.Reducer.max(),
    kernel: max_circle
  }).rename("over_threshold");
  
  //Map.addLayer(max,undefined,"max");
  
  var vector = max.reduceToVectors({
    scale: scale_to_use,
    bestEffort: true,
    reducer: null
  })
  .filter(ee.Filter.gt("label",0));
  
  //Map.addLayer(vector);
  //print(vector);
  
  var compact_vector = compact.reduceRegions({
    collection: vector,
    reducer: ee.Reducer.max(),
    scale: scale_to_use
  })
  .filter(ee.Filter.gt("max",0));
  
  //Map.addLayer(compact_vector);
  //print(compact_vector);
  
  var wide_vector = compact_vector.filter(ee.Filter.gt("count",wide));
  
  //Map.addLayer(wide_vector);
  //print(wide_vector);
  
  return wide_vector;
};