var s1_coll = ee.ImageCollection("COPERNICUS/S1_GRD");

var s1_select = require("users/emanuelespiritowork/SharedRepo:functions/s1_select.js");

var s1_speckle = require("users/emanuelespiritowork/SharedRepo:functions/s1_speckle.js");

var selected = s1_select.s1_select(s1_coll, "IW", "ALL", "DESCENDING", "H", true);

//var speckled = s1_speckle.s1_speckle(selected,);

print(selected.first());