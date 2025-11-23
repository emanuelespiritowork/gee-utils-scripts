/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var AOI = 
    /* color: #d63000 */
    /* shown: false */
    ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[8.67275153907511, 45.681075508975425],
                  [7.31044685157511, 45.18767928531105],
                  [7.911463620358132, 44.177285439661716],
                  [12.525721432858132, 44.326801157707514],
                  [11.756678464108132, 45.9311006828733]]]),
            {
              "system:index": "0"
            })]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
var int_find_city = require("users/emanuelespiritowork/SharedRepo:functions/int_find_city.js");

var result = int_find_city.int_find_city("2024-11-11","2024-11-13",AOI);