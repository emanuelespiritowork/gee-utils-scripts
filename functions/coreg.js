// Load the two images to be registered.
//var image1 = ee.Image('SKYSAT/GEN-A/PUBLIC/ORTHO/MULTISPECTRAL/s01_20150502T082736Z');
//var image2 = ee.Image('SKYSAT/GEN-A/PUBLIC/ORTHO/MULTISPECTRAL/s01_20150305T081019Z');
var plot_map = require("users/emanuelespiritowork/SharedRepo:functions/plot_map.js");

exports.coreg = function(img_ref, img_tar, export_folder){
  img_ref = ee.Image(img_ref);
  img_tar = ee.Image(img_tar);
  
  var folder = export_folder || ee.String("GEE_Export");
  
  // Use bilinear resampling during registration.
var image1Orig = image1.resample('bilinear');
var image2Orig = image2.resample('bilinear');

var null_var_1 = plot_map.plot_map(image1, 2, 10);
var null_var_4 = plot_map.plot_map(image2.select("b52"), 2, 30);

// Choose to register using only the 'R' band.
var image1RedBand = image1Orig.select('b1');
var image2RedBand = image2Orig.select('b52');

// Determine the displacement by matching only the 'R' bands.
var displacement = image2RedBand.displacement({
  referenceImage: image1RedBand,
  maxOffset: 300.0,
  patchWidth: 128.0
});

Map.centerObject(image1.geometry());

// Use the computed displacement to register all original bands.
var registered = image2Orig.displace(displacement);

// Show the results of co-registering the images.
var null_var_2 = plot_map.plot_map(registered.select("b52"), 2, 30);

//register again
image2Orig = registered;

// Choose to register using only the 'R' band.
image1RedBand = image1Orig.select('b1');
image2RedBand = image2Orig.select('b52');

// Determine the displacement by matching only the 'R' bands.
displacement = image2RedBand.displacement({
  referenceImage: image1RedBand,
  maxOffset: 300.0,
  patchWidth: 128.0
});

registered = image2Orig.displace(displacement);

  return registered;
};

