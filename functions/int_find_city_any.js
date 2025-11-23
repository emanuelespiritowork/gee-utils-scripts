var mosaic_date = require("users/emanuelespiritowork/SharedRepo:functions/mosaic_date.js");

exports.int_find_city_any = function(img_coll, start_date, end_date, AOI, scale_to_use, threshold){
  //Check variable types
  start_date = ee.Date(start_date);//"YYYY-MM-DD"
  end_date = ee.Date(end_date);//"YYYY-MM-DD"
  AOI = ee.FeatureCollection(AOI);
  scale_to_use = ee.Number(scale_to_use);
  threshold = ee.Number(threshold);
  
  print(threshold);
  
  var mosaic = mosaic_date.mosaic_date(img_coll,
  AOI,
  start_date,
  end_date,
  scale_to_use);
  
  var vect = ee.Image(mosaic)
  .select(["Gap_Filled_DNB_BRDF_Corrected_NTL"])
  .gt(ee.Image(threshold))
  .reduceToVectors({
    bestEffort: true
    })
  .filter(ee.Filter.eq("label",1));
  
  Map.addLayer(mosaic, {
    bands: "Gap_Filled_DNB_BRDF_Corrected_NTL",
    min:40,
    max:50
  });
  
  Map.addLayer(vect);
  
  Map.centerObject(AOI);
  
  return(vect);
};