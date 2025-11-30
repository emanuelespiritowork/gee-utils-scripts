/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var AOI = 
    /* color: #d63000 */
    /* shown: false */
    ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[8.67275153907511, 45.681075508975425],
                  [7.31044685157511, 45.18767928531105],
                  [8.142176510983132, 44.936618608419664],
                  [9.735194089108132, 44.796460247141965],
                  [9.757166745358132, 45.57079937783307]]]),
            {
              "system:index": "0"
            })]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
var int_find_city = require("users/emanuelespiritowork/SharedRepo:functions/int_find_city.js");

var result = int_find_city.int_find_city("2024-11-11","2024-11-13",AOI);