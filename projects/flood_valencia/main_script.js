var s1_coll = ee.ImageCollection("COPERNICUS/S1_GRD");

var s1_select = require("users/emanuelespiritowork/SharedRepo:functions/s1_select.js");

var selected = s1_select.s1_select(s1_coll, "IW", "VV", "DESCENDING", "H");

print(selected.limit(5));