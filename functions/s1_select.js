/******************************************************
 * Author: Emanuele Spirito
 * Copyright: 2025
 * See latest stable version on my GitHub at 
 * https://github.com/emanuelespiritowork/gee-utils-scripts
*******************************************************/

/******************************************************
 * PURPOSE OF THIS SCRIPT
 * Input: ee.ImageCollection or ee.Image
 * Output: ee.ImageCollection or ee.Image
 * Description: select a desidered Sentinel-1 Ground Range Detected image
*******************************************************/

exports.s1_select = function(img_coll, instrument, polarization, orbit, spatial_resolution, angle){
  
  //for choosing right parameters https://sentiwiki.copernicus.eu/web/s1-applications
  //for explanation of parameters https://docs.sentinel-hub.com/api/latest/data/sentinel-1-grd/
  
  //if you do not find the data with the parameters you want, check the ESA archive:
  //https://sentinel.esa.int/web/sentinel/copernicus/sentinel-1/acquisition-plans-archive
  
  img_coll = ee.ImageCollection(img_coll);
  instrument = ee.String(instrument); 
  /*****
   * Stripmap Mode (SM)
   * Interferometric Wide Swath Mode (IW)
   * Extra Wide Swath mode (EW)
   * Wave Mode (WV) not available for Ground Range Detected.
   *******/
  polarization = ee.String(polarization); 
  /*****
   * SM: HH+HV, VV+VH, HH, VV
   * IW: HH+HV, VV+VH, HH, VV
   * EW: HH+HV, VV+VH, HH, VV
   * WV:	HH, VV
   * 
   * It can be found an unique code for polarization:
   * SH:	HH	
   * SV:	VV	
   * DH:	HH+HV	Typical for EW acquisitions
   * DV:	VV+VH	Typical for IW acquisitions
   * HH:	Partial Dual, HH only	HH+HV was acquired, only HH is available in this product
   * HV:	Partial Dual, HV only	HH+HV was acquired, only HV is available in this product
   * VV:	Partial Dual, VV only	VV+VH was acquired, only VV is available in this product
   * VH:	Partial Dual, VH only	VV+VH was acquired, only VH is available in this product
   *******/
  orbit = ee.String(orbit); 
  /******
   * ASCENDING	Data acquired when the satellite was traveling approx. 
   * towards the Earth's North pole.
   * DESCENDING	Data acquired when the satellite was traveling approx. 
   * towards the Earth's South pole.
   *******/
   spatial_resolution = ee.String(spatial_resolution); 
  /******
   * (H) HIGH	10m/px for IW/SM and 25m/px for EW
   * (M) MEDIUM	40m/px for IW/SM and EW
   *******/
   //angle is a boolean: true if you want to add angle layer to the image, 
   //false if you do not want
   
  var selected_coll = ee.ImageCollection(
    ee.Algorithms.If({
      condition: polarization.equals(ee.String("ALL")),
      trueCase: ee.Algorithms.If({
        condition: angle,
        trueCase: img_coll
        .filter(ee.Filter.eq("instrumentMode",instrument))
        .filter(ee.Filter.eq("orbitProperties_pass",orbit))
        .filter(ee.Filter.eq("resolution",spatial_resolution)),
        falseCase: img_coll
        .filter(ee.Filter.eq("instrumentMode",instrument))
        .filter(ee.Filter.eq("orbitProperties_pass",orbit))
        .filter(ee.Filter.eq("resolution",spatial_resolution))
        .select(["[^angle].*"])}),
      falseCase: ee.Algorithms.If({
        condition: angle,
        trueCase: img_coll
        .filter(ee.Filter.eq("instrumentMode",instrument))
        .filter(ee.Filter.listContains("transmitterReceiverPolarisation",polarization))
        .filter(ee.Filter.eq("orbitProperties_pass",orbit))
        .filter(ee.Filter.eq("resolution",spatial_resolution))
        .select(ee.List([polarization,"angle"])),
        falseCase: img_coll
        .filter(ee.Filter.eq("instrumentMode",instrument))
        .filter(ee.Filter.listContains("transmitterReceiverPolarisation",polarization))
        .filter(ee.Filter.eq("orbitProperties_pass",orbit))
        .filter(ee.Filter.eq("resolution",spatial_resolution))
        .select(polarization)})
    }));
  return selected_coll;
};