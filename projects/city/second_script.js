/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var AOI = 
    /* color: #d63000 */
    /* shown: false */
    ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[8.681744047369353, 46.07660913689732],
                  [7.671001859869353, 45.47510340877478],
                  [8.26187188508769, 45.04980012199874],
                  [9.32754571321269, 45.220303768802495],
                  [9.961430380441673, 45.698243483986865],
                  [9.625890489815431, 45.95035421455632]]]),
            {
              "system:index": "0"
            })]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
var clip_to = require("users/emanuelespiritowork/SharedRepo:functions/clip_to.js");

var img_coll = ee.ImageCollection("NASA/VIIRS/002/VNP46A2")
.filterDate("2025-11-10");

var clip = clip_to.clip_to(img_coll,AOI,10);

Map.addLayer(clip, {
  bands: "Gap_Filled_DNB_BRDF_Corrected_NTL",
  min:10,
  max:80
});