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
                [[[10.141796021313594, 46.15127401319771],
                  [10.147031693310664, 46.15008480461001],
                  [10.14986410603039, 46.1530280489639],
                  [10.152524857373164, 46.15314696461951],
                  [10.157417206616328, 46.15237400826509],
                  [10.15992759091992, 46.15466313632391],
                  [10.165270714611934, 46.156952129932414],
                  [10.150035767407344, 46.15522794699986]]]),
            {
              "system:index": "5"
            })]),
    snow = 
    /* color: #bad610 */
    /* shown: false */
    ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Point([10.143162837696428, 46.12956664697402]),
            {
              "class": 0,
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Point([10.14110290117299, 46.13373031596867]),
            {
              "class": 0,
              "system:index": "1"
            }),
        ee.Feature(
            ee.Geometry.Point([10.158269038868303, 46.15097644859733]),
            {
              "class": 0,
              "system:index": "2"
            }),
        ee.Feature(
            ee.Geometry.Point([10.189854732227678, 46.141580949652536]),
            {
              "class": 0,
              "system:index": "3"
            }),
        ee.Feature(
            ee.Geometry.Point([10.109592845115637, 46.116002799931536]),
            {
              "class": 0,
              "system:index": "4"
            }),
        ee.Feature(
            ee.Geometry.Point([10.15920298305509, 46.13991575724959]),
            {
              "class": 0,
              "system:index": "5"
            })]),
    darksnow = 
    /* color: #98ff00 */
    /* shown: false */
    ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Point([10.170103480491614, 46.1373333634546]),
            {
              "class": 1,
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Point([10.175339152488684, 46.146967445555354]),
            {
              "class": 1,
              "system:index": "1"
            }),
        ee.Feature(
            ee.Geometry.Point([10.154825617942786, 46.15005950955535]),
            {
              "class": 1,
              "system:index": "2"
            }),
        ee.Feature(
            ee.Geometry.Point([10.178772380027747, 46.141139622029094]),
            {
              "class": 1,
              "system:index": "3"
            }),
        ee.Feature(
            ee.Geometry.Point([10.17971685807372, 46.15434172144605]),
            {
              "class": 1,
              "system:index": "4"
            }),
        ee.Feature(
            ee.Geometry.Point([10.14323881547118, 46.142389672806075]),
            {
              "class": 1,
              "system:index": "5"
            })]),
    darkveg = 
    /* color: #0b4a8b */
    /* shown: false */
    ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Point([10.18718412797118, 46.13835777280952]),
            {
              "class": 2,
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Point([10.181519302531727, 46.13835777280952]),
            {
              "class": 2,
              "system:index": "1"
            }),
        ee.Feature(
            ee.Geometry.Point([10.153795990153798, 46.13407549707025]),
            {
              "class": 2,
              "system:index": "2"
            }),
        ee.Feature(
            ee.Geometry.Point([10.128132614299306, 46.13663300735571]),
            {
              "class": 2,
              "system:index": "3"
            }),
        ee.Feature(
            ee.Geometry.Point([10.196797165080556, 46.14359121314691]),
            {
              "class": 2,
              "system:index": "4"
            }),
        ee.Feature(
            ee.Geometry.Point([10.195080551311024, 46.15441334099597]),
            {
              "class": 2,
              "system:index": "5"
            }),
        ee.Feature(
            ee.Geometry.Point([10.112265288861098, 46.14651132017107]),
            {
              "class": 2,
              "system:index": "6"
            })]),
    veg = 
    /* color: #ffc82d */
    /* shown: false */
    ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Point([10.12120440684137, 46.135408465700394]),
            {
              "class": 3,
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Point([10.120603592022034, 46.138203810217455]),
            {
              "class": 3,
              "system:index": "1"
            }),
        ee.Feature(
            ee.Geometry.Point([10.12605293552955, 46.1441817422389]),
            {
              "class": 3,
              "system:index": "2"
            }),
        ee.Feature(
            ee.Geometry.Point([10.124547026691042, 46.1518411031142]),
            {
              "class": 3,
              "system:index": "3"
            }),
        ee.Feature(
            ee.Geometry.Point([10.127980254230105, 46.152673525260205]),
            {
              "class": 3,
              "system:index": "4"
            }),
        ee.Feature(
            ee.Geometry.Point([10.132271788653933, 46.15255460858161]),
            {
              "class": 3,
              "system:index": "5"
            }),
        ee.Feature(
            ee.Geometry.Point([10.147377989825808, 46.15564635871788]),
            {
              "class": 3,
              "system:index": "6"
            }),
        ee.Feature(
            ee.Geometry.Point([10.111929915484987, 46.153684306654064]),
            {
              "class": 3,
              "system:index": "7"
            })]),
    urb = /* color: #00ffff */ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Point([10.149006248886309, 46.153399706118726]),
            {
              "class": 4,
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Point([10.154992939407549, 46.15432872156684]),
            {
              "class": 4,
              "system:index": "1"
            }),
        ee.Feature(
            ee.Geometry.Point([10.127870441848955, 46.14977267968529]),
            {
              "class": 4,
              "system:index": "2"
            }),
        ee.Feature(
            ee.Geometry.Point([10.149113537246905, 46.152730805285444]),
            {
              "class": 4,
              "system:index": "3"
            }),
        ee.Feature(
            ee.Geometry.Point([10.152246357376299, 46.1539050924676]),
            {
              "class": 4,
              "system:index": "4"
            }),
        ee.Feature(
            ee.Geometry.Point([10.147075058395586, 46.15333281640121]),
            {
              "class": 4,
              "system:index": "5"
            }),
        ee.Feature(
            ee.Geometry.Point([10.149285198623858, 46.15267134704015]),
            {
              "class": 4,
              "system:index": "6"
            })]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
/******************************************************
 * Author: Emanuele Spirito
 * Copyright: 2025
 * See latest stable version on my GitHub at 
 * https://github.com/emanuelespiritowork/gee-utils-scripts
*******************************************************/

var class_unsup = require("users/emanuelespiritowork/SharedRepo:functions/class_unsup.js");
var class_sup = require("users/emanuelespiritowork/SharedRepo:functions/class_sup.js");
var mosaic_recent = require("users/emanuelespiritowork/SharedRepo:functions/mosaic_recent.js");
var plot_stretch = require("users/emanuelespiritowork/SharedRepo:functions/plot_stretch.js");
var plot_class = require("users/emanuelespiritowork/SharedRepo:functions/plot_class.js");

var s2_coll = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
.filter(ee.Filter.lt("CLOUDY_PIXEL_PERCENTAGE",20));

var mosaic = mosaic_recent.mosaic_recent(s2_coll, geometry, 10);
var null_var = plot_stretch.plot_stretch(mosaic, ["B4","B3","B2"], 2, 10);

var unsup_bands = ["B.*"];
var unsup = class_unsup.class_unsup(mosaic.select(unsup_bands), geometry2, 5, 10);
var null_var_2 = plot_class.plot_class(unsup, 10);
//Map.addLayer(unsup, {min: 0, max: 5, palette: ["green","yellow","red","blue","black","pink"]},"unsup");
Map.centerObject(geometry);

var samples = snow.merge(darksnow).merge(darkveg).merge(veg).merge(urb);

var sup = class_sup.class_sup(mosaic.select(unsup_bands), samples, 10);

var null_var_3 = plot_class.plot_class(sup, 10);