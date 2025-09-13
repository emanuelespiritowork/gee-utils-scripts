/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var geometry = 
    /* color: #d63000 */
    /* shown: false */
    ee.Geometry.Polygon(
        [[[13.814808499511985, 40.82459389976943],
          [13.741453302338433, 40.7817992273174],
          [13.713325615445724, 40.74607543633415],
          [13.918360395526081, 40.64707087091379],
          [14.010716533311589, 40.73554218136648],
          [13.90847396976539, 40.83248930186906],
          [13.901831482451406, 40.847226901367236]]]),
    imageCollection = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED");
/***** End of imports. If edited, may not auto-convert in the playground. *****/
var imageCollection = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED");
Map.addLayer(imageCollection.filterBounds(geometry).first());
Map.addLayer(imageCollection.filterBounds(geometry).first().normalizedDifference(["B8","B4"]));
Map.addLayer(imageCollection.filterBounds(geometry).first().normalizedDifference(["B8","B4"]));
var mask_1 = imageCollection.filterBounds(geometry).first().normalizedDifference(["B8","B4"]).lt(-0.15);
var mask_2 = imageCollection.filterBounds(geometry).first().normalizedDifference(["B8","B4"]).gt(-0.4);
var mask = mask_2.and(mask_1);
Map.addLayer(mask);

var image = mask.clip(geometry);
// Define a kernel.
var kernel = ee.Kernel.circle({radius: 1});

// Perform an erosion followed by a dilation, display.
var opened = image
             .focalMin({kernel: kernel, iterations: 1
             })
             .focalMax({kernel: kernel, iterations: 1});
Map.addLayer(opened, {}, 'opened');

var ships = opened.reduceToVectors({
  bestEffort: true
}).filter(ee.Filter.eq("label",1));

print(ships);


Map.addLayer(ships,{},"ships");
Map.centerObject(ships.first());
