/******************************************************
 * Author: Emanuele Spirito
 * Copyright: 2025
 * See latest stable version on my GitHub at 
 * https://github.com/emanuelespiritowork/gee-utils-scripts
*******************************************************/

/******************************************************
 * PURPOSE OF THIS SCRIPT
 * Input: ee.ImageCollection or ee.Image
 * Output: ee.ImageCollection or ee.Image
 * Description: apply radiometric terrain flattening to a Sentinel-1 GRD
 * image collection
 * Taken from: https://github.com/ESA-PhiLab/radiometric-slope-correction
 * https://www.mdpi.com/2072-4292/12/11/1867
 * MIT License Copyright (c) 2020 ESA-PhiLab
 * Full license can be found at https://github.com/ESA-PhiLab/radiometric-slope-correction/blob/master/LICENSE
 * From the licensed code I made a correction due to a possible error in this script. 
 * Might be better to check
 * https://github.com/ESA-PhiLab/radiometric-slope-correction/issues/3
*******************************************************/
// correction function for radiometric slope correction on a
// Sentinel-1 image collection
exports.s1_rad_terr_flatten = function(collection,scale_to_use,options){
    collection = ee.ImageCollection(collection);
    
    // set defaults if undefined options
    options = options || {};
    var model = options.model || 'volume';
    var elevation = options.elevation || ee.Image('USGS/SRTMGL1_003');
    var buffer = options.buffer || 0;

    // we need a 90 degree in radians image for a couple of calculations
    var ninetyRad = ee.Image.constant(90).multiply(Math.PI/180);

    // Volumetric Model Hoekman 1990
    function _volume_model(theta_iRad, alpha_rRad){

      var nominator = (ninetyRad.subtract(theta_iRad).add(alpha_rRad)).tan();
      var denominator = (ninetyRad.subtract(theta_iRad)).tan();
      return nominator.divide(denominator);
    }

    // surface model Ulander et al. 1996
    function _surface_model(theta_iRad, alpha_rRad, alpha_azRad){

      var nominator = (ninetyRad.subtract(theta_iRad)).cos();
      var denominator = alpha_azRad.cos()
        .multiply((ninetyRad.subtract(theta_iRad).add(alpha_rRad)).cos());
      return nominator.divide(denominator);
    }

    // buffer function (thanks Noel)
    function _erode(img, distance) {

      var d = (img.not().unmask(1)
          .fastDistanceTransform(30).sqrt()
          .multiply(ee.Image.pixelArea().sqrt()));

      return img.updateMask(d.gt(distance));
    }

    // calculate masks
    function _masking(alpha_rRad, theta_iRad, proj, buffer){

        // layover, where slope > radar viewing angle
        var layover = alpha_rRad.lt(theta_iRad).rename('layover');

        // shadow
        var shadow = alpha_rRad.gt(ee.Image.constant(-1).multiply(ninetyRad.subtract(theta_iRad))).rename('shadow');

        // combine layover and shadow
        var mask = layover.and(shadow);

        // add buffer to final mask
        if (buffer > 0)
            mask = _erode(mask, buffer);

        return mask.rename('no_data_mask');
   }

    function _correct(image){

        // get image geometry and projection
        var geom = image.geometry();
        var proj = image.select(1).projection();

        // get look direction angle PROBABLY WRONG
        /*var heading = (ee.Terrain.aspect(
            image.select('angle')).reduceRegion(ee.Reducer.mean(), geom, 1000).get('aspect')
            );*/
        var heading = image.select('angle').reduceRegion({
          reducer: ee.Reducer.mean(),
          geometry: geom,
          scale: 1000
        }).get("angle");

        // Sigma0 to Power of input image
        var sigma0Pow = ee.Image.constant(10).pow(image.divide(10.0));

        // Radar geometry
        var theta_iRad = image.select('angle').multiply(Math.PI/180).clip(geom);
        var phi_iRad = ee.Image.constant(heading).multiply(Math.PI/180);

        // Terrain geometry
        var alpha_sRad = ee.Terrain.slope(elevation).select('slope')
            .multiply(Math.PI/180).setDefaultProjection(proj).clip(geom);
        var phi_sRad = ee.Terrain.aspect(elevation).select('aspect')
            .multiply(Math.PI/180).setDefaultProjection(proj).clip(geom);

        // Model geometry

        //reduce to 3 angle
        var phi_rRad = phi_iRad.subtract(phi_sRad);

        // slope steepness in range
        var alpha_rRad = (alpha_sRad.tan().multiply(phi_rRad.cos())).atan();

        // slope steepness in azimuth
        var alpha_azRad = (alpha_sRad.tan().multiply(phi_rRad.sin())).atan();

        // Gamma_nought
        var gamma0 = sigma0Pow .divide(theta_iRad.cos());

        var corrModel;
               // models
        if (model == 'volume')
          corrModel = _volume_model(theta_iRad, alpha_rRad);

        if (model == 'surface')
          corrModel = _surface_model(theta_iRad, alpha_rRad, alpha_azRad);

        if (model == 'direct')
          corrModel = _direct_model(theta_iRad, alpha_rRad, alpha_azRad);

        // apply model to derive gamma0_flat
        var gamma0_flat = gamma0.divide(corrModel);

        // transform to dB-scale
        var gamma0_flatDB = (ee.Image.constant(10)
            .multiply(gamma0_flat.log10()).select("[^angle].*")
            );

        // get Layover/Shadow mask
        var mask = _masking(alpha_rRad, theta_iRad, proj, buffer);

        // return gamma_flat plus mask
        
        var time_start_value = image.get('system:time_start');
        var footprint = image.get('system:footprint');
        
        return ee.Image(gamma0_flatDB.addBands(mask).copyProperties(image))
        //.clipToBoundsAndScale({
        //  geometry: geom,
        //  scale: scale_to_use
        //})
        //.clip(geom)
        .set({
          'system:time_start': time_start_value,
          'system:footprint': footprint
        });
    }
    
    // run correction function and return corrected collection
    return collection.map(_correct);

};