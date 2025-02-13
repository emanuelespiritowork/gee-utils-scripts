exports.s2_scl_weights = function(img_coll, AOI){
  
  var scl = img_coll.select("SCL");
  
  var set_scl_weights = function(image){
    
    return image.select("SCL").remap({
      from: [0,1,2,3,4,5,6,7,8,9,10,11],
      to: [0,0,0.33,0.17,1,1,1,0.33,0,0,0.33,0],
      defaulValue: -1
    }).rename("SCL_weights");
    
  };
  
  var scl_weights = scl.map(set_scl_weights);
  
  return scl_weights;
};