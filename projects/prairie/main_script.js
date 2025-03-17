/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var AOI = 
    /* color: #d63000 */
    /* shown: false */
    ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[9.913613397802505, 46.2035982890461],
                  [9.922539789404068, 46.02700655643601],
                  [10.506188471044693, 46.02128524622097],
                  [10.405251581396255, 46.29239365527874]]]),
            {
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[8.307827362501055, 46.3561104257775],
                  [8.140972504102617, 46.26267140205124],
                  [8.195217499219805, 46.198547469778774],
                  [8.41357077070418, 46.196646358632066],
                  [8.521374115430742, 46.29446805619842]]]),
            {
              "system:index": "1"
            })]),
    image = ee.Image("projects/ee-emanuelespiritowork/assets/Italia_tinitaly"),
    image2 = ee.Image("projects/ee-emanuelespiritowork/assets/DTM/DSM_w51060_s10"),
    image3 = ee.Image("projects/ee-emanuelespiritowork/assets/w39580_s10");
/***** End of imports. If edited, may not auto-convert in the playground. *****/
var int_find_prairie = require("users/emanuelespiritowork/SharedRepo:functions/int_find_prairie.js");
//var wide_vector = int_find_prairie.int_find_prairie(AOI);
Map.centerObject(AOI);
var dsm = ee.ImageCollection("JAXA/ALOS/AW3D30/V3_2")
.filterBounds(AOI);
Map.addLayer(dsm);
Map.addLayer(image3);

  //Map.addLayer(grass_mask);
/*
var s2_coll = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED");
var dem = ee.Image("CGIAR/SRTM90_V4").clip(AOI.geometry()));

var clip_to = require("users/emanuelespiritowork/SharedRepo:functions/clip_to.js");
var mosaic_recent = require("users/emanuelespiritowork/SharedRepo:functions/mosaic_recent.js");
var plot_stretch = require("users/emanuelespiritowork/SharedRepo:functions/plot_stretch.js");
var s2_ndvi = require("users/emanuelespiritowork/SharedRepo:functions/s2_ndvi.js");

//var dem_clip = clip_to.clip_to(ee.ImageCollection(dem),AOI,10);
var mosaic = mosaic_recent.mosaic_recent(s2_coll,AOI,10);
//var null_var = plot_stretch.plot_stretch(mosaic,undefined,2,10);

//Map.addLayer(dem);


//Map.addLayer(mosaic);

//a prairie has to be with small slope
var slope = ee.Terrain.slope(dem);

//Map.addLayer(slope);

var slope_mask = slope.lt(5);
//Map.addLayer(slope_mask);

//a prairie has a great elevation
var elevation_mask = dem.gt(300);
//Map.addLayer(elevation_mask);

//a prairie has grass
var ndvi = mosaic.normalizedDifference(["B8","B4"])
.rename("ndvi");

//Map.addLayer(ndvi);

var grass_mask = ndvi.gt(0.2);
//Map.addLayer(grass_mask);

//a prairie is wide: create a compact layer
var slope_elev_grass_mask = slope_mask.and(elevation_mask)
.and(grass_mask);

var compact_circle = ee.Kernel.circle({
  radius: 3,
  units: "pixels",
  normalize: false
});

var max_circle = ee.Kernel.circle({
  radius: 2,
  units: "pixels",
  normalize: false
});

var compact = slope_elev_grass_mask
.reduceNeighborhood({
  reducer: ee.Reducer.sum(),
  kernel: compact_circle,
})
.gt(28)
.rename("compact");

//Map.addLayer(compact);

var max = slope_elev_grass_mask
.reduceNeighborhood({
  reducer: ee.Reducer.max(),
  kernel: max_circle
}).rename("over_threshold");

//Map.addLayer(max);

var vector = max.reduceToVectors({
  scale: 10,
  bestEffort: true,
  reducer: null
})
.filter(ee.Filter.gt("label",0));

var compact_vector = compact.reduceRegions({
  collection: vector,
  reducer: ee.Reducer.max(),
  scale: 10
})
.filter(ee.Filter.gt("max",0));

var wide_vector = compact_vector.filter(ee.Filter.gt("count",200));
*/
//print(wide_vector);
//Map.addLayer(wide_vector);




