/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var AOI = /* color: #d63000 */ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[11.929377819681559, 44.85224712449804],
                  [11.914963016911566, 44.845677357265345],
                  [11.921827208535934, 44.839836934065524],
                  [11.938301269209827, 44.84713737048394]]]),
            {
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[11.969202245924944, 44.86076769643291],
                  [11.960961455856289, 44.849570855298225],
                  [11.995984816012683, 44.85224855880936],
                  [11.99186442127358, 44.86320150421432]]]),
            {
              "system:index": "1"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[11.927662999865493, 44.88290554291496],
                  [11.912217982911748, 44.87512292122571],
                  [11.925946886586729, 44.867095988053],
                  [11.94859957792945, 44.8765822434875]]]),
            {
              "system:index": "2"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[11.968173476921349, 44.87658333298683],
                  [11.965769902990402, 44.86830985515404],
                  [11.982938290079979, 44.870500009127205],
                  [11.98225155480893, 44.87682665255444]]]),
            {
              "system:index": "3"
            })]),
    points = /* color: #98ff00 */ee.Geometry.MultiPoint(
        [[11.941557375460995, 44.84239312143234],
         [11.924047915011776, 44.86040432629084],
         [11.95391699460162, 44.8788964574381],
         [11.953573671847714, 44.86235114619167],
         [11.970053164035214, 44.83849806627663]]),
    image = ee.Image("projects/ee-emanuelespiritowork/assets/PRISMA/zonal_statistics");
/***** End of imports. If edited, may not auto-convert in the playground. *****/
var zonal_statistics = require("users/emanuelespiritowork/SharedRepo:functions/zonal_statistics.js");
var zonal_statistics_with_buffer = require("users/emanuelespiritowork/SharedRepo:functions/zonal_statistics_with_buffer.js");

print(zonal_statistics.zonal_statistics(image,AOI,ee.Reducer.mean(),30));

Map.addLayer(image);
Map.centerObject(image);