/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var AOI = /* color: #d63000 */ee.Geometry.Polygon(
        [[[9.655771635732613, 45.58401572546659],
          [9.649699114522896, 45.582874389719755],
          [9.65111532088276, 45.580126078180456],
          [9.658882998189888, 45.580306299452225]]]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
var int_find_solar_panel = require("users/emanuelespiritowork/SharedRepo:functions/int_find_solar_panel.js");

var image = int_find_solar_panel.int_find_solar_panel(AOI,"2016-08-01","2025-03-04");

Map.addLayer(image);