exports.int_find_plumes = function(img_coll, AOI, scale_to_use, threshold){
  img_coll = ee.ImageCollection(img_coll);
  scale_to_use = ee.Number(scale_to_use);
  AOI = ee.FeatureCollection(AOI);
  
  //a plume should be a place where I see most of the time of the year
  //any cloud nearby 
  
  //I will not use SCL mask because for small areas it is not reliable
  
  //For this reason in each image I will consider a total amount of 100
  //and this will be distributed among all pixels that have in 
  //each B band a surface reflectance greater than 0.5, mimicing cloud
  
  //any little cloud pixel will receive a medium score but clouds move (except for 
  //Fantozzi) so in other image that pixel should not be covered
  
  //any big cloud pixel will receive a small score because the full score
  //is shared between many pixels
  
  //then I will reduce over the image collection the score layer to see
  //which pixels have the greatest amount. This way I could consider 
  //to highlight pixels whose score is greater than 50*size(img_coll) 
  
  var b1_threshold = threshold || ee.Number(0.2);
  
  var give_score_to_pixel = function(image){
    var num_pixel = image.select("B1").gt(b1_threshold).reduceRegion({
      reducer: ee.Reducer.sum(),
      bestEffort: true,
      scale: scale_to_use
    }).getNumber("B1");
    
    var score = ee.Number(100).divide(ee.Number(num_pixel)).float();
    
    return ee.Image(score).mask(image.select("B1").gt(b1_threshold))
    .unmask(ee.Number(0)).rename("score").float();
  };
  
  var scored = scale.map(give_score_to_pixel);
  
  var clip_scored = clip_to.clip_to(scored, AOI, scale_to_use); 
  
  var final_score = clip_scored.reduce({
    reducer: ee.Reducer.sum()
  });
  
  return final_score;
};