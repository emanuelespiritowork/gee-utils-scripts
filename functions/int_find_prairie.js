var mosaic_recent = require("users/emanuelespiritowork/SharedRepo:functions/mosaic_recent.js");
exports.int_find_prairie = function(AOI, scale_to_use, min_wide, min_height, min_grass, max_slope){
  AOI = ee.FeatureCollection(AOI);
  scale_to_use = ee.Number(scale_to_use);
  
  var wide = min_wide || ee.Number(200);
  var height = min_height || ee.Number(300);
  var slope = max_slope || ee.Number(5);
  var grass = min_grass || ee.Number(0.2);
  
  var s2_coll = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED");
  var dem = ee.Image("CGIAR/SRTM90_V4").clip(AOI);
  
  var mosaic = mosaic_recent.mosaic_recent(s2_coll,AOI,scale_to_use);
  
  //a prairie has to be with small slope
  
  var dem_slope = ee.Terrain.slope(dem);
  var slope_mask = dem_slope.lt(slope);
  
  //a prairie has a great panorama 
  var elevation_mask = dem.gt(height);
  
  //a prairie has grass
  var ndvi = mosaic.normalizedDifference(["B8","B4"])
  .rename("ndvi");
  
  var grass_mask = ndvi.gt(grass);
  

};