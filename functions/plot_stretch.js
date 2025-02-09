/******************************************************
 * Author: Emanuele Spirito
 * Copyright: 2025
 * See latest stable version on my GitHub at 
 * https://github.com/emanuelespiritowork/gee-utils-scripts
*******************************************************/

/******************************************************
 * PURPOSE OF THIS SCRIPT
 * Input: ee.Image, ee.Number, ee.Number
 * Output: (no output) it prints an image layer 
 * Description: this script has a function that want to create an image 
 * stretch of stretch*sigma of a ee.Image and print it on 
 * your map composing the bands you select. If you do not select 
 * any band, the function will choose the first three bands. This script
 * works at scale_to_use scale
*******************************************************/

exports.plot_stretch = function(img,bands,stretch,scale_to_use){
  
  img = ee.Image(img);
  stretch = ee.Number(stretch);
  scale_to_use = ee.Number(scale_to_use);
  
  var geometry_of_image = img.geometry();
  var band_names;
  var num_bands;
  if(bands === undefined){
    bands = ee.Algorithms.If({
      condition: img.bandNames().size().gte(3),
      trueCase: ee.Algorithms.If({
        condition: img.bandNames().size().eq(3),
        trueCase: img.bandNames(),
        falseCase: img.bandNames().slice(1,4).reverse()
      }),
      falseCase: ee.List([img.bandNames().getString(0)])
    });
  }else{
    bands = ee.Algorithms.If({
      condition: ee.List(bands).size().neq(3),
      trueCase: ee.Algorithms.If({
        condition: img.bandNames().size().eq(3),
        trueCase: img.bandNames(),
        falseCase: img.bandNames().slice(1,4).reverse()
      }),
      falseCase: bands
    });
  }
  
  //print(bands);
  
  var first_band = ee.List(bands).getString(0);
  var second_band = ee.List(bands).getString(1);
  var third_band = ee.List(bands).getString(2);
  
  var computed_img_std_1 = img.select(first_band).reduceRegion({
    reducer: ee.Reducer.stdDev(),
    scale: scale_to_use,
    geometry: geometry_of_image,
    bestEffort: true
  }).getNumber(first_band);
  
  var computed_img_std_2 = img.select(second_band).reduceRegion({
    reducer: ee.Reducer.stdDev(),
    scale: scale_to_use,
    geometry: geometry_of_image,
    bestEffort: true
  }).getNumber(second_band);
  
  var computed_img_std_3 = img.select(third_band).reduceRegion({
    reducer: ee.Reducer.stdDev(),
    scale: scale_to_use,
    geometry: geometry_of_image,
    bestEffort: true
  }).getNumber(third_band);
  
  var computed_img_mean_1 = img.select(first_band).reduceRegion({
    reducer: ee.Reducer.mean(),
    scale: scale_to_use,
    geometry: geometry_of_image,
    bestEffort: true
  }).getNumber(first_band);
  
  var computed_img_mean_2 = img.select(second_band).reduceRegion({
    reducer: ee.Reducer.mean(),
    scale: scale_to_use,
    geometry: geometry_of_image,
    bestEffort: true
  }).getNumber(second_band);
  
  var computed_img_mean_3 = img.select(third_band).reduceRegion({
    reducer: ee.Reducer.mean(),
    scale: scale_to_use,
    geometry: geometry_of_image,
    bestEffort: true
  }).getNumber(third_band);
  
  var computed_img_mean = ee.Array(ee.List([computed_img_mean_1,
  computed_img_mean_2,computed_img_mean_3]));
  
  var computed_img_std = ee.Array(ee.List([computed_img_std_1,
  computed_img_std_2,computed_img_std_3]));
  
  var array_of_stretch = ee.Array(ee.List([stretch,stretch,stretch]));
  
  var computed_img_min = computed_img_mean.subtract(array_of_stretch.multiply(computed_img_std));
  //print("computed_img_min",computed_img_min);
  
  var computed_img_max = computed_img_mean.add(array_of_stretch.multiply(computed_img_std));
  //print("computed_img_max",computed_img_max);
  
  var vis_specific_image = {
    bands: ee.List(bands).getInfo(),
    min: computed_img_min.toList().getInfo(),
    max: computed_img_max.toList().getInfo()
  };
  
  Map.addLayer(img, vis_specific_image, 'stretched_image', true);
  Map.centerObject(img);
  
  return 0;
};

