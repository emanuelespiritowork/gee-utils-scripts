/******************************************************
 * Author: Emanuele Spirito
 * Copyright: 2025
 * See latest stable version on my GitHub at 
 * https://github.com/emanuelespiritowork/gee-utils-scripts
*******************************************************/

/******************************************************
 * PURPOSE OF THIS SCRIPT
 * Input: ee.ImageCollection or ee.Image, ee.FeatureCollection, ee.Number
 * Output: ee.ImageCollection or ee.Image
 * Description: clipping an image or image collection to the geometry
 * of the feature collection at a specific scale
*******************************************************/

exports.clip_to = function(img_coll, AOI, scale_to_use){
  
  img_coll = ee.ImageCollection(img_coll);
  AOI = ee.FeatureCollection(AOI);
  scale_to_use = ee.Number(scale_to_use);
  //print(AOI);
  
  var projection = img_coll.first()
  .select(img_coll.first().bandNames().getString(0)).projection();
  var geometry = AOI.geometry();
  var area = geometry.area();
  var filtered_coll = img_coll.filterBounds(geometry.coveringGrid({
    proj: projection,
    scale: area.sqrt().divide(ee.Number(10))
  }));
  
  var clip_img = function(image){
    
    var clipped_image = image.clipToBoundsAndScale({
      geometry: geometry,
      scale: scale_to_use
    }).clip(AOI);
    var previous_geometry = image.geometry();
    var intersection = geometry.intersection(previous_geometry);
    var footprint = ee.Algorithms.GeometryConstructors.MultiGeometry({
      geometries: intersection.geometries()
    });
    return clipped_image.set({"system:footprint": footprint});
  };
  
  return filtered_coll.map(clip_img);
};