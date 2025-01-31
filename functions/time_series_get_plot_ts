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
 * of a time series created by functions/time_series_create_img_coll 
 * using as y variable the input string.  
*******************************************************/

exports.time_series_get_plot_ts = function(time_series,which_property){
  
  time_series = ee.FeatureCollection(time_series);
  which_property = ee.String(which_property);
  
  var propertyNames = time_series.first().propertyNames();
  
  print(propertyNames);
  var xProperty = ee.Algorithms.If({
      condition: propertyNames.contains('system:time_start'),
      trueCase: 'system:time_start',
      falseCase: ee.Algorithms.If({
      condition: propertyNames.contains('date'),
      trueCase: 'date',
      falseCase: null
    })
    });

  var yProperties;
  if(which_property === undefined || which_property === null)
  {
    yProperties = propertyNames.remove('date')
    .remove('system:time_start')
    .remove('id')
    .remove('system:index')
    .getString(0);
  
  }else{
    yProperties = ee.String(which_property);
  }
  
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
    trendlines: {
      0: {
        color: 'CC0000',
      },
      visibleInLegend: 'true',
      type: 'linear'
    },
    linewidth: 1,
    pointsize: 3
  });
  
  return plot;
};