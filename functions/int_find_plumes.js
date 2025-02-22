exports.int_find_plumes = function(img_coll, scale_to_use){
  img_coll = ee.ImageCollection(img_coll);
  scale_to_use = ee.Number(scale_to_use);
  
  //a plume should be a place where I see most of the time of the year
  //any cloud nearby 
  
};