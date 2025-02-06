/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var geometry = /* color: #d63000 */ee.Geometry.Polygon(
        [[[-95.8290393809707, 29.15743033277755],
          [-95.82560615343164, 28.984589929269106],
          [-95.09158210558007, 28.98278798395859],
          [-95.1039417247207, 29.160428472742947]]]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
var surface_water = ee.Image("JRC/GSW1_4/GlobalSurfaceWater");
var filter = surface_water.select("seasonality").gt(10);
surface_water = surface_water.updateMask(filter);
Map.addLayer(filter);
Map.addLayer(surface_water);

var shape = ee.Image(1).updateMask(surface_water.select("seasonality"));
var vector = shape.reduceToVectors({
  geometry: geometry
});
Map.addLayer(vector);

var connected = shape.connectedPixelCount({
  maxSize: 100,
  eightConnected: false
});
Map.addLayer(shape);
Map.addLayer(connected);