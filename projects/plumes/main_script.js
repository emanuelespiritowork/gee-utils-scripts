/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var AOI = 
    /* color: #bf04c2 */
    /* shown: false */
    ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[6.230007244228104, 49.409604249394256],
                  [6.2312947045552525, 49.41457424501059],
                  [6.228891445277909, 49.4202137428584],
                  [6.222711635707596, 49.42551762961715],
                  [6.212326122401932, 49.42507100862785],
                  [6.202112270473221, 49.41161464530498]]]),
            {
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[6.259618831752518, 49.421095910289594],
                  [6.249662471889237, 49.41713164973054],
                  [6.25781638729451, 49.4128878610378],
                  [6.264854503749588, 49.418080868036526]]]),
            {
              "system:index": "1"
            })]),
    AOI2 = 
    /* color: #d63000 */
    /* shown: false */
    ee.Geometry.Polygon(
        [[[54.199830615772676, 38.53412006327752],
          [54.16858824516721, 38.518810522372895],
          [54.1818061711926, 38.49355609544011],
          [54.25115736748166, 38.49355609544011],
          [54.2561355474133, 38.52109373071671]]]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
var s2_coll = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
.filter(ee.Filter.lt("CLOUDY_PIXEL_PERCENTAGE",30));
Map.centerObject(AOI2);

var clip_to = require("users/emanuelespiritowork/SharedRepo:functions/clip_to.js");
var s2_scale = require("users/emanuelespiritowork/SharedRepo:functions/s2_scale.js");
var mosaic_recent = require("users/emanuelespiritowork/SharedRepo:functions/mosaic_recent.js");
var plot_stretch = require("users/emanuelespiritowork/SharedRepo:functions/plot_stretch.js");
var plot_map = require("users/emanuelespiritowork/SharedRepo:functions/plot_map.js");

var clip = clip_to.clip_to(s2_coll, AOI2, 10);

var scale = s2_scale.s2_scale(clip);

//var mosaic = mosaic_recent.mosaic_recent(s2_coll, AOI, 10);

//var null_var = plot_stretch.plot_stretch(mosaic, ["B4","B3","B2"], 2, 10);
var null_var = plot_stretch.plot_stretch(clip.first(), ["B4","B3","B2"], 2, 10);
//var null_var_2 = plot_map.plot_map(scale.first().select("B1"),2,10);


var int_find_plumes = require("users/emanuelespiritowork/SharedRepo:functions/int_find_plumes.js");

var score = int_find_plumes.int_find_plumes(scale, AOI2, 10, "B1", 0.2);

print(score);

var null_var_3 = plot_map.plot_map(score,0.5,10);









/*

//I will not use SCL mask because for small areas it is not reliable

//For this reason in each image I will consider a total amount of 100
//and this will be distributed among all pixels that have in 
//each B band a surface reflectance greater than 0.5, mimicing cloud

//any little cloud pixel will receive a medium score but clouds move (except for 
//Fantozzi) so in other image that pixel should not be covered

//any big cloud pixel will receive a small score because the full score
//is shared between many pixels

//then I will reduce over the image collection the score layer to see
//which pixels have the greatest amount. This way I could consider 
//to highlight pixels whose score is greater than 50*size(img_coll) 

var b1_threshold = 0.2;

var give_score_to_pixel = function(image){
  var time_start = image.get("system:time_start");
  var footprint = image.get("system:footprint");
  
  var num_pixel = image.select("B1").gt(b1_threshold).reduceRegion({
    reducer: ee.Reducer.sum(),
    bestEffort: true,
    scale: 10
  }).getNumber("B1");
  
  var score = ee.Number(100).divide(ee.Number(num_pixel)).float();
  
  return ee.Image(score).mask(image.select("B1").gt(b1_threshold))
  .unmask(ee.Number(0)).rename("score").float()
  .set({
    "system:time_start": time_start,
    "system:footprint": footprint
  });
};

//Map.addLayer(scale.first().select("B1").gt(b1_threshold));

var scored = scale.map(give_score_to_pixel);

print(scored);

Map.addLayer(scored.first().geometry());

var clip_scored = clip_to.clip_to(scored, AOI, 10);

print(clip_scored);

var null_var_2 = plot_map.plot_map(clip_scored.first(), 2, 10);

var footprint = AOI.geometry();

var first_time = clip_scored.sort("system:time_start",true)
.first()
.get("system:time_start");
print(first_time);

var last_time = clip_scored.sort("system:time_start",false)
.first()
.get("system:time_start");
print(last_time);

var final_score = clip_scored.reduce({
  reducer: ee.Reducer.sum()
}).set({
  "system:footprint": footprint,
  "system:time_start": first_time,
  "system:time_end": last_time
});

print(final_score);

Map.addLayer(final_score);
Map.addLayer(final_score.geometry());
*/
/*
var clip_final = clip_to.clip_to(ee.ImageCollection(final_score), AOI, 10).first();

var null_var_3 = plot_map.plot_map(clip_final,2,10);
*/