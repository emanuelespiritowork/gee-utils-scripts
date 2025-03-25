/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var Tinitaly_DTM = ee.ImageCollection("projects/ee-emanuelespiritowork/assets/Tinitaly_DTM");
/***** End of imports. If edited, may not auto-convert in the playground. *****/
/******************************************************
 * Author: Emanuele Spirito
 * Copyright: 2025
 * See latest stable version on my GitHub at 
 * https://github.com/emanuelespiritowork/gee-utils-scripts
*******************************************************/

/******************************************************
 * REQUIRES THE FOLLOWING FUNCTIONS:
 * mosaic_date
 * clip_to
 * mosaic_to
*******************************************************/

var mosaic_date = require("users/emanuelespiritowork/SharedRepo:functions/mosaic_date.js");
var mosaic_to = require("users/emanuelespiritowork/SharedRepo:functions/mosaic_to.js");
var clip_to = require("users/emanuelespiritowork/SharedRepo:functions/clip_to.js");

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
  
  //grass differs from trees because of height. We could use difference between the DSM and the DTM
  var global_dsm = ee.ImageCollection("COPERNICUS/DEM/GLO30");
  var give_time = function(image){
    return image.set({
      "system:time_start": ee.Date.fromYMD(2023,01,01).millis()
    });
  };
  var global_dtm = Tinitaly_DTM
  .map(give_time)
  .merge(ee.ImageCollection(ee.Image("UK/EA/ENGLAND_1M_TERRAIN/2022").select("dtm")));
  //at the moment there is not a global dtm but italy and uk provide a dtm of their country
  var check_intersection = global_dtm.filterBounds(AOI);
  
  var clip_dtm = ee.Image(ee.Algorithms.If({
    condition: ee.Number(check_intersection.size()).eq(ee.Number(0)),
    trueCase: ee.Image(0).mask(),
    falseCase: mosaic_to.mosaic_to(clip_to.clip_to(global_dtm,AOI,scale_to_use))
  }));
  Map.addLayer(clip_dtm,{},"clip_dtm");
  var clip_dsm = mosaic_to.mosaic_to(clip_to.clip_to(global_dsm,AOI,scale_to_use));
  Map.addLayer(clip_dsm,{},"clip_dsm");
  var dsm_delta_dtm = clip_dsm.subtract(clip_dtm);
  var tall_mask = dsm_delta_dtm.lt(10);
  Map.addLayer(tall_mask,{},"tall_mask");
  
/******************************************************
 * Fourth requirement: a prairie is wide
*******************************************************/
  
  var slope_elev_grass_mask = slope_mask.and(elevation_mask)
  .and(grass_mask).and(tall_mask);
  
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