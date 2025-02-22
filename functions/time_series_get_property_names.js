exports.time_series_get_property_names = function(time_series){
  var propertyNames = time_series.first().propertyNames();
  var counter = 0;
  var counter_end = time_series.size();
  while(counter <= counter_end){
    feature = time_series.get(counter);
    propertyNames = propertyNames.cat(feature.propertyNames()).distinct();
  }
  
  var yProperties = propertyNames.remove('date')
  .remove('system:time_start')
  .remove('id')
  .remove('system:index');
  
  return yProperties;
};