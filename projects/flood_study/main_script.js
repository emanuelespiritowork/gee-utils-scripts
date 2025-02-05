/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var geometry = 
    /* color: #d63000 */
    /* shown: false */
    ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[-93.55869988676085, 29.675437148892513],
                  [-93.75645379301085, 33.07016901516024],
                  [-98.96397332426085, 33.84010956990459],
                  [-101.77647332426085, 32.237692894835845],
                  [-96.41514519926085, 28.5042095078147]]]),
            {
              "system:index": "0"
            })]),
    AOI = ee.FeatureCollection("projects/ee-emanuelespiritowork/assets/brazos_river");
/***** End of imports. If edited, may not auto-convert in the playground. *****/
/*****************************
 *        FUNCTIONS
 ***************************/
var s1_select = require("users/emanuelespiritowork/SharedRepo:functions/s1_select.js");
var s1_speckle = require("users/emanuelespiritowork/SharedRepo:functions/s1_speckle.js");
var plot_map = require("users/emanuelespiritowork/SharedRepo:functions/plot_map.js");
var mosaic_date = require("users/emanuelespiritowork/SharedRepo:functions/mosaic_date.js");

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

Map.addLayer(dataset, visualization, 'Occurrence');

//Map.addLayer(AOI);

var selected = s1_select.s1_select(s1_coll, "IW", "VH", "ASCENDING", "H", false);

var mosaic = mosaic_date.mosaic_date(selected,geometry,"2020-01-01","2020-12-31",300);

var speckle = s1_speckle.s1_speckle(mosaic,50,"meter","circle").first();

var null_var_1 = plot_map.plot_map(mosaic,2,300);
var null_var_2 = plot_map.plot_map(speckle,2,300);

//var speckled = s1_speckle.s1_speckle(selected,);

//print(bounded.first());