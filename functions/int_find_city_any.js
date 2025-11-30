var clip_to = require("users/emanuelespiritowork/SharedRepo:functions/clip_to.js");

exports.int_find_city_any = function(img_coll, start_date, end_date, AOI, scale_to_use, threshold){
  //Check variable types
  start_date = ee.Date(start_date);//"YYYY-MM-DD"
  end_date = ee.Date(end_date);//"YYYY-MM-DD"
  AOI = ee.FeatureCollection(AOI);
  scale_to_use = ee.Number(scale_to_use);
  threshold = ee.Number(threshold);
  
  //al posto del mosaico metto il massimo nell'img_coll
  var clip = clip_to.clip_to(img_coll,AOI,scale_to_use);
  
  Map.addLayer(clip.geometry(),{},"clip.geometry");
  
  var max = clip.reduce({
    reducer: ee.Reducer.max()
  });
  
  Map.addLayer(max.geometry(),{},"max.geometry");
  
  /*
  var mosaic = mosaic_date.mosaic_date(img_coll,
  AOI,
  start_date,
  end_date,
  scale_to_use);
  */
  
  Map.addLayer(max, {
    bands: "Gap_Filled_DNB_BRDF_Corrected_NTL_max",
    min:40,
    max:50
  });
  
  var vect = ee.Image(max)
  .select(["Gap_Filled_DNB_BRDF_Corrected_NTL_max"])
  .gt(ee.Image(threshold))
  .reduceToVectors({
    bestEffort: true,
    scale: scale_to_use
    })
  .filter(ee.Filter.eq("label",1));
  
  print(vect);
  
  
  Map.addLayer(vect);
  
  Map.centerObject(AOI);
  
  return(vect);
};