/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var polygon = /* color: #d63000 */ee.Geometry.Polygon(
        [[[8.619558853060715, 45.69066599975398],
          [7.317554530515617, 45.30945994676962],
          [7.427430241138058, 44.785476448834686],
          [9.976500184830863, 45.375102432766816],
          [9.410651067388873, 45.69833990530621]]]),
    transect = /* color: #98ff00 */ee.Geometry.LineString(
        [[7.686130035103118, 45.06011833901485],
         [8.592502105415617, 45.45067304281468],
         [9.213229644478117, 45.46608526140708]]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
var bands = ['B.*'];

var image_coll = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED");
/*
var recent_mosaic_img_coll = require('users/emanuelespiritowork/SharedRepo:functions/recent_mosaic_img_coll');

var img = recent_mosaic_img_coll.recent_mosaic_img_coll(image_coll,polygon,100);
*/
print(image_coll.first());
print(ee.ImageCollection(image_coll.first()));
print(ee.ImageCollection(ee.ImageCollection(image_coll.first())));
/*
Map.addLayer(img);

var transect_create_slice_img = require('users/emanuelespiritowork/SharedRepo:functions/transect_create_slice_img');

var slice = transect_create_slice_img.transect_create_slice_img(img.select(["B3","B4","B2"]),transect,100);

print(slice);

var transect_get_plot_ts = require('users/emanuelespiritowork/SharedRepo:functions/transect_get_plot_ts');

var plot = transect_get_plot_ts.transect_get_plot_ts(slice);

print(plot);
*/
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

