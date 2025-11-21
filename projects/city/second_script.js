/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var AOI = /* color: #d63000 */ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[8.681744047369353, 46.07660913689732],
                  [6.110943266119353, 45.42886151142696],
                  [6.96548516633769, 43.74683903229547],
                  [10.64590508821269, 43.7309638344609],
                  [14.268071005441673, 45.42132371996559],
                  [13.229406114815431, 46.23986064802451],
                  [10.494688167826327, 46.47034415792573]]]),
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