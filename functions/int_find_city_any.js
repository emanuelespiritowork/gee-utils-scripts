var mosaic_date = require("users/emanuelespiritowork/SharedRepo:functions/mosaic_date.js");

exports.int_find_city_any = function(img_coll, date_start, date_end, AOI, scale_to_use, threshold){
  //Check variable types
  print(date_start);
  print(date_end);
  
  start_date = ee.Date(date_start);//"YYYY-MM-DD"
  end_date = ee.Date(date_end);//"YYYY-MM-DD"
  AOI = ee.FeatureCollection(AOI);
  scale_to_use = ee.Number(scale_to_use);
  threshold = ee.Number(threshold);
  
  var mosaic = mosaic_date.mosaic_date({
    img_coll: img_coll,
    AOI: AOI,
    start_date: start_date,
    latest_date: end_date,
    scale_to_use: scale_to_use
  });
  
  var vect = ee.Image(mosaic)
  .select(["Gap_Filled_DNB_BRDF_Corrected_NTL"])
  .gt(ee.Image(threshold))
  .reduceToVectors({
    bestEffort: true
    })
  .filter(ee.Filter.eq("label",1));
  
  Map.addLayer(clip, {
    bands: "Gap_Filled_DNB_BRDF_Corrected_NTL",
    min:40,
    max:50
  });
  
  Map.addLayer(vect);
  
  Map.centerObject(AOI);
  
  return(vect);
};