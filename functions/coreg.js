exports.coreg = function(img_ref, img_tar, band_ref, band_tar, export_folder){
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
    maxOffset: 300.0,
    patchWidth: 128.0
  });

  // Use the computed displacement to register all original bands.
  var registered = img_tarOrig.displace(displacement);
  
  //register again
  img_tarOrig = registered;
  
  // Choose to register using only the 'R' band.
  img_refRedBand = img_refOrig.select(band_ref);
  img_tarRedBand = img_tarOrig.select(band_tar);
  
  // Determine the displacement by matching only the 'R' bands.
  displacement = img_tarRedBand.displacement({
    referenceImage: img_refRedBand,
    maxOffset: 300.0,
    patchWidth: 128.0
  });
  
  registered = img_tarOrig.displace(displacement);

  return registered;
};

