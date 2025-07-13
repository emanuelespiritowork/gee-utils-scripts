/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var AOI = 
    /* color: #d63000 */
    /* shown: false */
    ee.Geometry.Polygon(
        [[[-122.5292681673177, 38.803602248022095],
          [-123.0071734407552, 38.9618162818189],
          [-123.1884478548177, 38.666484536918674],
          [-122.97530598359178, 38.485267257902436],
          [-122.62539853841145, 38.419440264845605],
          [-122.3205279329427, 38.65361625904314]]]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
var start_date = ee.Date("2019-10-23");
var end_date = ee.Date("2019-11-06");

var goes_16 = ee.ImageCollection("NOAA/GOES/16/FDCF")
.filterDate(start_date,end_date)
.filterBounds(AOI); 
var goes_17 = ee.ImageCollection("NOAA/GOES/17/FDCF")
.filterDate(start_date,end_date)
.filterBounds(AOI);
var modis = ee.ImageCollection("MODIS/061/MOD14A1")
.filterDate(start_date,end_date)
.filterBounds(AOI);

//var fire_mask_codes = ee.List([10,11,12,13,14,15,30,31,32,33,34,35]);

//var fire_probability = ee.List([1.0,0.9,0.8,0.5,0.3,0.1,1.0,0.9,0.8,0.5,0.3,0.1]);

var fire_mask_codes = [10, 30, 11, 31, 12, 32, 13, 33, 14, 34, 15, 35];
var fire_probability = [1.0, 1.0, 0.9, 0.9, 0.8, 0.8, 0.5, 0.5, 0.3, 0.3, 0.1, 0.1];

var default_value = 0;

var clipping = function(image){
  return image.clip(AOI);
};

var remap_mask_to_probability = function(image){
  return image.remap(fire_mask_codes,
  fire_probability,
  default_value,
  "Mask")
  .select(["remapped"])
  .rename(["Fire_probability"]);
};

//print(goes_16);

var fire_from_goes_16 = goes_16.map(clipping)
.map(remap_mask_to_probability);
var fire_from_goes_17 = goes_17.map(clipping)
.map(remap_mask_to_probability);

var fire_footprint_from_goes_16 = fire_from_goes_16
.reduce(ee.Reducer.max());
var fire_footprint_from_goes_17 = fire_from_goes_17
.reduce(ee.Reducer.max());

Map.addLayer(fire_footprint_from_goes_16,{palette:['white', 'yellow', 'orange', 'red', 'purple']});
Map.addLayer(fire_footprint_from_goes_17,{palette:['white', 'yellow', 'orange', 'red', 'purple']});

//print(fire_from_goes_16);
var linked_collection_goes = ee.ImageCollection([fire_footprint_from_goes_16,fire_footprint_from_goes_17])
.reduce(ee.Reducer.min());

Map.addLayer(linked_collection_goes,{palette:['white', 'yellow', 'orange', 'red', 'purple']},{},"linked_collection_goes",false);


var smoothed = linked_collection_goes.reduceNeighborhood({
  reducer: ee.Reducer.mean(),
  kernel: ee.Kernel.circle(2000,"meters",true)
});

Map.addLayer(smoothed,{palette:['white', 'yellow', 'orange', 'red', 'purple']});
