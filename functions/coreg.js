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
 *        ee.Number (optional),
 *        ee.Number (optional),
 *        ee.String (optional)
 * Output: ee.ImageCollection or ee.Image
 * Description: coregister two multi(hyper)-spectral images 
*******************************************************/

exports.coreg = function(img_ref, img_tar, band_ref, band_tar, max_Offset,
patch_Width, coreg_type){
  
/******************************************************
 * Mandatory variables
*******************************************************/
  img_ref = ee.Image(img_ref);
  img_tar = ee.Image(img_tar);
  band_ref = ee.String(band_ref);
  band_tar = ee.String(band_tar);

/******************************************************
 * Optional variables
*******************************************************/
  var maxOffset = max_Offset || ee.Number(300.0);
  var patchWidth = patch_Width || null;
  var type = coreg_type || ee.String("nearest_neighbor");
  
/******************************************************
 * Resample
*******************************************************/
//if images are not in the same CRS one of them (the target) will be 
//resampled into the CRS of the other (the reference). This resample is
//by default done using nearest_neighbour but it can be chosen other 
//resample function (bilinear o bicubic)
  var img_refOrig = ee.Image(ee.Algorithms.If({
    condition: ee.String(type).equals("nearest_neighbor"),
    trueCase: img_ref,
    falseCase: ee.Algorithms.If({
      condition: ee.String(type).equals("bilinear"),
      trueCase: img_ref.resample(ee.String(type)),
      falseCase: ee.Algorithms.If({
        condition: ee.String(type).equals("bicubic"),
        trueCase: img_ref.resample(ee.String(type)),
        falseCase: null
      })
    })
  }));
  
  //print(ee.String(type).equals("nearest_neighbor"));
  //print(ee.String(type).equals("bilinear"));
  //print(ee.String(type).equals("bicubic"));
  
  var img_tarOrig = ee.Image(ee.Algorithms.If({
    condition: ee.String(type).equals("nearest_neighbor"),
    trueCase: img_tar,
    falseCase: ee.Algorithms.If({
      condition: ee.String(type).equals("bilinear"),
      trueCase: img_tar.resample(ee.String(type)),
      falseCase: ee.Algorithms.If({
        condition: ee.String(type).equals("bicubic"),
        trueCase: img_tar.resample(ee.String(type)),
        falseCase: null
      })
    })
  }));
  
  //print(img_tarOrig.projection());
  //img_tarOrig = img_tarOrig.reproject(img_refOrig.projection());
  //print(img_tarOrig.projection());
/******************************************************
 * Choose the band used to coregister called R band
*******************************************************/
  var img_refRedBand = img_refOrig.select(band_ref);
  var img_tarRedBand = img_tarOrig.select(band_tar);

/******************************************************
 * Determine the displacement by matching only the 'R' bands
*******************************************************/
  var displacement = img_tarRedBand.displacement({
    referenceImage: img_refRedBand,
    maxOffset: maxOffset,//these parameters comes from trial&error bests
    //patchWidth: 128.0//these parameters comes from trial&error bests
  });
  
  //print(displacement);

/******************************************************
 * Use the computed displacement to register all original bands.
*******************************************************/
  var registered = img_tarOrig.displace({
    displacement: displacement,
    mode: ee.String(type)//"nearest_neighbor",
  });

  return registered;
};

