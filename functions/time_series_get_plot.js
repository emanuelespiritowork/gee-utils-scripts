/******************************************************
 * Author: Emanuele Spirito
 * Copyright: 2025
 * See latest stable version on my GitHub at 
 * https://github.com/emanuelespiritowork/gee-utils-scripts
*******************************************************/

/******************************************************
 * PURPOSE OF THIS SCRIPT
 * Input: ee.FeatureCollection, ee.String
 * Output: ui.Chart
 * Description: this script is a function that generates the plot
 * of a time series created by time_series_create using as y variable 
 * the input string.  
*******************************************************/

exports.time_series_get_plot = function(time_series,which_property){
  
  time_series = ee.FeatureCollection(time_series);
  which_property = ee.String(which_property);
  
  
  var propertyNames = time_series.first().propertyNames();
  /*
  var get_property = function(feature){
    return ee.Feature(null,propertyNames.cat(feature.propertyNames()).distinct());
  };
  
  var list_of_lists = time_series.map(get_property);
  
  print(list_of_lists);*/
  
  //se è mascherato non è detto che il primo lo contenga
  //bisogna ordinare prendere tutte le proprietà tra tutte le feature
  //della collezione
  
  //var propertyNames = time_series.first().propertyNames();
  
  var counter = 0;
  var counter_end = time_series.size();
  while(counter <= counter_end){
    feature = time_series.get(counter);
    propertyNames = propertyNames.cat(feature.propertyNames()).distinct();
  }
  
  
  
  
  //var propertyNames = time_series.first().propertyNames();
  
  //print("senso",propertyNames);
  
  
  var xProperty = ee.Algorithms.If({
      condition: propertyNames.contains('system:time_start'),
      trueCase: 'system:time_start',
      falseCase: ee.Algorithms.If({
      condition: propertyNames.contains('date'),
      trueCase: 'date',
      falseCase: null
    })
    });

  var yProperties = which_property;
  
  /*
  yProperties = ee.Algorithms.If({
    condition: which_property === undefined || which_property === null,
    trueCase: propertyNames.remove('date')
    .remove('system:time_start')
    .remove('id')
    .remove('system:index')
    .getString(0),
    falseCase: ee.String(which_property)
  });*/
  
  /*
  if(which_property === undefined || which_property === null)
  {
    yProperties = propertyNames.remove('date')
    .remove('system:time_start')
    .remove('id')
    .remove('system:index')
    .getString(0);
  
  }else{
    yProperties = ee.String(which_property);
  }*/
  
  
  print(yProperties);
  
  var p_title = 'Time series of ';
  p_title = ee.String(p_title).cat(ee.String(yProperties));
  
  var plot = ui.Chart.feature.groups({
    features: time_series, 
    xProperty: xProperty.getInfo(),
    yProperty: yProperties.getInfo(),
    seriesProperty: 'id',
  }).setChartType("LineChart")
  .setOptions({
    title: p_title.getInfo(),
    /*trendlines: {
      0: {
        color: 'CC0000',
      },
      visibleInLegend: 'true',
      type: 'linear'
    },*/
    linewidth: 1,
    pointsize: 3,
    interpolateNulls: true
  });
  
  return plot;
};