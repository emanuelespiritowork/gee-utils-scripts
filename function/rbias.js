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
var id = "a";
var s2_ndre = require("users/emanuelespiritowork/SharedRepo:functions/s2_ndre.js");
var s2 = s2coll.filterDate("2023-04-25","2023-04-27").filterBounds(AOI).first();
//Map.addLayer(s2);
var clip = s2.clip(AOI.geometry());
var ndre = s2_ndre.s2_ndre(clip).first();
Map.addLayer(ndre);
var mean = ndre.reduceRegion({
  reducer: ee.Reducer.mean(),
  scale: 10
});

Export.image.toDrive({
  image: ndre,
  folder: "GEE_Export",
  scale: 10
});

//Map.addLayer(rbias);
Map.centerObject(AOI);
