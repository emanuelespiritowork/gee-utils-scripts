exports.s2_modify_system_index = function(img_coll){
  img_coll = ee.ImageCollection(img_coll);
  
  var size = img_coll.size();
  var img_coll_list = img_coll.toList({
    count: size
  });
  
  var change_system_index = function(img){
    var product_id = img.get("PRODUCT_ID");
    return img.set({
      "system:index": product_id
    });
  };
  
  var img_coll_list_index = img_coll_list.map(change_system_index);
  
  var img_coll_index = ee.ImageCollection.fromImages(img_coll_list_index);
  
  return img_coll_index;
};