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
/******************************************************
 * Check variable types
*******************************************************/
  time_series = ee.FeatureCollection(time_series);
/******************************************************
 * Get property names
 * If it is masked the first element of the time series does not
 * have all the properties. For this reason I check all the properties
 * among the features
*******************************************************/
  var propertyNames = time_series.first().propertyNames();
  var counter = 0;
  var counter_end = time_series.size();
  while(counter <= counter_end){
    feature = time_series.get(counter);
    propertyNames = propertyNames.cat(feature.propertyNames()).distinct();
  }
/******************************************************
 * Set x property as the date
*******************************************************/
  var xProperty = ee.Algorithms.If({
      condition: propertyNames.contains('system:time_start'),
      trueCase: 'system:time_start',
      falseCase: ee.Algorithms.If({
      condition: propertyNames.contains('date'),
      trueCase: 'date',
      falseCase: null
    })
  });
/******************************************************
 * Set y property as request
*******************************************************/
  var yProperties = which_property || propertyNames.remove('date')
  .remove('system:time_start')
  .remove('id')
  .remove('system:index')
  .getString(0);
  print(yProperties);
/******************************************************
 * Set title
*******************************************************/
  var p_title = 'Time series of ';
  p_title = ee.String(p_title).cat(ee.String(yProperties));
/******************************************************
 * Plot
*******************************************************/  
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
        color: 'purple',
        opacity: 0.2,
        lineWidth: 10,
        visibleInLegend: 'true',
        type: 'linear'
      }
    },*/
    linewidth: 1,
    pointsize: 3,
    interpolateNulls: true
  });
  
  return plot;
};