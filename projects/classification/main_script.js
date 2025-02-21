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
    geometry2 = /* color: #98ff00 */ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[10.145110922214249, 46.14038777780239],
                  [10.145282583591202, 46.13420238954559],
                  [10.149402456638077, 46.13384551902458],
                  [10.148887472507218, 46.13943622483238]]]),
            {
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[10.142521492539686, 46.13097461881545],
                  [10.142521492539686, 46.129309105657896],
                  [10.145439735947889, 46.12907117109557],
                  [10.145611397324842, 46.1302608336291]]]),
            {
              "system:index": "1"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[10.124749300749224, 46.15374111290166],
                  [10.12560760763399, 46.15088709706122],
                  [10.134019015104693, 46.151600614896374],
                  [10.13333236959688, 46.15421676781947]]]),
            {
              "system:index": "2"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[10.156831310332999, 46.151582481120144],
                  [10.156659648956046, 46.14991759123387],
                  [10.159234569610343, 46.15015543572953],
                  [10.159921215118155, 46.151463562084125]]]),
            {
              "system:index": "3"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[10.171087247240077, 46.15639071066645],
                  [10.171688062059413, 46.15594480191704],
                  [10.173318845140468, 46.15671770811956],
                  [10.172718030321132, 46.15725279066966]]]),
            {
              "system:index": "4"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[10.158727628099452, 46.15558807231598],
                  [10.15928552757455, 46.15404221732237],
                  [10.16452119957162, 46.156331256375296],
                  [10.16353414665414, 46.15677716199318]]]),
            {
              "system:index": "5"
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
var plot_class = require("users/emanuelespiritowork/SharedRepo:functions/plot_class.js");

var s2_coll = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
.filter(ee.Filter.lt("CLOUDY_PIXEL_PERCENTAGE",20));

var mosaic = mosaic_recent.mosaic_recent(s2_coll, geometry, 10);
var null_var = plot_stretch.plot_stretch(mosaic, ["B4","B3","B2"], 2, 10);

var unsup_bands = ["B.*"];
var unsup = unsup_classification.unsup_classification(mosaic.select(unsup_bands), geometry2, 6, 10);
var null_var_2 = plot_class.plot_class(unsup);
Map.addLayer(unsup, {min: 0, max: 5, palette: ["green","yellow","red","blue","black","pink"]},"unsup");
