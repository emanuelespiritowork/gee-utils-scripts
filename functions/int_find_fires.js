//first part: identify where fires are

exports.int_find_fires = function(date, AOI, temp_threshold){
  //mandatory 
  date = ee.Date(date);
  AOI = ee.FeatureCollection(AOI);
  
  //optional
  var threshold = temp_threshold | ee.Number(334);
  
  var modis = ee.ImageCollection("MODIS/061/MOD09CMG");

  var start_date = date.advance(-1,"day");
  var end_date = date.advance(1,"day");

  var coll = modis.filterDate(start_date,end_date).filterBounds(AOI);

  
};

//second part: compute fire outline