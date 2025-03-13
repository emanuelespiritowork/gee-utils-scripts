/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var AOI = 
    /* color: #d63000 */
    /* shown: false */
    ee.Geometry.Polygon(
        [[[-50.782671292638184, -11.609685756929462],
          [-50.7778647740835, -11.655250516519137],
          [-50.707483609532716, -11.649870564495261],
          [-50.71761163077295, -11.6034641597931]]]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
var s2_coll = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED");

var mosaic_recent_without_clouds = require("users/emanuelespiritowork/SharedRepo:functions/mosaic_recent_without_clouds.js");
var plot_stretch = require("users/emanuelespiritowork/SharedRepo:functions/plot_stretch.js");
var int_find_objects = require("users/emanuelespiritowork/SharedRepo:functions/int_find_objects.js");

var mosaic = mosaic_recent_without_clouds.mosaic_recent_without_clouds(s2_coll,AOI,"CLOUDY_PIXEL_PERCENTAGE",20,10);

var null_var = plot_stretch.plot_stretch(mosaic,undefined,2,10);

var sample = mosaic.sample({
    scale: 5,
    region: mosaic.geometry(),
    numPixels: 100,
    seed: 15,
    geometries: true,
    projection: mosaic.projection(),
    dropNulls: false
  });
  
  print(mosaic.projection());
  
print(sample);

//var fields = int_find_objects.int_find_objects(mosaic,1000,10);

//Map.addLayer(fields);
