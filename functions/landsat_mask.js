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
 * Description: apply cloud and snow mask to a Landsat 8/9 L2 image collection
 * or image
*******************************************************/

exports.landsat_mask = function(img_coll){
  
/******************************************************
 * Check variable types
 *******************************************************/
  img_coll = ee.ImageCollection(img_coll);

/******************************************************
 * Mask landsat image
 *******************************************************/
  var landsat_mask_img = function(image){
    
/******************************************************
 * Quality Assessment layer
 *******************************************************/
    var qa_pixel_layer = image.select("QA_PIXEL");
    
    var dilated_clouds = 1 << 1;
    var cirrus = 1 << 2;
    var cloud = 1 << 3;
    var cloud_shadow = 1 << 4;
    var snow = 1 << 5;

/******************************************************
 * Create masks
 *******************************************************/
    var dilated_clouds_mask = qa_pixel_layer
    .bitwiseAnd(dilated_clouds).neq(0);
    var cirrus_mask = qa_pixel_layer
    .bitwiseAnd(cirrus).neq(0);
    var cloud_mask = qa_pixel_layer
    .bitwiseAnd(cloud).neq(0);
    var cloud_shadow_mask = qa_pixel_layer
    .bitwiseAnd(cloud_shadow).neq(0);
    var snow_mask = qa_pixel_layer
    .bitwiseAnd(snow).neq(0);
    
    var cloud_confidence_high = ee.Image(3 << 10);
    var cloud_confidence_medium = ee.Image(2 << 10);
    var snow_confidence_high = ee.Image(3 << 12);
    var snow_confidence_medium = ee.Image(2 << 12);
    var cirrus_confidence_high = ee.Image(3 << 14);
    var cirrus_confidence_medium = ee.Image(2 << 14);
    
    var select_cloud_bit = qa_pixel_layer.bitwiseAnd(cloud_confidence_high);
    
    var cloud_confidence_high_mask = select_cloud_bit
    .eq(cloud_confidence_high);
    
    var cloud_confidence_medium_mask = select_cloud_bit
    .eq(cloud_confidence_medium);
    
    var select_snow_bit = qa_pixel_layer.bitwiseAnd(snow_confidence_high);
    
    var snow_confidence_high_mask = select_snow_bit
    .eq(snow_confidence_high);
    
    var snow_confidence_medium_mask = select_snow_bit
    .eq(snow_confidence_medium);
    
    var select_cirrus_bit = qa_pixel_layer.bitwiseAnd(cirrus_confidence_high);
    
    var cirrus_confidence_high_mask = select_cirrus_bit
    .eq(cirrus_confidence_high);
    
    var cirrus_confidence_medium_mask = select_cirrus_bit
    .eq(cirrus_confidence_medium);
    
/******************************************************
 * Generate complete mask
 *******************************************************/
    
    var opposite_mask = ee.Image(0)
    .or(dilated_clouds_mask)
    .or(cirrus_mask)
    .or(cloud_mask)
    .or(cloud_shadow_mask)
    .or(snow_mask)
    .or(cloud_confidence_high_mask)
    .or(cloud_confidence_medium_mask)
    .or(snow_confidence_high_mask)
    .or(snow_confidence_medium_mask)
    .or(cirrus_confidence_high_mask)
    .or(cirrus_confidence_medium_mask);
    //.or(image.select("SR_B2").multiply(0.0000275).add(-0.2).gt(5000));//my mask
    
    //creating the xor (1 will be not cloud pixel, 0 will be cloud pixel)
    var mask = opposite_mask.eq(0);
    
/******************************************************
 * Keep time_start and footprint of the image and apply mask
 *******************************************************/
    var time_start_value = image.get('system:time_start');
    var footprint = image.get('system:footprint');

    return image.updateMask(mask).set({
      'system:time_start': time_start_value,
      'system:footprint': footprint
    });
  };
  
  return img_coll.map(landsat_mask_img);
};