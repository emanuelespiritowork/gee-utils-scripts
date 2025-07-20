//first part: identify where fires are

exports.int_find_fires = function(date, AOI, temp_threshold){
  //mandatory 
  date = ee.Date(date);
  AOI = ee.FeatureCollection(AOI);
  
  //optional
  var threshold = temp_threshold | ee.Number(330);
  
  
  
};

//second part: compute fire outline