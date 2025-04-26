/******************************************************
 * Author: Emanuele Spirito
 * Copyright: 2025
 * See latest stable version on my GitHub at 
 * https://github.com/emanuelespiritowork/gee-utils-scripts
*******************************************************/

/******************************************************
 * REQUIRES THE FOLLOWING FUNCTIONS:
 * clip_to
*******************************************************/

var clip_to = require("users/emanuelespiritowork/SharedRepo:functions/clip_to.js");

/******************************************************
 * PURPOSE OF THIS SCRIPT
 * Input: ee.ImageCollection, ee.FeatureCollection, ee.Number, ee.String, ee.Number
 * Output: ee.Image
 * Description: find plumes in the AOI using a image collection of the past
*******************************************************/

exports.int_find_plumes_any = function(img_coll, AOI, scale_to_use, threshold, , aerosol_band){
/******************************************************
 * Check variable types
*******************************************************/
  img_coll = ee.ImageCollection(img_coll);
  scale_to_use = ee.Number(scale_to_use);
  AOI = ee.FeatureCollection(AOI);
  aerosol_band = ee.String(aerosol_band);

/******************************************************
 * Set the threshold for the aerosol band
*******************************************************/
  var cloud_coverage = max_cloud || ee.Number(30);
  var b1_threshold = threshold || ee.Number(0.2);
  
/******************************************************
 * A plume should be a place where I see most of the time of the year
 * any cloud nearby. I will not use SCL mask because for small areas it is not reliable.
 * For this reason in each image I will consider a total amount of 100
 * and this will be distributed among all pixels that have in 
 * aerosol band a surface reflectance greater than the threshold, 
 * mimicing cloud. Any little cloud pixel will receive a medium score 
 * but clouds move (except for Fantozzi ones) so in other image 
 * that pixel should not be covered. Any big cloud pixel will receive 
 * a small score because the full score is shared between many pixels.
 * The result is that only pixel that have clouds above them for the 
 * majority of time and expecially more than neighbour pixel will be 
 * prized. Then I will reduce over the image collection the score layer 
 * to see which pixels have the greatest amount. 
*******************************************************/  
  var give_score_to_pixel = function(image){
    var time_start = image.get("system:time_start");
    /******************************************************
     * Count the number of pixel above threshold
     *******************************************************/  
    var num_pixel = image.select(aerosol_band).gt(b1_threshold).reduceRegion({
      reducer: ee.Reducer.sum(),
      bestEffort: true,
      scale: scale_to_use
    }).getNumber(aerosol_band);
    
    /******************************************************
     * Compute the score to give to those pixels
     *******************************************************/  
    var score = ee.Number(100).divide(ee.Number(num_pixel)).float();
    
    /******************************************************
     * Create score layer
     *******************************************************/  
    return ee.Image(score).mask(image.select(aerosol_band).gt(b1_threshold))
    .unmask(ee.Number(0)).rename("score").float()
    .set({
      "system:time_start": time_start
    });
  };
  var scored = img_coll.map(give_score_to_pixel);
/******************************************************
 * Clip the score image collection
*******************************************************/  
  var clip_scored = clip_to.clip_to(scored, AOI, scale_to_use); 
/******************************************************
 * Set image properties for the final score image
*******************************************************/  
  var footprint = AOI.geometry();
  
  var first_time = clip_scored.sort("system:time_start",true)
  .first()
  .get("system:time_start");
  
  var last_time = clip_scored.sort("system:time_start",false)
  .first()
  .get("system:time_start");
  
/******************************************************
 * Reduce over the score image collection
*******************************************************/  
  var final_score = clip_scored.reduce({
    reducer: ee.Reducer.sum()
  }).set({
    "system:footprint": footprint,
    "system:time_start": first_time,
    "system:time_end": last_time
  });
  
  return final_score;
};