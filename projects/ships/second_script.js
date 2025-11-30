/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var geometry = /* color: #d63000 */ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[14.20900466282569, 40.786084250481686],
                  [14.135691916564474, 40.743289647094585],
                  [14.107580415995653, 40.70756589932686],
                  [14.304256959415769, 40.66275271887078],
                  [14.46865735986652, 40.7168122431099],
                  [14.30261578968376, 40.7939796560988],
                  [14.29597714365505, 40.80871725195902]]]),
            {
              "system:index": "0"
            })]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
var int_find_ships_s2 = require("users/emanuelespiritowork/SharedRepo:functions/int_find_ships_s2.js");

var imageCollection = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
.filterDate("2022-02-01","2022-03-28")
.filterBounds(geometry)
.filter(ee.Filter.lt("CLOUDY_PIXEL_PERCENTAGE",10));

print(imageCollection);

Map.addLayer(imageCollection.first());

var result = int_find_ships_s2.int_find_ships_s2(imageCollection,geometry);

Map.addLayer(result);

/*
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
*/

