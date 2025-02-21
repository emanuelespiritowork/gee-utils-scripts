/******************************************************
 * Author: Emanuele Spirito
 * Copyright: 2025
 * See latest stable version on my GitHub at 
 * https://github.com/emanuelespiritowork/gee-utils-scripts
*******************************************************/

/******************************************************
 * PURPOSE OF THIS SCRIPT
 * Input: ee.Image
 * Output: plot classification map
*******************************************************/

exports.plot_class = function(img, scale_to_use){
  
  img = ee.Image(img);
  scale_to_use = ee.Number(scale_to_use);
  
  //see https://developers.google.com/earth-engine/datasets/catalog/MODIS_061_MCD12C1#bands
  var igbpPalette = [
  'aec3d4', // water
  '152106', '225129', '369b47', '30eb5b', '387242', // forest
  '6a2325', 'c3aa69', 'b76031', 'd9903d', '91af40',  // shrub, grass
  '111149', // wetlands
  'cdb33b', // croplands
  'cc0013', // urban
  '33280d', // crop mosaic
  'd7cdcc', // snow and ice
  'f7e084', // barren
  '6f6f6f',  // tundra
  ];
  
  var band_name = img.bandNames();
  
  var min = img.reduceRegion({
    reducer: ee.Reducer.min(),
    scale: scale_to_use,
    bestEffort: true
  }).getNumber(band_name.getString(0));
  
  print(min);
  
  var max = img.reduceRegion({
    reducer: ee.Reducer.max(),
    scale: scale_to_use,
    bestEffort: true
  }).getNumber(band_name.getString(0));
  
  var range = max.subtract(min);
  
  Map.addLayer(img, {min: min.getInfo(), 
  max: max.getInfo(), 
  palette: igbpPalette.slice(1,range).getInfo()}, "classification");
  
  return 0;
};






