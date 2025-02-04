var s1_coll = ee.ImageCollection("COPERNICUS/S1_GRD");

var s1_select = require("users/emanuelespiritowork/SharedRepo:functions/s1_select.js");

var s1_speckle = require("users/emanuelespiritowork/SharedRepo:functions/s1_speckle.js");

var selected = s1_select.s1_select(s1_coll, "IW", "ALL", "DESCENDING", "H", true);


var dataset = ee.Image('JRC/GSW1_4/GlobalSurfaceWater');

var visualization = {
  bands: ['occurrence'],
  min: 0.0,
  max: 100.0,
  palette: ['ffffff', 'ffbbbb', '0000ff']
};

Map.setCenter(59.414, 45.182, 6);

Map.addLayer(dataset, visualization, 'Occurrence');


//var bounded = selected.filterBounds

//var speckled = s1_speckle.s1_speckle(selected,);

print(selected.first());