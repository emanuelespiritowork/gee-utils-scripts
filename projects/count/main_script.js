/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var AOI = 
    /* color: #98ff00 */
    /* shown: false */
    ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[14.263465994773163, 40.8443644076347],
                  [14.164589041648163, 40.80175666631964],
                  [14.044426077780976, 40.76484248927123],
                  [14.255912894187226, 40.57005460600231],
                  [14.495763933197257, 40.70603187482263],
                  [14.452980154929413, 40.74819840680087],
                  [14.299610907550777, 40.836322956442324]]]),
            {
              "system:index": "0"
            })]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
var s1_coll = ee.ImageCollection("COPERNICUS/S1_GRD");

var s1_select = require("users/emanuelespiritowork/SharedRepo:functions/s1_select.js");
var clip_to = require("users/emanuelespiritowork/SharedRepo:functions/clip_to.js");
var plot_map = require("users/emanuelespiritowork/SharedRepo:functions/plot_map.js");


var select = s1_select.s1_select(s1_coll, "IW", "VH", "DESCENDING", "M");

var date_filtered = select.filterDate("2024-12-20","2025-02-27");

var clip = clip_to.clip_to(date_filtered,AOI,10);

var null_var = plot_map.plot_map(clip.first().select("VH"),2,10);

