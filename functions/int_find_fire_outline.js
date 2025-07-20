//second part: compute fire outline
var clip_to = require("users/emanuelespiritowork/SharedRepo:functions/clip_to.js");

exports.int_find_fire_outline = function(fire_point, start_date, true_end_date, buffer, time_delay){
  fire_point = ee.Feature(fire_point);
  true_end_date = ee.Date(true_end_date);
  
  var buffer_value = buffer || ee.Number(10000);
  var delay = time_delay || ee.Number(1440);//minutes. Put 0 to get all images
  print(delay);
  var AOI = ee.FeatureCollection(fire_point.buffer(buffer_value));
  print(AOI);
  Map.addLayer(AOI);
  
  var goes_16 = clip_to.clip_to(ee.ImageCollection("NOAA/GOES/16/FDCF")
  .filterDate(start_date,true_end_date)
  .filterBounds(AOI), AOI, 2000); 

  var goes_17 = clip_to.clip_to(ee.ImageCollection("NOAA/GOES/17/FDCF")
  .filterDate(start_date,true_end_date)
  .filterBounds(AOI), AOI, 2000);

  var toDate = function(element){
    return ee.Date(element);
  };
  
  if(delay === -1){
    print("caso 0");
    var datetimes = ee.List(goes_16.aggregate_array("system:time_start"))
    .map(toDate)
    .slice(1);
  }else{
    print("else");
  }
  
  //print(datetimes.filter(ee.Filter.gt("item",start_date.advance(,"day"))));
  var fire_mask_codes = [10, 30, 11, 31, 12, 32, 13, 33, 14, 34, 15, 35];
  var fire_probability = [1.0, 1.0, 0.9, 0.9, 0.8, 0.8, 0.5, 0.5, 0.3, 0.3, 0.1, 0.1];
    
  var default_value = 0;
    
  var remap_mask_to_probability = function(image){
    return image.remap(fire_mask_codes,
    fire_probability,
    default_value,
    "Mask")
    .select(["remapped"])
    .rename(["Fire_probability"]);
  };
    
  var circleIncrease = function(end_date){
    
    //print(goes_16);
    
    var fire_from_goes_16 = goes_16.filterDate(start_date,end_date)
    .map(remap_mask_to_probability);
    var fire_from_goes_17 = goes_17.filterDate(start_date,end_date)
    .map(remap_mask_to_probability);
    
    var fire_footprint_from_goes_16 = fire_from_goes_16
    .reduce(ee.Reducer.max());
    var fire_footprint_from_goes_17 = fire_from_goes_17
    .reduce(ee.Reducer.max());
    
    //Map.addLayer(fire_footprint_from_goes_16,{palette:['white', 'yellow', 'orange', 'red', 'purple']},"fire_footprint_from_goes_16",false);
    //Map.addLayer(fire_footprint_from_goes_17,{palette:['white', 'yellow', 'orange', 'red', 'purple']},"fire_footprint_from_goes_17",false);
    
    //print(fire_from_goes_16);
    var linked_collection_goes = ee.ImageCollection([fire_footprint_from_goes_16,fire_footprint_from_goes_17])
    .reduce(ee.Reducer.min());
    
    //Map.addLayer(linked_collection_goes,{palette:['white', 'yellow', 'orange', 'red', 'purple']},"linked_collection_goes",false);
    
    
    var smoothed = linked_collection_goes.reduceNeighborhood({
      reducer: ee.Reducer.mean(),
      kernel: ee.Kernel.circle(2000,"meters",true)
    });
    
    //Map.addLayer(smoothed,{palette:['white', 'yellow', 'orange', 'red', 'purple']});
    
    var fire_outline = smoothed.gt(0.6).reduceToVectors({
      scale: 200,
      bestEffort: true,
      geometry: AOI.geometry()
    }).filter(ee.Filter.eq("label",1));
    
    //Map.addLayer(fire_outline);
    
    return ee.Feature(fire_outline.geometry(),{"date": end_date});
    //return fire_outline.geometry();
  };
  
  var fire_outlines = ee.FeatureCollection(datetimes.map(circleIncrease));
  
  print(fire_outlines);
  
  return fire_outlines;
};