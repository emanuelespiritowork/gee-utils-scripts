/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var imageCollection = ee.ImageCollection("projects/ee-emanuelespiritowork/assets/Tinitaly_DTM");
/***** End of imports. If edited, may not auto-convert in the playground. *****/
//Map.addLayer(imageCollection);

var mosaic_to = require("users/emanuelespiritowork/SharedRepo:functions/mosaic_to.js");

//var mosaic = mosaic_to.mosaic_to(imageCollection);

var mosaic = imageCollection.union().first();

print(mosaic);
Map.addLayer(imageCollection);

var filled = imageCollection.mosaic()
.not()
.clip(mosaic.geometry());

var beach = filled.reduceToVectors({
  scale: 10,
  bestEffort: true
});

Map.addLayer(beach);
print(beach);
Export.table.toDrive({
  collection: beach,
  description: "Italy_shapefile",
  fileFormat: "SHP",
  folder: "Tinitaly",
  priority: 99
})

var clip_to = require("users/emanuelespiritowork/SharedRepo:functions/mosaic_to.js");

var CopernicusItaly_DSM = ee.ImageCollection("COPERNICUS/DEM/GLO30")
.filterBounds(beach)
.map(function(image){
  return image.clip(beach);
});

Map.addLayer(CopernicusItaly_DSM);
