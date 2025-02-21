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
 * Description: scale and offset a Sentinel-2 L2A image collection
*******************************************************/

exports.s2_scale = function(img_coll){
/******************************************************
 * Check variable types
*******************************************************/
  img_coll = ee.ImageCollection(img_coll);

/******************************************************
 * Scale Sentinel-2 image
*******************************************************/
  var s2_scale_img = function(image){
    /******************************************************
    * Scale B bands
    *******************************************************/
    var s2_B_bands_names = image.select("B.*").bandNames();
    var scale_B_band = function(band){
      return image.select(ee.String(band)).divide(ee.Number(10000));
    };
    
    var scaled_B_image = s2_B_bands_names.map(scale_B_band);
    
    var collection_of_image = ee.ImageCollection.fromImages(scaled_B_image);
    
    var imageMulti = collection_of_image.toBands().rename(s2_B_bands_names);
    
    /******************************************************
    * Add not B bands
    *******************************************************/
    var s2_not_B_bands = image.select('[^B].*');
    var fullImage = imageMulti.addBands(s2_not_B_bands);
    
    var time_start_value = image.get('system:time_start');
    var footprint = image.get('system:footprint');
    fullImage = fullImage.set({
      'system:time_start':time_start_value,
      'system:footprint': footprint
    });
    
    return fullImage;
  };
  
  return img_coll.map(s2_scale_img);
};