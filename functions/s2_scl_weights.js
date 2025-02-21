/******************************************************
 * Author: Emanuele Spirito
 * Copyright: 2025
 * See latest stable version on my GitHub at 
 * https://github.com/emanuelespiritowork/gee-utils-scripts
*******************************************************/

/******************************************************
 * PURPOSE OF THIS SCRIPT
 * Input: ee.ImageCollection, ee.FeatureCollection
 * Output: ee.ImageCollection
 * Description: given an image collection with the Sentinel-2 SCL layer
 * this script creates the scl_weight layer based on the default sen2rts
 * weights
 * See https://rdrr.io/github/ranghetti/sen2rts/man/scl_weights.html
*******************************************************/

exports.s2_scl_weights = function(img_coll, AOI){
/******************************************************
 * Check variable types
*******************************************************/
  img_coll = ee.ImageCollection(img_coll);
  AOI = ee.FeatureCollection(AOI);
/******************************************************
 * Select SCL layer
*******************************************************/
  var scl = img_coll.select("SCL");
/******************************************************
 * Remap from SCL values to SCL_weights of sen2rts
*******************************************************/
  var set_scl_weights = function(image){
    
    var time_start_value = image.get('system:time_start');
    var footprint = image.get('system:footprint');
    
    return image.select("SCL").remap({
      from: [0,1,2,3,4,5,6,7,8,9,10,11],
      to: [0,0,0.33,0.17,1,1,1,0.33,0,0,0.33,0],
      defaultValue: -1
    }).rename("qa")
    .set({
      'system:time_start': time_start_value,
      'system:footprint': footprint
    });
    
  };
  
  var scl_weights = scl.map(set_scl_weights);
  
  return scl_weights;
};