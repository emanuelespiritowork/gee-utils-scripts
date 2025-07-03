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
var s2 = s2coll.filterDate("2023-06-25","2023-04-27").first();
var clip = s2.clip(AOI);

var mean = clip.reduce(ee.Reducer.mean());
  
var rbias = clip.subtract(mean).divide(mean);

Map.addLayer(rbias);
Map.centerObject(rbias);
