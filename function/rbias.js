/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var s2coll = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED"),
    AOI = ee.FeatureCollection("projects/ee-emanuelespiritowork/assets/ESU_aggiuntive_20250703");
/***** End of imports. If edited, may not auto-convert in the playground. *****/
/******************************************************
 * Author: Emanuele Spirito
 * Copyright: 2025
 * See latest stable version on my GitHub at 
 * https://github.com/emanuelespiritowork/gee-utils-scripts
*******************************************************/

/******************************************************
 * PURPOSE OF THIS SCRIPT
 * Input: ee.Image, ee.FeatureCollection, ee.Number, ee.Number
 * Output: ee.Image
 * Description: unsupervised classification of an image
*******************************************************/
var s2_ndre = require("users/emanuelespiritowork/SharedRepo:functions/s2_ndre.js");
var plot_stretch = require("users/emanuelespiritowork/SharedRepo:functions/plot_stretch.js");
var id = "a";
AOI = AOI.filter(ee.Filter.eq("id",id));
var date = ee.Date("2023-04-30");
var start_date = date.advance(-1,"day");
var end_date = date.advance(1,"day");
var s2 = s2coll.filterDate(start_date,end_date).filterBounds(AOI).first();
print(AOI);
//Map.addLayer(s2);
var null_var = plot_stretch.plot_stretch(s2,["B8","B4","B3"],2,10);
var clip = s2.clip(AOI.geometry());
var ndre = s2_ndre.s2_ndre(clip).first();
//Map.addLayer(ndre);
var mean = ndre.reduceRegion({
  reducer: ee.Reducer.mean(),
  scale: 10
}).getNumber("ndre");
print(mean);

var rbias = ndre.subtract(ee.Image(mean)).divide(ee.Image(mean));
Map.addLayer(rbias);
Export.image.toDrive({
  image: rbias,
  folder: "GEE_Export",
  scale: 10
});

//Map.addLayer(rbias);
Map.centerObject(AOI);
