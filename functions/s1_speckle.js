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
 * Description: reduce the speckle for an Sentinel-1 Ground Range Detected image  
 * https://un-spider.org/advisory-support/recommended-practices/recommended-practice-google-earth-engine-flood-mapping/step-by-step
 * https://www.sciencedirect.com/science/article/pii/S1569843222001911?via%3Dihub
*******************************************************/

exports.s1_speckle = function(img_coll, radius, units, type){
  
  img_coll = ee.ImageCollection(img_coll);
  radius = ee.Number(radius);
  units = ee.String(units);
  /*******
   * 'pixels', 'meters'
   *********/
  type = ee.String(type);
  /*******
   * 'circle', 'square', 'cross', 'plus', 'octagon', and 'diamond'.
   *********/
  
  var size = img_coll.size();
  
  var speckle_lee = function(image){
    var remove_speckle = image.focalMean({
      radius: radius,
      kernelType: type,
      units: units
    });
    return remove_speckle;
  };
  
  var result = ee.Algorithms.If({
    condition: size.eq(1),
    trueCase: ee.Image(img_coll.map(speckle_lee).first()),
    falseCase: img_coll.map(speckle_lee)
  });
  
  return result;
};