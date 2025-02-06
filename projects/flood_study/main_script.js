/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var AOI = ee.FeatureCollection("projects/ee-emanuelespiritowork/assets/brazos_river_basin"),
    geometry = 
    /* color: #d63000 */
    /* shown: false */
    ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[-96.10400725680795, 30.05768630223045],
                  [-96.11018923302713, 30.10225289326337],
                  [-96.1191183964569, 30.167576194036062],
                  [-96.20289446467173, 30.158084263320347],
                  [-96.19190855355194, 30.064818152018713]]]),
            {
              "system:index": "0"
            })]),
    geometry2 = 
    /* color: #98ff00 */
    /* shown: false */
    ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[-99.00635160605253, 32.862273453268706],
                  [-99.10248197714628, 32.790725562596045],
                  [-99.00772489706816, 32.707565403127354],
                  [-98.91571439902128, 32.79822925530258]]]),
            {
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-98.37164393841731, 30.789609608937983],
                  [-98.33456508099543, 30.82735353746729],
                  [-98.41421595990168, 30.948741050641114],
                  [-98.53781215130793, 30.891012778217707],
                  [-98.43344203412043, 30.71525794540285]]]),
            {
              "system:index": "1"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-97.51930694160397, 31.01213600337887],
                  [-97.5261733966821, 31.05096876763615],
                  [-97.67174224433835, 31.021551460735513],
                  [-97.66762237129147, 30.988593290634626]]]),
            {
              "system:index": "2"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-98.42721477630423, 32.00657896668095],
                  [-98.50137249114798, 32.06711468814616],
                  [-98.58651653411673, 32.00424987056985],
                  [-98.50961223724173, 31.943672608802554]]]),
            {
              "system:index": "3"
            })]),
    geometry3 = /* color: #d63000 */ee.Geometry.Polygon(
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
/*****************************
 *        FUNCTIONS
 ***************************/
var s1_select = require("users/emanuelespiritowork/SharedRepo:functions/s1_select.js");
var s1_speckle = require("users/emanuelespiritowork/SharedRepo:functions/s1_speckle.js");
var plot_map = require("users/emanuelespiritowork/SharedRepo:functions/plot_map.js");
var mosaic_date = require("users/emanuelespiritowork/SharedRepo:functions/mosaic_date.js");
var histogram_map = require("users/emanuelespiritowork/SharedRepo:functions/histogram_map.js");
var s1_rad_terr_flatten = require("users/emanuelespiritowork/SharedRepo:functions/s1_rad_terr_flatten.js");

/*****************************
 *        PROJECT
 ***************************/
var surface_water = ee.Image("JRC/GSW1_4/GlobalSurfaceWater");
var s1_coll = ee.ImageCollection("COPERNICUS/S1_GRD");


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

var selected = s1_select.s1_select(s1_coll, "SM", "VH", "DESCENDING", "H", true);
var sm_selected = s1_select.s1_select(s1_coll, "SM", "VH", "DESCENDING", "H", true);

var subset_mosaic = mosaic_date.mosaic_date(selected,geometry3,"2016-05-17","2016-05-27",subset_scale);

var mosaic_before = mosaic_date.mosaic_date(sm_selected,geometry4,"2016-05-17","2016-05-27",scale_to_use);
var mosaic_after = mosaic_date.mosaic_date(sm_selected,geometry4,"2016-05-28","2016-05-31",scale_to_use);



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

var subset_histogram = histogram_map.histogram_map(subset_speckle,geometry3,subset_scale.multiply(5),false);
//var histogram = histogram_map.histogram_map(speckle,geometry,scale_to_use,false);

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

/**********************
 * FILTER PERMANENT WATER 
 **********************/
//now I remove permanent water using JRC asset
var permanent_water_mask = surface_water.select("seasonality").unmask(0).lt(2);
var non_permanent_water = before_filtered.updateMask(permanent_water_mask);
Map.addLayer(non_permanent_water);

/**********************
 * FILTER UNCONNECTED PIXELS 
 **********************/
var connectedPixels = non_permanent_water.toInt().connectedPixelCount({
  maxSize: 9,
  eightConnected: true
});
var unconnected_mask = connectedPixels.gte(7);
var connected = non_permanent_water.updateMask(unconnected_mask);
Map.addLayer(connected);









//var null_var_1 = plot_map.plot_map(mosaic,2,scale_to_use);
//var null_var_2 = plot_map.plot_map(speckle,2,scale_to_use);

//var speckled = s1_speckle.s1_speckle(selected,);

//print(bounded.first());