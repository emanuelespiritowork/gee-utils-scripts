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
            })]),
    geometry2 = 
    /* color: #98ff00 */
    /* shown: false */
    ee.Geometry.MultiPolygon(
        [[[[-99.00635160605253, 32.862273453268706],
           [-99.10248197714628, 32.790725562596045],
           [-99.00772489706816, 32.707565403127354],
           [-98.91571439902128, 32.79822925530258]]],
         [[[-98.37164393841731, 30.789609608937983],
           [-98.33456508099543, 30.82735353746729],
           [-98.41421595990168, 30.948741050641114],
           [-98.53781215130793, 30.891012778217707],
           [-98.43344203412043, 30.71525794540285]]],
         [[[-97.51930694160397, 31.01213600337887],
           [-97.5261733966821, 31.05096876763615],
           [-97.67174224433835, 31.021551460735513],
           [-97.66762237129147, 30.988593290634626]]],
         [[[-98.42721477630423, 32.00657896668095],
           [-98.50137249114798, 32.06711468814616],
           [-98.58651653411673, 32.00424987056985],
           [-98.50961223724173, 31.943672608802554]]]]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
/*****************************
 *        FUNCTIONS
 ***************************/
var s1_select = require("users/emanuelespiritowork/SharedRepo:functions/s1_select.js");
var s1_speckle = require("users/emanuelespiritowork/SharedRepo:functions/s1_speckle.js");
var plot_map = require("users/emanuelespiritowork/SharedRepo:functions/plot_map.js");
var mosaic_date = require("users/emanuelespiritowork/SharedRepo:functions/mosaic_date.js");
var histogram_map = require("users/emanuelespiritowork/SharedRepo:functions/histogram_map.js");

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

//Map.addLayer(AOI.geometry());
//print(AOI);

var subset_scale = ee.Number(50);
var scale_to_use = ee.Number(200);

var selected = s1_select.s1_select(s1_coll, "IW", "VH", "ASCENDING", "H", false);

var subset_mosaic = mosaic_date.mosaic_date(selected,geometry2,"2020-01-01","2020-12-31",subset_scale);
var mosaic = mosaic_date.mosaic_date(selected,geometry,"2020-01-01","2020-12-31",scale_to_use);

var subset_speckle = s1_speckle.s1_speckle(subset_mosaic,5*subset_scale,"meters","circle").first();
var speckle = s1_speckle.s1_speckle(mosaic,5*scale_to_use,"meters","circle").first();

//var subset_null_var_1 = plot_map.plot_map(subset_speckle,2,subset_scale);
//var null_var_1 = plot_map.plot_map(speckle,2,scale_to_use);

var subset_histogram = histogram_map.histogram_map(subset_speckle,geometry2,subset_scale,false);
var histogram = histogram_map.histogram_map(speckle,geometry,scale_to_use,false);

print(subset_histogram);
print(histogram);

//from the subset histogram I choose the threshold. I should see
//at least a small peak in the complete histogram

//see also Otsu 1979

var threshold = ee.Number(-26);

var threshold_mask = speckle.lt(threshold);

var low_reflectance = speckle.updateMask(threshold_mask);

var null_var_3 = plot_map.plot_map(low_reflectance,2,scale_to_use);


//var null_var_1 = plot_map.plot_map(mosaic,2,scale_to_use);
//var null_var_2 = plot_map.plot_map(speckle,2,scale_to_use);

//var speckled = s1_speckle.s1_speckle(selected,);

//print(bounded.first());