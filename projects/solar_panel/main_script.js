/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var AOI = /* color: #d63000 */ee.Geometry.Polygon(
        [[[9.664783858022652, 45.586929029926026],
          [9.636996172628365, 45.58527717482284],
          [9.63635244246479, 45.57637133678865],
          [9.676349543294869, 45.5772724976208]]]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
var int_find_solar_panel = require("users/emanuelespiritowork/SharedRepo:functions/int_find_solar_panel.js");

var image = int_find_solar_panel.int_find_solar_panel(AOI,"2016-08-01","2025-02-04");

Map.addLayer(image);