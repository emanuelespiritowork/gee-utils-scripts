/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var AOI = /* color: #d63000 */ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[-73.22734375000002, 49.756348892369594],
                  [-74.72148437500002, 47.669003292699315],
                  [-73.11748046875002, 47.80200338539278]]]),
            {
              "system:index": "0"
            })]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
var s2_coll = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED");

var mosaic_date = require("users/emanuelespiritowork/SharedRepo:functions/mosaic_date.js");
/*var mosaic_recent = require("users/emanuelespiritowork/SharedRepo:functions/mosaic_recent.js");
var mosaic = mosaic_recent.mosaic_recent(s2_coll,AOI,100);
print("mosaic",mosaic);
*/
var clip_to = require("users/emanuelespiritowork/SharedRepo:functions/clip_to.js");

var clipped = clip_to.clip_to(s2_coll,AOI,100);
print(clipped);
//var mosaic = mosaic_date.mosaic_date(s2_coll,AOI,"2023-12-10","2024-12-31",100);

//Map.addLayer(mosaic);
Map.addLayer(clipped);