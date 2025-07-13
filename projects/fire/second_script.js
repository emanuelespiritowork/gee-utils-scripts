/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var AOI = /* color: #d63000 */ee.Geometry.Polygon(
        [[[-122.5292681673177, 38.803602248022095],
          [-122.80667295247395, 38.84639753602201],
          [-122.91104306966145, 38.666484536918674],
          [-122.68582334309895, 38.50546494685258],
          [-122.3205279329427, 38.65361625904314]]]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
var start_date = ee.Date("2019-10-25");
var end_date = ee.Date("2019-10-28");

var goes_16 = ee.ImageCollection("NOAA/GOES/16/FDCF")
.filterDate(start_date,end_date)
.filterBounds(AOI); 
var goes_17 = ee.ImageCollection("NOAA/GOES/17/FDCF")
.filterDate(start_date,end_date)
.filterBounds(AOI);
var modis = ee.ImageCollection("MODIS/061/MOD14A1");