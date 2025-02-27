/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var geometry = /* color: #d63000 */ee.Geometry.Point([14.282173659004895, 40.81052856101606]),
    AOI = /* color: #98ff00 */ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[14.249046439109101, 40.81994624558467],
                  [14.181755179343476, 40.785641732125114],
                  [14.044426077780976, 40.76484248927123],
                  [14.255912894187226, 40.57005460600231],
                  [14.460533255515351, 40.71489774156374]]]),
            {
              "system:index": "0"
            })]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
var s1_coll = ee.ImageCollection("COPERNICUS/S1_GRD");

var s1_select = require("users/emanuelespiritowork/SharedRepo:functions/s1_select.js");
var clip_to = require("users/emanuelespiritowork/SharedRepo:functions/clip_to.js");

var select = s1_select.s1_select(s1_coll, "IW", "VV", "DESCENDING", "H");

var date_filtered = select.filterDate("2024-12-20","2025-02-27");

var clip = clip_to.clip_to(date_filtered,AOI,10);

Map.addLayer(clip);

