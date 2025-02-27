/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var geometry = /* color: #d63000 */ee.Geometry.Point([14.282173659004895, 40.81052856101606]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
var s1_coll = ee.ImageCollection("COPERNICUS/S1_GRD");

var s1_select = require("users/emanuelespiritowork/SharedRepo:function/s1_select.js");

var select = s1_select.s1_select(s1_coll, "IW", "VV", "DESCENDING", "H");

print(select.filterBounds(geometry));