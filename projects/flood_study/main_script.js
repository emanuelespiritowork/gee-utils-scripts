/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var AOI = ee.FeatureCollection("projects/ee-emanuelespiritowork/assets/brazos_river_basin"),
    geometry3 = 
    /* color: #d63000 */
    /* shown: false */
    ee.Geometry.Polygon(
        [[[-95.68549802278902, 29.509526285447432],
          [-95.68908257702583, 29.46758472102303],
          [-95.61403619475962, 29.472863508967293],
          [-95.61808511927094, 29.511625911371844]]]),
    geometry4 = 
    /* color: #d63000 */
    /* shown: false */
    ee.Geometry.Polygon(
        [[[-95.99334473924377, 29.61054349466859],
          [-95.9185003788922, 29.691400780868005],
          [-95.99986787156799, 29.747753550985834],
          [-96.09050507859924, 29.731059732629266],
          [-96.04793305711486, 29.627257335035313]]]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
//refers to https://www.sciencedirect.com/science/article/pii/S1569843222001911?via%3Dihub#b0245


/*****************************
 *        FUNCTIONS
 ***************************/
var s1_select = require("users/emanuelespiritowork/SharedRepo:functions/s1_select.js");
var s1_speckle = require("users/emanuelespiritowork/SharedRepo:functions/s1_speckle.js");
var plot_map = require("users/emanuelespiritowork/SharedRepo:functions/plot_map.js");
var mosaic_date = require("users/emanuelespiritowork/SharedRepo:functions/mosaic_date.js");
var plot_histogram = require("users/emanuelespiritowork/SharedRepo:functions/plot_histogram.js");
var s1_rad_terr_flatten = require("users/emanuelespiritowork/SharedRepo:functions/s1_rad_terr_flatten.js");

/*****************************
 *        PROJECT
 ***************************/
var surface_water = ee.Image("JRC/GSW1_4/GlobalSurfaceWater");
var s1_coll = ee.ImageCollection("COPERNICUS/S1_GRD");
var elevation = ee.Image("WWF/HydroSHEDS/03CONDEM");

var visualization = {
  bands: ['occurrence'],
  min: 0.0,
  max: 100.0,
  palette: ['ffffff', 'ffbbbb', '0000ff']
};

//Map.setCenter(59.414, 45.182, 6);

//Map.addLayer(surface_water, visualization, 'Occurrence', false);

//Map.addLayer(AOI.geometry());
//print(AOI);

var subset_scale = ee.Number(30);
var scale_to_use = ee.Number(10);

var selected = s1_select.s1_select(s1_coll, "SM", "VH", "DESCENDING", "H");//SM, descending

var subset_mosaic = mosaic_date.mosaic_date(selected,geometry3,"2016-05-17","2016-05-27",subset_scale);

var mosaic_before = mosaic_date.mosaic_date(selected,geometry4,"2016-05-17","2016-05-27",scale_to_use);
var mosaic_after = mosaic_date.mosaic_date(selected,geometry4,"2016-05-28","2016-05-31",scale_to_use);

//print(mosaic_before);
//print(mosaic_after);

//print(mosaic_before_houston);
//print(mosaic_after_houston);
//Map.addLayer(mosaic_before);
//Map.addLayer(mosaic_after);
//Map.addLayer(mosaic_before_houston);
//Map.addLayer(mosaic_after_houston);
//print("mosaic_before",mosaic_before);
//print("mosaic_after",mosaic_after);
//print(subset_mosaic);

var flatten_before = s1_rad_terr_flatten.s1_rad_terr_flatten(mosaic_before,30,undefined).first();
var flatten_after = s1_rad_terr_flatten.s1_rad_terr_flatten(mosaic_after,30,undefined).first();
var subset_flatten = s1_rad_terr_flatten.s1_rad_terr_flatten(subset_mosaic,30,undefined).first();

flatten_before = flatten_before.select("VH").updateMask(flatten_before.select("no_data_mask"));
flatten_after = flatten_after.select("VH").updateMask(flatten_after.select("no_data_mask"));
subset_flatten = subset_flatten.select("VH").updateMask(subset_flatten.select("no_data_mask"));

//print(flatten_before);
//print(flatten_after);

//Map.addLayer(flatten_before);
//Map.addLayer(flatten_after);
//Map.addLayer(subset_flatten);
//print(subset_flatten);


var subset_speckle = s1_speckle.s1_speckle(subset_flatten,subset_scale.multiply(5),"meters","circle").first();
var speckle_before = s1_speckle.s1_speckle(flatten_before,scale_to_use.multiply(5),"meters","circle").first();
var speckle_after = s1_speckle.s1_speckle(flatten_after,scale_to_use.multiply(5),"meters","circle").first();

//print(speckle_before);
//print(speckle_after);
//print(subset_speckle);
//print(speckle);

//var subset_null_var_1 = plot_map.plot_map(subset_speckle,2,subset_scale);
//var null_var_1_before = plot_map.plot_map(speckle_before,2,scale_to_use.multiply(5));
//var null_var_1_after = plot_map.plot_map(speckle_after,2,scale_to_use.multiply(5));

var subset_histogram = plot_histogram.plot_histogram(subset_speckle,geometry3,subset_scale.multiply(5),false);

//from the subset histogram I choose the threshold 

//see also Otsu 1979
var threshold = ee.Number(-22);

var threshold_mask_after = speckle_after.lt(threshold);
var threshold_mask_before = speckle_before.lt(threshold);

var low_reflectance_before = speckle_before.updateMask(threshold_mask_before);
var low_reflectance_after = speckle_after.updateMask(threshold_mask_after);

/**********************
 * FILTER THE BEFORE 
 **********************/

var before_filter = ee.Image(0).gt(low_reflectance_before).not().unmask(1);
var before_filtered = low_reflectance_after.updateMask(before_filter);
var null_var_1 = plot_map.plot_map(before_filtered,2,10);

/**********************
 * FILTER PERMANENT WATER 
 **********************/

//now I remove permanent water using JRC asset
var permanent_water_mask = surface_water.select("seasonality").unmask(0).lt(2);
var non_permanent_water = before_filtered.updateMask(permanent_water_mask);
var null_var_2 = plot_map.plot_map(non_permanent_water,2,10);

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
var null_var_3 = plot_map.plot_map(connected_water,2,10);

/**********************
 * REMOVE PIXEL WITH HIGH SLOPE
 **********************/
var slope = ee.Terrain.slope(elevation);
var max_degree = 2.862; //arctan(5/100);
var slope_mask = slope.lt(max_degree);
var plain_water = connected_water.updateMask(slope_mask);
var null_var_4 = plot_map.plot_map(plain_water,2,10);

/**********************
 * FLOOD SURFACE EXTENSION
 **********************/
var pixelArea = ee.Image.pixelArea();
var area = pixelArea.mask(plain_water.lt(0)).unmask(0).clip(geometry4);
var null_var_5 = plot_map.plot_map(area,2,10);
var flooded_area = area.reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: geometry4,
  scale: 10,
  bestEffort: true
}).getNumber("area");
print(flooded_area,"m^2");
print(flooded_area.divide(10000),"ha");
/**********************
 * AFFECTED POPULATION
 **********************/
var population = ee.ImageCollection("JRC/GHSL/P2023A/GHS_POP")
.filter(ee.Filter.eq("system:index","2015"))
.first();
var affected_population = population.multiply(plain_water.lt(0))
.unmask(0).clip(geometry4);
Map.addLayer(affected_population);
var sum_of_affected_population = affected_population.reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: geometry4,
  scale: scale_to_use
}).getNumber("population_count");
print("sum_of_affected_population",sum_of_affected_population);

//var null_var_1 = plot_map.plot_map(mosaic,2,scale_to_use);
//var null_var_2 = plot_map.plot_map(speckle,2,scale_to_use);

//var speckled = s1_speckle.s1_speckle(selected,);

//print(bounded.first());