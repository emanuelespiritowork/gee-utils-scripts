/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var AOI = 
    /* color: #98ff00 */
    /* shown: false */
    ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[14.26730253807869, 40.55783366252705],
                  [14.318800951164627, 40.56826642844276],
                  [14.317084337395096, 40.57400375656464],
                  [14.317084337395096, 40.58860564473975],
                  [14.33209562834521, 40.61371053905907],
                  [14.332438951099116, 40.622310499784646],
                  [14.338275437915522, 40.6285643213053],
                  [14.345750062412671, 40.63546145047459],
                  [14.406861512607984, 40.66271953492544],
                  [14.425744264072828, 40.67834352761644],
                  [14.450463502354078, 40.69110040594339],
                  [14.47037622208064, 40.70255348121264],
                  [14.453038216751963, 40.73790455186071],
                  [14.437932015580088, 40.748829391876534],
                  [14.412526131791026, 40.74960966892476],
                  [14.396389962357432, 40.75325084075552],
                  [14.348435541525237, 40.78829599944082],
                  [14.326364024918536, 40.81147936389269],
                  [14.310571178238849, 40.82239211071088],
                  [14.297868236344318, 40.82784781091983],
                  [14.288255199234943, 40.82862716002617],
                  [14.275895580094318, 40.828886941026134],
                  [14.256669505875568, 40.831744464855454],
                  [14.249803050797443, 40.82213230426806],
                  [14.227830394547443, 40.82447052561615],
                  [14.213754161637286, 40.80061433926055],
                  [14.186631664078693, 40.785538936865],
                  [14.15847919825838, 40.78371926026093],
                  [14.151612743180255, 40.81360762834457],
                  [14.092217906754474, 40.80373296065601],
                  [14.117967113297443, 40.78735856361138],
                  [14.090157970231036, 40.77436013590981]]]),
            {
              "system:index": "0"
            })]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
var s1_coll = ee.ImageCollection("COPERNICUS/S1_GRD");

var s1_select = require("users/emanuelespiritowork/SharedRepo:functions/s1_select.js");
var clip_to = require("users/emanuelespiritowork/SharedRepo:functions/clip_to.js");
var plot_map = require("users/emanuelespiritowork/SharedRepo:functions/plot_map.js");
var s1_speckle = require("users/emanuelespiritowork/SharedRepo:functions/s1_speckle.js");

var select = s1_select.s1_select(s1_coll, "IW", "VH", "DESCENDING", "H");

var date_filtered = select.filterDate("2024-12-20","2025-02-27");

var clip = clip_to.clip_to(date_filtered,AOI,10);

var speckle = s1_speckle.s1_speckle(clip, 100, "meters", "circle");

var to_print = clip.first().select("VH");

Map.addLayer(to_print);

var kernel_circle = ee.Kernel.circle({
  radius: 10,
  units: "pixels",
  normalize: false
});

/*var high_value_filter = to_print.gt(-16)
.reduceNeighborhood({
  reducer: ee.Reducer.max(),
  kernel: kernel_circle
});*/

var compact_filter = to_print.gt(-16)
.reduceNeighborhood({
  reducer: ee.Reducer.sum(),
  kernel: kernel_circle,
});

Map.addLayer(to_print.gt(-16));

Map.addLayer(compact_filter);

/*
var high_value = to_print.updateMask(compact_filter);

Map.addLayer(high_value);

var count = compact_filter.reduceToVectors();

Map.addLayer(count);
*/
//var null_var_2 = plot_map.plot_map(speckle.first().select("VH"),2,10);
