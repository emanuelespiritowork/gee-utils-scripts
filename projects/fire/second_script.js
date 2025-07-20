/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var AOI = 
    /* color: #d63000 */
    /* shown: false */
    ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[-122.5292681673177, 38.803602248022095],
                  [-123.0071734407552, 38.9618162818189],
                  [-123.1884478548177, 38.666484536918674],
                  [-122.97530598359178, 38.485267257902436],
                  [-122.62539853841145, 38.419440264845605],
                  [-122.3205279329427, 38.65361625904314]]]),
            {
              "system:index": "0"
            })]),
    geometry = /* color: #d63000 */ee.Geometry.Point([-122.79568662434895, 38.697144801961485]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
var start_date = ee.Date("2019-10-24");
var true_end_date = ee.Date("2019-10-26");

/*
var clipping = function(image){
  return image.clip(AOI);
};

Map.centerObject(AOI);
Map.addLayer(AOI);
  
var goes_16 = ee.ImageCollection("NOAA/GOES/16/FDCF")
.filterDate(start_date,true_end_date)
.filterBounds(AOI)
.map(clipping); 

var goes_17 = ee.ImageCollection("NOAA/GOES/17/FDCF")
.filterDate(start_date,true_end_date)
.filterBounds(AOI)
.map(clipping);

var toDate = function(element){
  return ee.Date(element);
};

var datetimes = ee.List(goes_16.aggregate_array("system:time_start")).map(toDate)
.slice(1);

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

*/

var int_find_fire_outline = require("users/emanuelespiritowork/SharedRepo:functions/int_find_fire_outline.js");


