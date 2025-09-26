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
            })]),
    AOI2 = 
    /* color: #98ff00 */
    /* shown: false */
    ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[49.857441252728115, 40.368903824977764],
                  [49.84302169706405, 40.36000971690399],
                  [49.84233505155624, 40.35216099993818],
                  [49.85332137968124, 40.35294591274724],
                  [49.84885818388046, 40.349021257342756],
                  [49.862934416790615, 40.346404693520064],
                  [49.84885818388046, 40.33960115253076],
                  [49.83237869169296, 40.29981287470247],
                  [49.90447647001327, 40.29981287470247],
                  [49.984813994427334, 40.31264192011197],
                  [49.95837814237655, 40.33515231242597],
                  [49.916149443646084, 40.364718508540456],
                  [49.874950713177334, 40.370211683066536]]]),
            {
              "system:index": "0"
            })]),
    AOI3 = /* color: #d63000 */ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[10.341286455815428, 36.887820223437856],
                  [10.35948256177246, 36.87024420064511],
                  [10.343689715092772, 36.85953182836972],
                  [10.34197310132324, 36.85431243628961],
                  [10.33201674145996, 36.848817954311514],
                  [10.329613482182616, 36.84085025400274],
                  [10.326866900151366, 36.833980880492916],
                  [10.321308703094116, 36.83007330857078],
                  [10.31495723214685, 36.82031723990016],
                  [10.310150713592163, 36.81427060124645],
                  [10.325256914764038, 36.80190098899496],
                  [10.415894121795288, 36.81124710279384],
                  [10.420837669260074, 36.870141567457814]]]),
            {
              "system:index": "0"
            })]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
var s1_coll = ee.ImageCollection("COPERNICUS/S1_GRD");
Map.centerObject(AOI2);

var s1_select = require("users/emanuelespiritowork/SharedRepo:functions/s1_select.js");
var clip_to = require("users/emanuelespiritowork/SharedRepo:functions/clip_to.js");
var plot_map = require("users/emanuelespiritowork/SharedRepo:functions/plot_map.js");
var s1_speckle = require("users/emanuelespiritowork/SharedRepo:functions/s1_speckle.js");
var int_find_ships_any = require("users/emanuelespiritowork/SharedRepo:functions/int_find_ships_any.js");
var int_find_ships = require("users/emanuelespiritowork/SharedRepo:functions/int_find_ships.js");

//var select = s1_select.s1_select(s1_coll, "IW", "VH", "DESCENDING", "H");

//var date_filtered = select.filterDate("2024-12-20","2025-02-27");

//print(date_filtered.filterBounds(AOI2));

//var vector = int_find_ships_any.int_find_ships_any(date_filtered, AOI2, 10, -16, 10, 3);

//print(vector);

//Map.addLayer(vector);

//var an_vec = int_find_ships.int_find_ships("2024-12-20","2025-02-27",AOI2);

var an_vec = int_find_ships.int_find_ships("2025-09-07","2025-09-10",AOI3);

//var s2_coll = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
//.filterBounds(AOI2)
//.filterDate("2025-07-23","2025-07-28");

print(an_vec);

Map.addLayer(an_vec);

//Map.addLayer(s2_coll);

/*
var to_print = clip.first().select("VH");

var scale_to_use = 10;

Map.addLayer(to_print);

var kernel_circle = ee.Kernel.circle({
  radius: 3,
  units: "pixels",
  normalize: false
});

//the compact filter will be applied to the vectors
var compact_filter = to_print.gt(-16)
.reduceNeighborhood({
  reducer: ee.Reducer.sum(),
  kernel: kernel_circle,
})
.gt(10).rename("compact");

Map.addLayer(compact_filter);

//the max_filter will be applied to the radar image
var max_filter = to_print.gt(-16)
.reduceNeighborhood({
  reducer: ee.Reducer.max(),
  kernel: kernel_circle
}).rename("max");

var image_to_reduce = max_filter.addBands(compact_filter);

Map.addLayer(max_filter);

var vector = image_to_reduce.reduceToVectors({
  scale: scale_to_use,
  bestEffort: true,
  reducer: ee.Reducer.max()
})
.filter(ee.Filter.gt("label",0))
.filter(ee.Filter.gt("max",0));

print(vector);

Map.addLayer(vector);

/*
var high_value = to_print.updateMask(compact_filter);

Map.addLayer(high_value);

var count = compact_filter.reduceToVectors();

Map.addLayer(count);
*/
//var null_var_2 = plot_map.plot_map(speckle.first().select("VH"),2,10);
