var mosaic_date = require("users/emanuelespiritowork/SharedRepo:functions/mosaic_date.js");

exports.int_find_city_any = function(img_coll, start_date, end_date, AOI, scale_to_use, threshold){
  //Check variable types
  start_date = ee.Date(start_date);//"YYYY-MM-DD"
  end_date = ee.Date(end_date);//"YYYY-MM-DD"
  AOI = ee.FeatureCollection(AOI);
  scale_to_use = ee.Number(scale_to_use);
  threshold = ee.Number(threshold);
  
  var filter = img_coll.filterDate(start_date, end_date);
  
  var clip = clip_to.clip_to(filter,AOI,10).first();

var vect = ee.Image(clip).select(["Gap_Filled_DNB_BRDF_Corrected_NTL"])
.gt(ee.Image(40))
.reduceToVectors({
  bestEffort: true
})
.filter(ee.Filter.eq("label",1));

Map.addLayer(clip, {
  bands: "Gap_Filled_DNB_BRDF_Corrected_NTL",
  min:10,
  max:80
});

Map.addLayer(vect);

Map.centerObject(AOI);
  
  return(result);
};