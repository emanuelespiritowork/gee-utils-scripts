/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var AOI = /* color: #d63000 */ee.Geometry.Polygon(
        [[[10.321288645606725, 46.159536816328036],
          [10.277000010352818, 46.09981577685726],
          [10.348754465919225, 46.0945781768611],
          [10.378280222755162, 46.15644528477129]]]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
var s2_coll = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED");
var dem = ee.Image("CGIAR/SRTM90_V4");

var clip_to = require("users/emanuelespiritowork/SharedRepo:functions/clip_to.js");

var s2_clip = clip_to.clip_to(s2_coll,AOI,10);
var dem_clip = clip_to.clip_to(dem,AOI,10);

Map.addLayer(dem_clip);
