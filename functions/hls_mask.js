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

exports.hls_mask = function(img_coll){
/******************************************************
 * Check variable types
*******************************************************/
  img_coll = ee.ImageCollection(img_coll);

/******************************************************
 * Apply hls mask
*******************************************************/
  var hls_mask_img = function(image){
  //cloud-masking 
  
/******************************************************
 * hls masks
*******************************************************/
  var cloudBitMask = 1 << 1;
  var nearCloudBitMask = 1 << 2;
  var cloudShadowMask = 1 << 3;
  var snowIceMask = 1 << 4;
  var waterMask = 1 << 5;
  var qa = image.select('Fmask');
  var qa_cloud = qa.bitwiseAnd(cloudBitMask).neq(0);
  var qa_nearcloud = qa.bitwiseAnd(nearCloudBitMask).neq(0);
  var qa_cloudshadow = qa.bitwiseAnd(cloudShadowMask).neq(0);
  var qa_snowice = qa.bitwiseAnd(snowIceMask).neq(0);
  var qa_water = qa.bitwiseAnd(waterMask).neq(0);

/******************************************************
 * Create complete masks
*******************************************************/
  //or mask (1 will be cloud pixel, 0 will be not cloud pixel)
  var opposite_mask = qa_cloud
      .or(qa_nearcloud)
      .or(qa_cloudshadow)
      .or(qa_snowice)
      .or(qa_water)
      
  //creating the xor (1 will be not cloud pixel, 0 will be cloud pixel)
  var mask = opposite_mask.eq(0);

/******************************************************
 * Get time_start and footprint and index 
*******************************************************/
  var time_start_value = image.get('system:time_start');
  var footprint = image.get('system:footprint');
  var index = image.get('system:index');

/******************************************************
 * Apply mask
*******************************************************/
  return image.updateMask(mask).set({
    'system:time_start': time_start_value,
    'system:footprint': footprint,
    'system:index': index
  });
};
  
  return img_coll.map(hls_mask_img);
};