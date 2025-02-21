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
 * Description: apply scale and offset to Landsat 8/9 image 
*******************************************************/

exports.landsat_scale = function(img_coll){

/******************************************************
 * Check variable types
 *******************************************************/
  img_coll = ee.ImageCollection(img_coll);

/******************************************************
 * Apply scale to landsat image
 *******************************************************/
  var landsat_scale_img = function(image){
    /******************************************************
    * Surface reflectance bands
    *******************************************************/
    
    var landsat_SR_bands_names = image.select("SR_B.*").bandNames();
    var scale_SR_band = function(band){
      return image.select(ee.String(band)).multiply(ee.Number(0.0000275))
      .add(ee.Number(-0.2));
    };
    var scaled_SR_image = landsat_SR_bands_names.map(scale_SR_band);
    
    var collection_of_SR_image = ee.ImageCollection.fromImages(scaled_SR_image);
    var imageSRMulti = collection_of_SR_image.toBands()
    .rename(landsat_SR_bands_names);
    
    /******************************************************
    * ST_ATRAN, ST_EMIS, ST_EMSD bands
    *******************************************************/
    var landsat_ST_ATRAN_bands_names = image.select([
      "ST_ATRAN","ST_EMIS","ST_EMSD"]).bandNames();
    var scale_ST_ATRAN_bands = function(band){
      return image.select(ee.String(band)).multiply(ee.Number(0.0001));
    };
    
    var scaled_ST_ATRAN_image = landsat_ST_ATRAN_bands_names
    .map(scale_ST_ATRAN_bands);
    
    var collection_of_ST_ATRAN_image = ee.ImageCollection.fromImages(scaled_ST_ATRAN_image);
    var imageSTATRANMulti = collection_of_ST_ATRAN_image.toBands()
    .rename(landsat_ST_ATRAN_bands_names);
    
    /******************************************************
    * ST_DRAD, ST_TRAD, ST_URAD bands
    *******************************************************/
    var landsat_ST_DRAD_bands_names = image.select([
      "ST_DRAD","ST_TRAD","ST_URAD"]).bandNames();
    var scale_ST_DRAD_bands = function(band){
      return image.select(ee.String(band)).multiply(ee.Number(0.001));
    };
    
    var scaled_ST_DRAD_image = landsat_ST_DRAD_bands_names
    .map(scale_ST_DRAD_bands);
    
    var collection_of_ST_DRAD_image = ee.ImageCollection.fromImages(scaled_ST_DRAD_image);
    var imageSTDRADMulti = collection_of_ST_DRAD_image.toBands()
    .rename(landsat_ST_DRAD_bands_names);
    
    /******************************************************
    * ST_CDIST, ST_QA bands
    *******************************************************/
    var landsat_ST_CDIST_bands_names = image.select([
      "ST_CDIST","ST_QA"]).bandNames();
    var scale_ST_CDIST_bands = function(band){
      return image.select(ee.String(band)).multiply(ee.Number(0.001));
    };
    var scaled_ST_CDIST_image = landsat_ST_CDIST_bands_names
    .map(scale_ST_CDIST_bands);
    
    var collection_of_ST_CDIST_image = ee.ImageCollection.fromImages(scaled_ST_CDIST_image);
    var imageSTCDISTMulti = collection_of_ST_CDIST_image.toBands()
    .rename(landsat_ST_CDIST_bands_names);
    
    /******************************************************
    * SR_QA bands
    *******************************************************/
    var landsat_SR_QA = image.select('SR_QA.*');
    
    /******************************************************
    * STB10 bands
    *******************************************************/
    var scaled_STB10_image = image.select('ST_B10')
    .multiply(ee.Number(0.00341802))
    .add(ee.Number(149));
    
    /******************************************************
    * not S bands
    *******************************************************/
    var landsat_not_S = image.select('[^S].*');
    
    /******************************************************
    * create full image
    *******************************************************/
    var fullImage = imageSRMulti.addBands(scaled_STB10_image)
    .addBands(imageSTATRANMulti)
    .addBands(imageSTDRADMulti)
    .addBands(imageSTCDISTMulti)
    .addBands(landsat_not_S)
    .addBands(landsat_SR_QA);
    
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
  
  return img_coll.map(landsat_scale_img);
};