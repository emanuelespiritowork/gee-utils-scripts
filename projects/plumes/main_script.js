/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var AOI = /* color: #bf04c2 */ee.Geometry.Polygon(
        [[[4.745659352379166, 45.40812919591864],
          [4.75454282863649, 45.39921036585018],
          [4.765572072105728, 45.40318785590885],
          [4.761409283714615, 45.41147339418627],
          [4.756184416851452, 45.414272008216614]]]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
var s2_coll = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
.filter(ee.Filter.lt("CLOUDY_PIXEL_PERCENTAGE",50));

var clip_to = require("users/emanuelespiritowork/SharedRepo:functions/clip_to.js");
var s2_scale = require("users/emanuelespiritowork/SharedRepo:functions/s2_scale.js");
var mosaic_recent = require("users/emanuelespiritowork/SharedRepo:functions/mosaic_recent.js");
var plot_stretch = require("users/emanuelespiritowork/SharedRepo:functions/plot_stretch.js");

var clip = clip_to.clip_to(s2_coll, AOI, 10);

var scale = s2_scale.s2_scale(clip);

var mosaic = mosaic_recent.mosaic_recent(s2_coll, AOI, 10);

var null_var = plot_stretch.plot_stretch(mosaic, ["B4","B3","B2"], 2, 10);

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

