exports.int_find_objects = function(image,object_linear_dimension,scale_to_use){
  var seg_alg = ee.Algorithms.Image.Segmentation.SNIC({
    image: image,
    size: object_linear_dimension.divide(scale_to_use).divide(2)
  });
  
  return seg_alg;
};