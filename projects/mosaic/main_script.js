/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var AOI = /* color: #d63000 */ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[-73.22734375000002, 49.756348892369594],
                  [-78.67656250000002, 47.609783081064904],
                  [-72.87578125000002, 48.37441449527142]]]),
            {
              "system:index": "0"
            })]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
var s2_coll = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED");

var mosaic_date = require("users/emanuelespiritowork/SharedRepo:functions/mosaic_date.js");

var mosaic = mosaic_date.mosaic_date(s2_coll,AOI,"2023-12-10","2024-12-31",100);

Map.addLayer(mosaic);