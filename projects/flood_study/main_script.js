/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var AOI = ee.FeatureCollection("projects/ee-emanuelespiritowork/assets/brazos_river_basin"),
    geometry = 
    /* color: #d63000 */
    /* shown: false */
    ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[-95.25779484400184, 28.90365305399671],
                  [-95.43357609400184, 29.63201811739143],
                  [-95.74119328150184, 29.860945508501302],
                  [-95.96091984400184, 31.4111364833597],
                  [-96.26853703150184, 31.74807403454215],
                  [-97.98240421900184, 33.157149242352794],
                  [-99.16892765650184, 33.81685813714122],
                  [-100.48728703150184, 33.74380562272459],
                  [-101.54197453150184, 34.399028601584],
                  [-103.16795109400184, 34.833018632465254],
                  [-103.08006046900184, 33.52427469862098],
                  [-101.89353703150184, 32.86233728546707],
                  [-101.19041203150184, 32.714562319414554],
                  [-100.66306828150184, 32.12101604449994],
                  [-99.25681828150184, 32.04654876186368],
                  [-98.42185734400184, 30.69584507373936],
                  [-95.60935734400184, 28.788175305717893]]]),
            {
              "system:index": "0"
            })]);
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

//Map.addLayer(dataset, visualization, 'Occurrence');

Map.addLayer(AOI.geometry());
print(AOI);

var scale_to_use = ee.Number(50);

var selected = s1_select.s1_select(s1_coll, "IW", "VH", "ASCENDING", "H", false);

var mosaic = mosaic_date.mosaic_date(selected,geometry,"2020-01-01","2020-12-31",scale_to_use);

var speckle = s1_speckle.s1_speckle(mosaic,5*scale_to_use,"meters","circle").first();

var null_var = plot_map.plot_map(speckle,2,scale_to_use);


//var null_var_1 = plot_map.plot_map(mosaic,2,scale_to_use);
//var null_var_2 = plot_map.plot_map(speckle,2,scale_to_use);

//var speckled = s1_speckle.s1_speckle(selected,);

//print(bounded.first());