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
s2 = s2coll.filterDate("","").first();
clip = s2.clip(AOI);

mean = clip.reduce(ee.Reducer.mean());
  
rbias = clip.subtract(mean).divide(mean);

Map.addLayer(rbias);
Map.centerObject(rbias);
