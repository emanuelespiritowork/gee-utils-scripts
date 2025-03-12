/******************************************************
 * Author: Emanuele Spirito
 * Copyright: 2025
 * See latest stable version on my GitHub at 
 * https://github.com/emanuelespiritowork/gee-utils-scripts
*******************************************************/

/******************************************************
 * PURPOSE OF THIS SCRIPT
 * Input: ee.Geometry.Point, ee.Geometry.Point
 * Output: ee.ImageCollection or ee.Image
 * Description: compute distance between two points
*******************************************************/

exports.compute_distance = function(first_point,second_point){
  
/******************************************************
 * Check variable types
 *******************************************************/
  
  img_coll = ee.ImageCollection(img_coll);
  AOI = ee.FeatureCollection(AOI);
  scale_to_use = ee.Number(scale_to_use);
  //print(AOI);
  
/******************************************************
 * Keep only images near the AOI bounds (for a polygon
 * this means images that touches the vertices)
 *******************************************************/
 
  var img_coll_near = img_coll.filterBounds(AOI);
  
/******************************************************
 * Get projection
 *******************************************************/
 
  var projection = img_coll_near.first()
  .select(img_coll_near.first().bandNames().getString(0)).projection();
  //print("projection",projection);
  
/******************************************************
 * Get geometry of the AOI
 *******************************************************/
 
  var geometry = AOI.geometry();
  //print("geometry",geometry);
  
/******************************************************
 * Get area of the AOI
 *******************************************************/
 
  var area = geometry.area();
  //print("area",area);
  //print("area.sqrt().divide(ee.Number(10))",area.sqrt().divide(ee.Number(10)));

/******************************************************
 * Create a covering grid of the AOI and keep only images
 * that intersect the vertices of the covering grid (both
 * internal and external). The covering grid is scaled 
 * to the area of the image
 *******************************************************/
  
  var filtered_coll = img_coll.filterBounds(geometry.coveringGrid({
    proj: projection,
    scale: area.sqrt().divide(ee.Number(10))
  }));
  
/******************************************************
 * Define the function that clip the image to the AOI. This is 
 * done for both the cases of a clip smaller than a tile and a clip
 * greater than a tile.
 *******************************************************/
  
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