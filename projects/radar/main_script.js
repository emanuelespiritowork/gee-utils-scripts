/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var AOI = 
    /* color: #d63000 */
    /* shown: false */
    ee.Geometry.Polygon(
        [[[8.168755633607997, 43.97628891605554],
          [8.122063739076747, 43.96640551782097],
          [8.124810321107997, 43.94527423906807],
          [8.1771670410787, 43.94119540799434],
          [8.22437391974081, 43.9630694996992]]]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
var s1_longest_series = require("users/emanuelespiritowork/SharedRepo:functions/s1_longest_series.js");
var int_find_radar_any = require("users/emanuelespiritowork/SharedRepo:functions/int_find_radar_any.js");
var int_find_radar = require("users/emanuelespiritowork/SharedRepo:functions/int_find_radar.js");

var s1_coll = s1_longest_series.s1_longest_series("2015-06-13","2020-12-21",AOI);

Map.centerObject(AOI);

//Map.addLayer(s1_coll.first());

//var radar = int_find_radar_any.int_find_radar_any(s1_coll,AOI,1);

var radar = int_find_radar.int_find_radar("2015-06-13","2020-12-21",AOI);

Map.addLayer(radar);