/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var AOI = 
    /* color: #d63000 */
    /* shown: false */
    ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[8.990886027757705, 46.05491295025943],
                  [7.294491832012899, 44.43276432257844],
                  [8.099768202861982, 43.89006831524715],
                  [7.792135918056913, 42.198443761489735],
                  [10.853624609662628, 43.53364206362521],
                  [14.90656494643116, 43.87536601777763],
                  [14.319398372178568, 46.016240813574875],
                  [12.679506076175818, 47.31611898311429]]]),
            {
              "system:index": "0"
            })]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
var clip_to = require("users/emanuelespiritowork/SharedRepo:functions/clip_to.js");

var img_coll = ee.ImageCollection("NASA/VIIRS/002/VNP46A2")
.filterDate("2025-11-10");

var clip = clip_to.clip_to(img_coll,AOI,10).first();

var vect = ee.Image(clip).select(["Gap_Filled_DNB_BRDF_Corrected_NTL"])
.gt(ee.Image(40))
.reduceToVectors({
  bestEffort: true
})
.filter(ee.Filter.eq("label",1));

Map.addLayer(clip, {
  bands: "Gap_Filled_DNB_BRDF_Corrected_NTL",
  min:10,
  max:80
});

Map.addLayer(vect);