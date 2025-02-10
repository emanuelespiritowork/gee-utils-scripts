/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var AOI = ee.FeatureCollection("projects/ee-emanuelespiritowork/assets/Lomellina");
/***** End of imports. If edited, may not auto-convert in the playground. *****/
// This script is for accessing satellite S2
// created by Nutini 
// date 15/05/2023
// changes: update UNIMI LAB 2024/25
 
//Map.addLayer(table, {color: 'yellow'});
 
//var style = {color:'black', fillColor:'00000000'};
//Map.addLayer(table2.style(style), {}, 'region', true);

var s2_evi = require("users/emanuelespiritowork/SharedRepo:functions/s2_evi.js");
 
//Display the shapefile into the interactive map
Map.addLayer(AOI);
//Display the view to the center of the screen and scale the view
Map.centerObject(AOI,20);
//Define styling and determine the color of the shapefile 
var styling = {color: 'black', fillColor: 'f2e1ad'};
Map.addLayer(AOI.style(styling));
 
 
// Filter and export  
var RemoteCfarms = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")//get collection
  .filterDate("2021-01-01","2025-01-01")//period
  //.filterMetadata('CLOUDY_PIXEL_PERCENTAGE', 'less_than', 100) //cloud cover filtering
  .filterBounds(AOI)//around AOI
  //.filterMetadata('MGRS_TILE', 'equals', '32TQQ') // force Filter by tile ID
  //.select(['B1','B2','B3','B4','B5','B6','B7','B8','B9','B11','B12'])
  .map(function(image){return image.clip(AOI)}); //masking
print(RemoteCfarms); //see result
 
//var evi = s2_evi.s2_evi(RemoteCfarms);

var evi = RemoteCfarms.select("SCL");
 
// Convert collection to list and then plot the image
var RemoteCfarms_list = evi.toList(evi.size());
print(RemoteCfarms_list, 'list');
var imgS2_1 = ee.Image(RemoteCfarms_list.get(0));//0 = first element
 
//var bandsToDisplay = ['B8', 'B4', 'B3']; 
Map.addLayer(imgS2_1, {
  //bands: bandsToDisplay, 
  min: -1, 
  max: 1} , 'S2 image PRE');//plot
 
 
var stackedImageRemoteCfarms = evi.toBands().int16();//stack all BOA
print(stackedImageRemoteCfarms, 'stack');
 
Export.image.toDrive({
  image: stackedImageRemoteCfarms.unmask(-9999),
  description: 'S2_export',
  folder: 'Exports_sen2rts',
  scale: 10,
  region: AOI
});
 
 
 
//esporta tabella +++++++++++++++++++++++++++++++++++++++++++++++
 
 
// Get band names from the first image in the collection
var firstImage = ee.Image(evi.first());
var bandNamesFirstImage = firstImage.bandNames();
print('Band names of the first image:', bandNamesFirstImage);
 
// Export band names of the first image as a table
var bandNamesFirstImageFC = ee.FeatureCollection([ee.Feature(null, { 'BandNames': bandNamesFirstImage })]);
Export.table.toDrive({
  collection: bandNamesFirstImageFC,
  description: 'bands_number',
  folder: 'Exports_sen2rts',
  fileFormat: 'CSV'
});
 
// Create a table with all features from the image collection
var allFeaturesCollection = evi.map(function(image) {
  return ee.Feature(null, {'system:index': image.id()});
});
 
// Export all features from the image collection as a table
Export.table.toDrive({
  collection: allFeaturesCollection,
  description: 'date_list',
  folder: 'Exports_sen2rts',
  fileFormat: 'CSV'
});