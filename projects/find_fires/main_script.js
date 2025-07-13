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

var masking = function(image){
  var cloudBit = 1 << 0;
  return image.select(["Coarse_Resolution_Internal_CM"])
  .bitwiseAnd(ee.Image(cloudBit))
  .eq(0);
}



//then we need a threshold based on:
// absolute value

print(data);

var n_data = data.size();
var list = data.toList(n_data);
print(list.get(1))
var number = 12;
Map.addLayer(data.select(["Coarse_Resolution_Brightness_Temperature_Band_21"]))
Map.addLayer(ee.Image(list.get(number)).clip(AOI).select(["Coarse_Resolution_Brightness_Temperature_Band_21"]),
{min: 330, max: 340}, "image");

var modis2 = ee.ImageCollection("MODIS/061/MOD14A1");
var fires = modis2.filterDate(start_date,end_date).filterBounds(AOI);
var list_fires = fires.toList(fires.size());
Map.addLayer(ee.Image(list_fires.get(number)).clip(AOI));


