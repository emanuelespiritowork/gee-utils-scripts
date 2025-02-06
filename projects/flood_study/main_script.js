/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var AOI = ee.FeatureCollection("projects/ee-emanuelespiritowork/assets/brazos_river_basin"),
    geometry = 
    /* color: #d63000 */
    /* shown: false */
    ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[-96.0737948544642, 30.041044322288684],
                  [-96.04564455529275, 30.09274781553181],
                  [-96.04633397262877, 30.243533550595362],
                  [-96.21388079279673, 30.220996684101458],
                  [-96.22212095589569, 30.04698863641669]]]),
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
    geometry3 = 
    /* color: #d63000 */
    /* shown: false */
    ee.Geometry.Polygon(
        [[[-96.70829092431222, 30.356104228882874],
          [-96.69113294807894, 30.257981642913844],
          [-96.50193493416265, 30.27103442205583],
          [-96.51155286574303, 30.355814008508503]]]);
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
var dataset = ee.Image('JRC/GSW1_4/GlobalSurfaceWater');
var s1_coll = ee.ImageCollection("COPERNICUS/S1_GRD");


var visualization = {
  bands: ['occurrence'],
  min: 0.0,
  max: 100.0,
  palette: ['ffffff', 'ffbbbb', '0000ff']
};

//Map.setCenter(59.414, 45.182, 6);

Map.addLayer(dataset, visualization, 'Occurrence', false);

//Map.addLayer(AOI.geometry());
//print(AOI);

var subset_scale = ee.Number(30);
var scale_to_use = ee.Number(10);

var selected = s1_select.s1_select(s1_coll, "IW", "VH", "ASCENDING", "H", true);

var subset_mosaic = mosaic_date.mosaic_date(selected,geometry3,"2020-01-01","2020-12-31",subset_scale);
var mosaic = mosaic_date.mosaic_date(selected,geometry,"2020-01-01","2020-12-31",scale_to_use);

//print(subset_mosaic);
//print(mosaic);
//Map.addLayer(mosaic);

var flatten = s1_rad_terr_flatten.s1_rad_terr_flatten(mosaic).first();
var subset_flatten = s1_rad_terr_flatten.s1_rad_terr_flatten(subset_mosaic).first();
flatten = flatten.select("VH").updateMask(flatten.select("no_data_mask"));
subset_flatten = subset_flatten.select("VH").updateMask(subset_flatten.select("no_data_mask"));

//print(flatten);
//print(subset_flatten);

var subset_speckle = s1_speckle.s1_speckle(subset_flatten,subset_scale.multiply(5),"meters","circle").first();
var speckle = s1_speckle.s1_speckle(flatten,scale_to_use.multiply(5),"meters","circle").first();

//print(subset_speckle);
//print(speckle);

//var subset_null_var_1 = plot_map.plot_map(subset_speckle,2,subset_scale);
//var null_var_1 = plot_map.plot_map(speckle,2,scale_to_use);

var subset_histogram = histogram_map.histogram_map(subset_speckle,geometry3,subset_scale,false);
var histogram = histogram_map.histogram_map(speckle,geometry,scale_to_use,false);

//from the subset histogram I choose the threshold. I should see
//at least a small peak in the complete histogram

//see also Otsu 1979


var threshold = ee.Number(-23.4);

var threshold_mask = speckle.lt(threshold);

var low_reflectance = speckle.updateMask(threshold_mask);

var null_var_3 = plot_map.plot_map(low_reflectance,2,scale_to_use);

//now to filter the data outside water I use a connected filter






//var null_var_1 = plot_map.plot_map(mosaic,2,scale_to_use);
//var null_var_2 = plot_map.plot_map(speckle,2,scale_to_use);

//var speckled = s1_speckle.s1_speckle(selected,);

//print(bounded.first());