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

mean = s2.reduce(ee.Reducer.mean());
  
rbias = s2.subtract(mean);

Map.addLayer(rbias);