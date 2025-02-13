/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var AOI = /* color: #d63000 */ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[-73.70132431186397, 49.24519193518415],
                  [-79.12857040561397, 47.30044038568054],
                  [-73.54751571811397, 46.55014521497358]]]),
            {
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-84.64255787130436, 45.34202109323244],
                  [-86.18064380880436, 44.12457386688757],
                  [-85.96091724630436, 42.3316569741353],
                  [-83.71970630880436, 42.3641355574562],
                  [-83.80759693380436, 45.06334673652873]]]),
            {
              "system:index": "1"
            })]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
var s2_coll = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED");

var mosaic_date = require("users/emanuelespiritowork/SharedRepo:functions/mosaic_date.js");
var plot_stretch = require("users/emanuelespiritowork/SharedRepo:functions/plot_stretch.js");
var mosaic_recent = require("users/emanuelespiritowork/SharedRepo:functions/mosaic_recent.js");
var mosaic = mosaic_recent.mosaic_recent(s2_coll,AOI,100);


//var clip_to = require("users/emanuelespiritowork/SharedRepo:functions/clip_to.js");
//var clipped = clip_to.clip_to(s2_coll,AOI,100);
//print(clipped);
//Map.addLayer(clipped);

//var mosaic = mosaic_date.mosaic_date(s2_coll,AOI,"2024-12-10","2024-12-31",100);
var null_var = plot_stretch.plot_stretch(mosaic,undefined,2,10);
