/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var geometry = 
    /* color: #d63000 */
    /* shown: false */
    ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[10.15208922929799, 46.19137065600624],
                  [10.093724361133928, 46.15452010835391],
                  [10.10539733476674, 46.0912222645429],
                  [10.29765807695424, 46.15119045594832],
                  [10.298344722462053, 46.20681676316477]]]),
            {
              "system:index": "0"
            })]),
    geometry2 = 
    /* color: #98ff00 */
    /* shown: false */
    ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[10.145110922214249, 46.14038777780239],
                  [10.145282583591202, 46.13420238954559],
                  [10.156955557224014, 46.13336968806595],
                  [10.155410604831436, 46.13836570808439]]]),
            {
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[10.15701814195753, 46.15440330417068],
                  [10.157270269604929, 46.15409858924505],
                  [10.158026652547129, 46.15438844006712],
                  [10.157822804661997, 46.15465227730865]]]),
            {
              "system:index": "1"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[10.148544032995707, 46.15368102581842],
                  [10.148560126687727, 46.15354260492752],
                  [10.150217731421, 46.153623426638795],
                  [10.15022309583903, 46.15376463742357]]]),
            {
              "system:index": "2"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[10.178428214870934, 46.144819359665576],
                  [10.178610605083946, 46.14457034204558],
                  [10.180053633533959, 46.144982893012205],
                  [10.179914158665184, 46.14523562541057]]]),
            {
              "system:index": "3"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[10.164026623144569, 46.12840252928101],
                  [10.163608198538245, 46.127547433083635],
                  [10.163908605947913, 46.12763666113325],
                  [10.164638166799964, 46.12839509371911]]]),
            {
              "system:index": "4"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[10.190195670593138, 46.14162360131962],
                  [10.1896484999541, 46.140753842601384],
                  [10.190463891494627, 46.14077614427861],
                  [10.190753570068235, 46.141415455184685]]]),
            {
              "system:index": "5"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[10.165003873891374, 46.12090038213233],
                  [10.165046789235612, 46.1203500729048],
                  [10.166548826283952, 46.12058804513718],
                  [10.16661319930031, 46.121123478901985]]]),
            {
              "system:index": "6"
            })]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
/******************************************************
 * Author: Emanuele Spirito
 * Copyright: 2025
 * See latest stable version on my GitHub at 
 * https://github.com/emanuelespiritowork/gee-utils-scripts
*******************************************************/

var unsup_classification = require("users/emanuelespiritowork/SharedRepo:functions/unsup_classification.js");
var mosaic_recent = require("users/emanuelespiritowork/SharedRepo:functions/mosaic_recent.js");
var plot_stretch = require("users/emanuelespiritowork/SharedRepo:functions/plot_stretch.js");
var plot_map = require("users/emanuelespiritowork/SharedRepo:functions/plot_map.js");

var s2_coll = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
.filter(ee.Filter.lt("CLOUDY_PIXEL_PERCENTAGE",20));

var mosaic = mosaic_recent.mosaic_recent(s2_coll, geometry, 10);
var null_var = plot_stretch.plot_stretch(mosaic, ["B4","B3","B2"], 2, 10);

var unsup_bands = ["B8A","B12","B11"];
var unsup = unsup_classification.unsup_classification(mosaic.select(unsup_bands), geometry2, 3, 10);
var null_var_2 = plot_map.plot_map(unsup, 2, 10);
Map.addLayer(unsup, {min: 1, max: 3, palette: ["green","yellow","red"]},"unsup");
