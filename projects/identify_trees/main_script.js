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

var mosaic = mosaic_recent_without_clouds.mosaic_recent_without_clouds(s2_coll,AOI,"CLOUDY_PIXEL_PERCENTAGE",20,10)
.select(["B.*"])
.select(["B2","B3","B4"]);

var null_var = plot_stretch.plot_stretch(mosaic,undefined,2,10);

var fields = int_find_objects.int_find_objects(mosaic,1000,10);

print(fields.select("classification"));
Map.addLayer(fields.select("classification"),{min: 1, max:10, palette: ["green","blue"]});
Map.addLayer(fields.select("clusters"));
