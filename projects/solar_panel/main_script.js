/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var AOI = 
    /* color: #98ff00 */
    /* shown: false */
    ee.Geometry.Polygon(
        [[[12.435676696144608, 44.150596682692665],
          [12.42812359555867, 44.152259440868036],
          [12.421085479103592, 44.145977664188536],
          [12.43087017758992, 44.14135828422289],
          [12.445890548073319, 44.14382199851967]]]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
var int_find_solar_panel = require("users/emanuelespiritowork/SharedRepo:functions/int_find_solar_panel.js");

var image = int_find_solar_panel.int_find_solar_panel(AOI,"2024-08-01","2025-02-04");

Map.addLayer(image);