/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var AOI = ee.FeatureCollection("projects/ee-emanuelespiritowork/assets/ESU_aggiuntive_20250703"),
    s2coll = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED");
/***** End of imports. If edited, may not auto-convert in the playground. *****/
var s2image = s2coll.filterBounds(AOI).first();
Map.addLayer(s2image);
Map.addLayer(AOI);
Map.centerObject(AOI);

var rbias = require("users/emanuelespiritowork/SharedRepo:functions/rbias.js");

var result = rbias.rbias(s2image,AOI);

print(result);

var mean = s2image.reduceRegion({
      reducer: ee.Reducer.mean(),
      geometry: AOI.first().geometry()
});

print(s2image.bandNames().get(0));

print(mean);

//Map.addLayer(ee.Image(mean));

Map.addLayer(result);