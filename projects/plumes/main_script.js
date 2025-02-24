/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var AOI = 
    /* color: #bf04c2 */
    /* shown: false */
    ee.Geometry.Polygon(
        [[[6.230007244228104, 49.409604249394256],
          [6.2312947045552525, 49.41457424501059],
          [6.228891445277909, 49.4202137428584],
          [6.222711635707596, 49.42551762961715],
          [6.212326122401932, 49.42507100862785],
          [6.202112270473221, 49.41161464530498]]]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
var s2_coll = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
.filter(ee.Filter.lt("CLOUDY_PIXEL_PERCENTAGE",30));

var clip_to = require("users/emanuelespiritowork/SharedRepo:functions/clip_to.js");
var s2_scale = require("users/emanuelespiritowork/SharedRepo:functions/s2_scale.js");
var mosaic_recent = require("users/emanuelespiritowork/SharedRepo:functions/mosaic_recent.js");
var plot_stretch = require("users/emanuelespiritowork/SharedRepo:functions/plot_stretch.js");
var plot_map = require("users/emanuelespiritowork/SharedRepo:functions/plot_map.js");

var clip = clip_to.clip_to(s2_coll, AOI, 10);

var scale = s2_scale.s2_scale(clip);

//var mosaic = mosaic_recent.mosaic_recent(s2_coll, AOI, 10);

//var null_var = plot_stretch.plot_stretch(mosaic, ["B4","B3","B2"], 2, 10);
var null_var = plot_stretch.plot_stretch(clip.first(), ["B4","B3","B2"], 2, 10);
var null_var_2 = plot_map.plot_map(scale.first().select("B1"),2,10);

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
  var num_pixel = image.select("B1").gt(b1_threshold).reduceRegion({
    reducer: "sum",
    bestEffort: true,
    scale: 10
  }).getNumber("B1");
  
  var score = ee.Number(100).divide(ee.Number(num_pixel));
  
  return ee.Image(score).mask(image.select("B1").gt(b1_threshold))
  .unmask(0).rename("score");
};

Map.addLayer(scale.first().select("B1").gt(b1_threshold));

var scored = scale.map(give_score_to_pixel);

var clip_scored = clip_to.clip_to(scored, AOI, 10); 

var null_var_2 = plot_map.plot_map(clip_scored.first(), 2, 10);
