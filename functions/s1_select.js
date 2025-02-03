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

exports.s1_select = function(img_coll, instrument, polarization, orbit, spatial_resolution){
  
  //for choosing right parameters https://sentiwiki.copernicus.eu/web/s1-applications
  //for explanation of parameters https://docs.sentinel-hub.com/api/latest/data/sentinel-1-grd/
  
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
  orbit = ee.String(orbit); //DESCENDING or ASCENDING
  spatial_resolution = ee.Number(spatial_resolution);
  
  var select_image = function(image){
    
  };
  
  return img_coll.map(select_image);
};