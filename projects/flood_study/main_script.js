/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var AOI = ee.FeatureCollection("projects/ee-emanuelespiritowork/assets/brazos_river_basin"),
    geometry = 
    /* color: #d63000 */
    /* shown: false */
    ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[-96.0737948544642, 30.041044322288684],
                  [-96.04564455529275, 30.09274781553181],
                  [-96.04633397262877, 30.243533550595362],
                  [-96.21388079279673, 30.220996684101458],
                  [-96.22212095589569, 30.04698863641669]]]),
            {
              "system:index": "0"
            })]),
    geometry2 = 
    /* color: #98ff00 */
    /* shown: false */
    ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[-99.00635160605253, 32.862273453268706],
                  [-99.10248197714628, 32.790725562596045],
                  [-99.00772489706816, 32.707565403127354],
                  [-98.91571439902128, 32.79822925530258]]]),
            {
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-98.37164393841731, 30.789609608937983],
                  [-98.33456508099543, 30.82735353746729],
                  [-98.41421595990168, 30.948741050641114],
                  [-98.53781215130793, 30.891012778217707],
                  [-98.43344203412043, 30.71525794540285]]]),
            {
              "system:index": "1"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-97.51930694160397, 31.01213600337887],
                  [-97.5261733966821, 31.05096876763615],
                  [-97.67174224433835, 31.021551460735513],
                  [-97.66762237129147, 30.988593290634626]]]),
            {
              "system:index": "2"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-98.42721477630423, 32.00657896668095],
                  [-98.50137249114798, 32.06711468814616],
                  [-98.58651653411673, 32.00424987056985],
                  [-98.50961223724173, 31.943672608802554]]]),
            {
              "system:index": "3"
            })]),
    geometry3 = 
    /* color: #d63000 */
    /* shown: false */
    ee.Geometry.Polygon(
        [[[-96.64511953759347, 30.358474228834474],
          [-96.63620130745394, 30.263912469581417],
          [-96.58021252205327, 30.26866230644726],
          [-96.51155286574303, 30.355814008508503]]]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
/*****************************
 *        FUNCTIONS
 ***************************/
var s1_select = require("users/emanuelespiritowork/SharedRepo:functions/s1_select.js");
var s1_speckle = require("users/emanuelespiritowork/SharedRepo:functions/s1_speckle.js");
var plot_map = require("users/emanuelespiritowork/SharedRepo:functions/plot_map.js");
var mosaic_date = require("users/emanuelespiritowork/SharedRepo:functions/mosaic_date.js");
var histogram_map = require("users/emanuelespiritowork/SharedRepo:functions/histogram_map.js");
var s1_rad_terr_flatten = require("users/emanuelespiritowork/SharedRepo:functions/s1_rad_terr_flatten.js");

/*****************************
 *        PROJECT
 ***************************/
var dataset = ee.Image('JRC/GSW1_4/GlobalSurfaceWater');
var s1_coll = ee.ImageCollection("COPERNICUS/S1_GRD");


var visualization = {
  bands: ['occurrence'],
  min: 0.0,
  max: 100.0,
  palette: ['ffffff', 'ffbbbb', '0000ff']
};

//Map.setCenter(59.414, 45.182, 6);

Map.addLayer(dataset, visualization, 'Occurrence', false);

//Map.addLayer(AOI.geometry());
//print(AOI);

var subset_scale = ee.Number(30);
var scale_to_use = ee.Number(10);

var selected = s1_select.s1_select(s1_coll, "IW", "VH", "ASCENDING", "H", true);

var subset_mosaic = mosaic_date.mosaic_date(selected,geometry3,"2020-01-01","2020-12-31",subset_scale);
var mosaic = mosaic_date.mosaic_date(selected,geometry,"2020-01-01","2020-12-31",scale_to_use);

//print(subset_mosaic);
//print(mosaic);
Map.addLayer(mosaic);
var collection = mosaic;
var options = undefined;
collection = ee.ImageCollection(collection);
    //print(collection);

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
      print("alpha_azRad",alpha_azRad);
      print("theta_iRad",theta_iRad);
      print("alpha_rRad",alpha_rRad);
      print("ninetyRad",ninetyRad);
      var denominator = alpha_azRad.cos()
        .multiply((ninetyRad.subtract(theta_iRad).add(alpha_rRad)).cos());
      print("nominator",nominator);
      print("denominator",denominator);
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

        // get look direction angle
        var heading = image.select('angle').reduceRegion({
          reducer: ee.Reducer.mean(),
          geometry: geom,
          scale: 1000
        }).get("angle");

        // Sigma0 to Power of input image
        var sigma0Pow = ee.Image.constant(10).pow(image.divide(10.0));

        // Radar geometry
        var theta_iRad = image.select('angle').multiply(Math.PI/180).clip(geom);
        print("heading",heading);
        print("Math.PI",Math.PI);
        var phi_iRad = ee.Image.constant(heading).multiply(Math.PI/180);

        // Terrain geometry
        var alpha_sRad = ee.Terrain.slope(elevation).select('slope')
            .multiply(Math.PI/180).setDefaultProjection(proj).clip(geom);
        var phi_sRad = ee.Terrain.aspect(elevation).select('aspect')
            .multiply(Math.PI/180).setDefaultProjection(proj).clip(geom);

        // Model geometry

        //reduce to 3 angle
        print("phi_iRad",phi_iRad);
        print("phi_sRad",phi_sRad);
        var phi_rRad = phi_iRad.subtract(phi_sRad);

        // slope steepness in range
        print("alpha_sRad",alpha_sRad);
        print("phi_rRad",phi_rRad);
        var alpha_rRad = (alpha_sRad.tan().multiply(phi_rRad.cos())).atan();

        // slope steepness in azimuth
        var alpha_azRad = (alpha_sRad.tan().multiply(phi_rRad.sin())).atan();

        // Gamma_nought
        var gamma0 = sigma0Pow.divide(theta_iRad.cos());

               // models
        var corrModel;
        if (model == 'volume')
          corrModel = _volume_model(theta_iRad, alpha_rRad);

        if (model == 'surface')
          corrModel = _surface_model(theta_iRad, alpha_rRad, alpha_azRad);

        if (model == 'direct')
          corrModel = _direct_model(theta_iRad, alpha_rRad, alpha_azRad);

        print(gamma0);
        print(corrModel);
        // apply model to derive gamma0_flat
        var gamma0_flat = gamma0.divide(corrModel);

        // transform to dB-scale
        var gamma0_flatDB = (ee.Image.constant(10)
            .multiply(gamma0_flat.log10()).select("[^angle].*")
            );

        // get Layover/Shadow mask
        var mask = _masking(alpha_rRad, theta_iRad, proj, buffer);

        // return gamma_flat plus mask
        return gamma0_flatDB.addBands(mask).copyProperties(image);


    }
    
