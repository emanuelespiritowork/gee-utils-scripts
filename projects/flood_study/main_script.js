/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var AOI = 
    /* color: #d63000 */
    /* shown: false */
    ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[-95.99334473924377, 29.61054349466859],
                  [-95.9185003788922, 29.691400780868005],
                  [-95.99986787156799, 29.747753550985834],
                  [-96.09050507859924, 29.731059732629266],
                  [-96.04793305711486, 29.627257335035313]]]),
            {
              "system:index": "0"
            })]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
var int_find_flood = require("users/emanuelespiritowork/SharedRepo:functions/int_find_flood.js");

var flood_event = int_find_flood.int_find_flood("2016-05-28", AOI, 10, -22);

Map.addLayer(flood_event);