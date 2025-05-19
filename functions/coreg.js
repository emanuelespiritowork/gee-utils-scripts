/******************************************************
 * Author: Emanuele Spirito
 * Copyright: 2025
 * See latest stable version on my GitHub at 
 * https://github.com/emanuelespiritowork/gee-utils-scripts
*******************************************************/

/******************************************************
 * PURPOSE OF THIS SCRIPT
 * Input: ee.Image (mandatory),
 *        ee.Image (mandatory),
 *        ee.String (mandatory),
 *        ee.String (mandatory),
 *        ee.String (optional),
 * Output: ee.ImageCollection or ee.Image
 * Description: coregister two multi(hyper)-spectral images 
*******************************************************/

exports.coreg = function(img_ref, img_tar, band_ref, band_tar, export_folder){
  
/******************************************************
 * Mandatory variables 
*******************************************************/
  img_ref = ee.Image(img_ref);
  img_tar = ee.Image(img_tar);
  band_ref = ee.String(band_ref);
  band_tar = ee.String(band_tar);
  
  var folder = export_folder || ee.String("GEE_Export");
  
  // Use bilinear resampling during registration.
  var img_refOrig = img_ref//.resample('bilinear');
  var img_tarOrig = img_tar//.resample('bilinear');

  // Choose to register using only the 'R' band.
  var img_refRedBand = img_refOrig.select(band_ref);
  var img_tarRedBand = img_tarOrig.select(band_tar);

  // Determine the displacement by matching only the 'R' bands.
  var displacement = img_tarRedBand.displacement({
    referenceImage: img_refRedBand,
    projection: img_refOrig.projection(),
    maxOffset: 300.0,
    patchWidth: 128.0
  });

  // Use the computed displacement to register all original bands.
  var registered = img_tarOrig.displace({
    displacement: displacement,
    mode: "nearest_neighbor",
    //maxOffset: 300.0
  });
  
  //register again
  img_tarOrig = registered;
  
  // Choose to register using only the 'R' band.
  img_refRedBand = img_refOrig.select(band_ref);
  img_tarRedBand = img_tarOrig.select(band_tar);
  
  // Determine the displacement by matching only the 'R' bands.
  displacement = img_tarRedBand.displacement({
    referenceImage: img_refRedBand,
    projection: img_refOrig.projection(),
    maxOffset: 300.0,
    patchWidth: 128.0
  });

  // Use the computed displacement to register all original bands.
  registered = img_tarOrig.displace({
    displacement: displacement,
    mode: "nearest_neighbor",
    //maxOffset: 300.0
  });

  return registered;
};

