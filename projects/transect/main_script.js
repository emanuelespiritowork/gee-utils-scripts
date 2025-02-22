/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var polygon = /* color: #d63000 */ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[8.619558853060715, 45.69066599975398],
                  [7.317554530515617, 45.30945994676962],
                  [7.427430241138058, 44.785476448834686],
                  [9.976500184830863, 45.375102432766816],
                  [9.410651067388873, 45.69833990530621]]]),
            {
              "system:index": "0"
            })]),
    transect = /* color: #98ff00 */ee.Geometry.LineString(
        [[7.686130035103118, 45.06011833901485],
         [8.592502105415617, 45.45067304281468],
         [9.213229644478117, 45.46608526140708]]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
var bands = ['B.*'];

var image_coll = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED");

var mosaic_recent = require('users/emanuelespiritowork/SharedRepo:functions/mosaic_recent.js');

//var img = mosaic_recent.mosaic_recent(image_coll,polygon,100);
var img = ee.Image("CGIAR/SRTM90_V4")
Map.centerObject(polygon);

var transect_create_slice = require('users/emanuelespiritowork/SharedRepo:functions/transect_create_slice.js');

var slice = transect_create_slice.transect_create_slice(img,transect,100);

print(slice);

var transect_get_plot = require('users/emanuelespiritowork/SharedRepo:functions/transect_get_plot.js');

var plot = transect_get_plot.transect_get_plot(slice);

print(plot);

//var s2_mask_img_coll = require('users/emanuelespiritowork/SharedRepo:function/s2_mask_img_coll');
/*
var s2_mosaic_img_coll = require('users/emanuelespiritowork/SharedRepo:functions/s2_mosaic_img_coll'); 

var elevImg_coll = s2_mosaic_img_coll.s2_mosaic_img_coll(ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
.filterBounds(transect.transect));
//print(s2_mosaic_img_coll);

var elevImg = elevImg_coll.select(bands);
print(elevImg);

var elevImg_band_names = elevImg.first().bandNames();

.mosaic()
.select(bands);

print(elevImg);

var profile = transect_create_slice_img.transect_create_slice_img(elevImg);

var transect_get_plot_ts = require('users/emanuelespiritowork/SharedRepo:functions/transect_get_plot_ts');

var plot = transect_get_plot_ts.transect_get_plot_ts(profile);

print(profile);

print(plot);
*/

