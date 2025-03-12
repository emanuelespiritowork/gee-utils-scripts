/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var AOI = /* color: #d63000 */ee.Geometry.Polygon(
        [[[-50.64183091637621, -11.597893357127747],
          [-50.64251756188402, -11.64463694670252],
          [-50.6111035299016, -11.636230404940136],
          [-50.61488008019457, -11.597388887156399]]]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
var s2_coll = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED");

Map.addLayer(s2_coll.filterBounds(AOI).sort("system:time_start",false).first());