var flatten = _correct(mosaic);

//var flatten = s1_rad_terr_flatten.s1_rad_terr_flatten(mosaic);
//var subset_flatten = s1_rad_terr_flatten.s1_rad_terr_flatten(subset_mosaic).first();
//flatten = flatten.select("VH").updateMask(flatten.select("no_data_mask"));
//subset_flatten = subset_flatten.select("VH").updateMask(subset_flatten.select("no_data_mask"));

//print(flatten);
//print(subset_flatten);

//var subset_speckle = s1_speckle.s1_speckle(subset_flatten,5*subset_scale,"meters","circle").first();
//var speckle = s1_speckle.s1_speckle(flatten,5*scale_to_use,"meters","circle").first();

//print(subset_speckle);
//print(speckle);

//var subset_null_var_1 = plot_map.plot_map(subset_speckle,2,subset_scale);
//var null_var_1 = plot_map.plot_map(speckle,2,scale_to_use);

//var subset_histogram = histogram_map.histogram_map(subset_speckle,geometry3,subset_scale,false);
//var histogram = histogram_map.histogram_map(speckle,geometry,scale_to_use,false);

//from the subset histogram I choose the threshold. I should see
//at least a small peak in the complete histogram

//see also Otsu 1979

/*
var threshold = ee.Number(-26);

var threshold_mask = speckle.lt(threshold);

var low_reflectance = speckle.updateMask(threshold_mask);

var null_var_3 = plot_map.plot_map(low_reflectance,2,scale_to_use);
*/

//var null_var_1 = plot_map.plot_map(mosaic,2,scale_to_use);
//var null_var_2 = plot_map.plot_map(speckle,2,scale_to_use);

//var speckled = s1_speckle.s1_speckle(selected,);

//print(bounded.first());