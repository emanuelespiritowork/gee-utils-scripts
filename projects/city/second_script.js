/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var AOI = /* color: #d63000 */ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[8.692730375494353, 45.56747346369177],
                  [7.671001859869353, 45.47510340877478],
                  [8.26187188508769, 45.04980012199874],
                  [9.32754571321269, 45.220303768802495],
                  [9.961430380441673, 45.698243483986865]]]),
            {
              "system:index": "0"
            })]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
var 

var img_coll = ee.ImageCollection("NASA/VIIRS/002/VNP46A2");

Map.addLayer(img_coll);