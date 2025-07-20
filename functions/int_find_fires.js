//first part: identify where fires are

var clip_to = require("users/emanuelespiritowork/SharedRepo:functions/clip_to.js");

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

  var clipper = clip_to.clip_to(coll,AOI,5600);
  
  var mask_21 = function(img){
    return img.select(["Coarse_Resolution_Brightness_Temperature_Band_21"])
    .gt(threshold);
  };
  
  var mask_31 = function(img){
    return img.select(["Coarse_Resolution_Brightness_Temperature_Band_31"])
    .gt(threshold);
  };
  
  var masked_21 = clipper.map(mask_21)
  .reduce(ee.Reducer.max());
  
  Map.addLayer(masked_21,{},"masked_21");

  
  var masked_31 = clipper.map(mask_31)
  .reduce(ee.Reducer.max());
  
  Map.addLayer(masked_31,{},"masked_31");

  var masked = masked_21.or(masked_31);
  
  Map.addLayer(masked,{},"masked");
  
  return masked;
};

//second part: compute fire outline