/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var AOI = 
    /* color: #d63000 */
    /* shown: false */
    ee.Geometry.MultiPolygon(
        [[[[10.321288645606725, 46.159536816328036],
           [10.277000010352818, 46.09981577685726],
           [10.348754465919225, 46.0945781768611],
           [10.378280222755162, 46.15644528477129]]],
         [[[9.904879190037388, 46.183435263701746],
           [9.911745645115513, 46.143487138009405],
           [10.101946450779575, 46.1444386209695],
           [10.219362832615513, 46.224304484240285],
           [10.1747308746077, 46.242353292117635],
           [10.076540566990513, 46.182009044416944]]]]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
var s2_coll = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED");
var dem = ee.Image("CGIAR/SRTM90_V4").clip(AOI);

var clip_to = require("users/emanuelespiritowork/SharedRepo:functions/clip_to.js");
var mosaic_recent = require("users/emanuelespiritowork/SharedRepo:functions/mosaic_recent.js");
var plot_stretch = require("users/emanuelespiritowork/SharedRepo:functions/plot_stretch.js");


//var dem_clip = clip_to.clip_to(ee.ImageCollection(dem),AOI,10);
var mosaic = mosaic_recent.mosaic_recent(s2_coll,AOI,10);
var null_var = plot_stretch.plot_stretch(mosaic,undefined,2,10);

Map.addLayer(dem);


//Map.addLayer(mosaic);

//a prairie has to be with small slope
var slope = ee.Terrain.slope(dem);

Map.addLayer(slope);

//a prairie has a great elevation

//a prairie has grass



