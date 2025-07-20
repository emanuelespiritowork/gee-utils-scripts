/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var AOI = 
    /* color: #d63000 */
    /* shown: false */
    ee.Geometry.Polygon(
        [[[-122.94694738910269, 34.491463540085995],
          [-110.99377885625711, 23.170745575952694],
          [-108.44499426410269, 23.446445704452273],
          [-114.94890051410269, 31.619081675469026],
          [-114.24577551410269, 34.34645700473052],
          [-120.04655676410269, 39.0646900361849],
          [-119.95866613910269, 42.00304411817351],
          [-124.44108801410269, 42.06832293264994]]]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
var modis = ee.ImageCollection("MODIS/061/MOD09CMG");

var start_date = ee.Date("2012-08-04");
var end_date = ee.Date("2012-09-05");

var data = modis.filterDate(start_date,end_date).filterBounds(AOI);

//here we need a cloud mask
var clipping = function(image){
  return image.clip(AOI);
};

var clipper = data.map(clipping);

var masking = function(image){
  //var cloudBit = 1 << 0;
  //var shadowBit = 1 << 8;
  
  //var cloudMask = image.select(["Coarse_Resolution_Internal_CM"])
  //.bitwiseAnd(cloudBit)
  //.neq(0);
  
  //var shadowMask = image.select(["Coarse_Resolution_Internal_CM"])
  //.bitwiseAnd(shadowBit)
  //.neq(0); 
  
  //var oppositeMask = cloudMask.or(shadowMask);
  
  //var fullMask = oppositeMask.eq(0);
  
  var clearBit = 1 << 1;
  
  var clearMask = image.select(["Coarse_Resolution_Internal_CM"])
  .bitwiseAnd(clearBit)
  .neq(0);
  
  var oppositeMask = clearMask;
  
  var fullMask = oppositeMask.eq(0);
  
  return image.updateMask(oppositeMask);
};

var masked = clipper.map(masking);

//is masking helpful for 4micron and 11micron bands?

//then we need a threshold based on:
// absolute value

print(masked);

var n_data = masked.size();
var list = masked.toList(n_data);
print(list.get(1))
var number = 10;

var list_not_masked = clipper.toList(clipper.size());
Map.addLayer(clipper.select(["Coarse_Resolution_Brightness_Temperature_Band_21"]),{},"coarse",false)
Map.addLayer(ee.Image(list_not_masked.get(number)).clip(AOI),
{bands: ["Coarse_Resolution_Surface_Reflectance_Band_1",
"Coarse_Resolution_Surface_Reflectance_Band_4",
"Coarse_Resolution_Surface_Reflectance_Band_3"]}, "image", false)
Map.addLayer(ee.Image(list_not_masked.get(number)).clip(AOI).select(["Coarse_Resolution_Brightness_Temperature_Band_21"]),
{min: 330, max: 331}, "image");

var points = ee.Image(list_not_masked.get(number))
.clip(AOI)
.select(["Coarse_Resolution_Brightness_Temperature_Band_21"])
.gt(334)
.reduceToVectors()
.filter(ee.Filter.eq("label",1));

print(points);

Map.addLayer(points,{},"points");

var int_find_fires = require("users/emanuelespiritowork/SharedRepo:functions/int_find_fires.js");

var masked = int_find_fires.int_find_fires("2012-08-05",AOI,334);



var modis2 = ee.ImageCollection("MODIS/061/MOD14A1");
var fires = modis2.filterDate(start_date,end_date).filterBounds(AOI);
var list_fires = fires.toList(fires.size());
Map.addLayer(ee.Image(list_fires.get(number)).clip(AOI));


