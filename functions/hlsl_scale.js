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
 * Description: apply scale and offset to hlsl 8/9 image 
*******************************************************/

exports.hlsl_scale = function(img_coll){

/******************************************************
 * Check variable types
 *******************************************************/
  img_coll = ee.ImageCollection(img_coll);

/******************************************************
 * Apply scale to hlsl image
 *******************************************************/
  var hlsl_scale_img = function(image){
    /******************************************************
    * Surface reflectance bands
    *******************************************************/
    
    var hlsl_SR_bands_names = image.select("B.*").bandNames();
    var scale_SR_band = function(band){
      return image.select(ee.String(band)).multiply(ee.Number(0.0000275))
      .add(ee.Number(-0.2));
    };
    var scaled_SR_image = hlsl_SR_bands_names.map(scale_SR_band);
    
    var collection_of_SR_image = ee.ImageCollection.fromImages(scaled_SR_image);
    var imageSRMulti = collection_of_SR_image.toBands()
    .rename(hlsl_SR_bands_names);
    
    /******************************************************
    * not B bands
    *******************************************************/
    var hlsl_not_S = image.select('[^B].*');
    
    /******************************************************
    * create full image
    *******************************************************/
    var fullImage = imageSRMulti.addBands(hlsl_not_S);
    
    /******************************************************
    * insert time
    *******************************************************/
    var time_start_value = image.get('system:time_start');
    var footprint = image.get('system:footprint');
    fullImage = fullImage.set({
      'system:time_start':time_start_value,
      'system:footprint':footprint
    });
    
    return fullImage;
  };
  
  return img_coll.map(hlsl_scale_img);
};