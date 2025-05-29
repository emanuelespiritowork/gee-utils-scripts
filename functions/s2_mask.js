/******************************************************
 * Author: Emanuele Spirito
 * Copyright: 2025
 * See latest stable version on my GitHub at 
 * https://github.com/emanuelespiritowork/gee-utils-scripts
*******************************************************/

/******************************************************
 * PURPOSE OF THIS SCRIPT
 * Input: ee.ImageCollection or ee.Image
 * Output: ee.ImageCollection or ee.Image
 * Description: make a mask over a Sentinel-2 L2A image collection
*******************************************************/

exports.s2_mask = function(img_coll){
/******************************************************
 * Check variable types
*******************************************************/
  img_coll = ee.ImageCollection(img_coll);

/******************************************************
 * Apply s2 mask
*******************************************************/
  var s2_mask_img = function(image){
  //cloud-masking 
  
/******************************************************
 * s2 masks
*******************************************************/
  var opaque = image.select('MSK_CLASSI_OPAQUE').unmask(0);
  var cirrus = image.select('MSK_CLASSI_CIRRUS').unmask(0);
  var snow = image.select('MSK_CLASSI_SNOW_ICE').unmask(0);
  var snow_probability = image.select('MSK_SNWPRB').unmask(0);
  var cloud_probability = image.select('MSK_CLDPRB').unmask(0);
  var SCL_classification = image.select('SCL').unmask(0);

  var cloudBitMask = 1 << 10;
  var cirrusBitMask = 1 << 11;
  var qa = image.select('QA60');
  var qa_cloud = qa.bitwiseAnd(cloudBitMask).neq(0);
  var qa_cirrus = qa.bitwiseAnd(cirrusBitMask).neq(0);

/******************************************************
 * Create complete masks
*******************************************************/
  //or mask (1 will be cloud pixel, 0 will be not cloud pixel)
  var opposite_mask = qa_cloud
      .or(qa_cirrus)
      .or(opaque.eq(1))
      .or(cirrus.eq(1))
      .or(snow.eq(1))
      .or(snow_probability.gt(30))
      .or(cloud_probability.gt(30))
      .or(SCL_classification.lt(4))     //cloud_shadow
      .or(SCL_classification.eq(9))     //cloud_high
      .or(SCL_classification.eq(8))     //cloud_medium
      .or(SCL_classification.eq(10))    //cirrus
      .or(SCL_classification.eq(11));    //snow
      //.or(image.select("B2").gt(5000)); //my_cloud_filter
      
  //creating the xor (1 will be not cloud pixel, 0 will be cloud pixel)
  var mask = opposite_mask.eq(0);

/******************************************************
 * Get time_start and footprint  
*******************************************************/
  var time_start_value = image.get('system:time_start');
  var footprint = image.get('system:footprint');
  var index = image.get('PRODUCT_ID');

/******************************************************
 * Apply mask
*******************************************************/
  return image.updateMask(mask).set({
    'system:time_start': time_start_value,
    'system:footprint': footprint,
    'system:index': index
  });
};
  
  return img_coll.map(s2_mask_img);
};