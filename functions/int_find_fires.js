//first part: identify where fires are

var clip_to = require("users/emanuelespiritowork/SharedRepo:functions/clip_to.js");

exports.int_find_fires = function(date, AOI, temp_threshold){
  //mandatory 
  date = ee.Date(date);
  AOI = ee.FeatureCollection(AOI);
  
  //optional
  var threshold = temp_threshold || ee.Number(337);
  
  var modis = ee.ImageCollection("MODIS/061/MOD09CMG");

  var start_date = date.advance(-1,"day");
  var end_date = date.advance(1,"day");
  
  //print(start_date);
  //print(end_date);

  var coll = modis.filterDate(start_date,end_date).filterBounds(AOI);

  var clipper = clip_to.clip_to(coll,AOI,5600);
  
  //Map.addLayer(clipper.first().select(["Coarse_Resolution_Brightness_Temperature_Band_21"]),{},"clipper")
  
  var mask_20 = function(img){
    return img.select(["Coarse_Resolution_Brightness_Temperature_Band_20"])
    .gt(threshold);
  };
  
  var mask_21 = function(img){
    return img.select(["Coarse_Resolution_Brightness_Temperature_Band_21"])
    .gt(threshold);
  };
  
  var mask_31 = function(img){
    return img.select(["Coarse_Resolution_Brightness_Temperature_Band_31"])
    .gt(threshold);
  };
  
  var mask_32 = function(img){
    return img.select(["Coarse_Resolution_Brightness_Temperature_Band_32"])
    .gt(threshold);
  };
  
  var masked_21 = clipper.map(mask_21)
  .reduce(ee.Reducer.max());
  
  Map.addLayer(masked_21,{},"masked_21");
  
  var masked_20 = clipper.map(mask_20)
  .reduce(ee.Reducer.max());
  
  Map.addLayer(masked_20,{},"masked_20");
  
  var masked_31 = clipper.map(mask_31)
  .reduce(ee.Reducer.max());
  
  Map.addLayer(masked_31,{},"masked_31");

  var masked_32 = clipper.map(mask_32)
  .reduce(ee.Reducer.max());
  
  Map.addLayer(masked_32,{},"masked_32");

  var masked = masked_21.or(masked_31)
  .or(masked_20)
  .or(masked_32);
  
  var find_centroids = function(feature){
    return feature.centroid();
  };
  
  masked = clip_to.clip_to(masked,AOI,5600);
  
  var fire_centers = masked.first().reduceToVectors()
  .filter(ee.Filter.eq("label",1))
  .map(find_centroids);
  
  //Map.addLayer(fire_centers,{},"fire_centers");
  
  return fire_centers;
};

