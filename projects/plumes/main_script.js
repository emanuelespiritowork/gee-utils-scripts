/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var AOI = /* color: #bf04c2 */ee.Geometry.Polygon(
        [[[8.792860534194146, 45.44595189716361],
          [8.785908248427544, 45.44450666473064],
          [8.77603771925274, 45.44089342166084],
          [8.775007750991021, 45.43776175714807],
          [8.780672576430474, 45.429510193430005],
          [8.782732512953912, 45.42993183542264],
          [8.783419158461724, 45.43191953381937],
          [8.787539031508599, 45.43197976601131],
          [8.798697021010552, 45.43258208439556],
          [8.798182036879693, 45.43709926738165],
          [8.799126174452935, 45.43860491469251],
          [8.798954513075982, 45.441013866824775]]]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
var s2_coll = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED");

var clip_to = require("users/emanuelespiritowork/SharedRepo:functions/clip_to.js");
var s2_scale = require("users/emanuelespiritowork/SharedRepo:functions/s2_scale.js");
var mosaic_recent = require("users/emanuelespiritowork/SharedRepo:functions/mosaic_recent.js");
var plot_stretch = require("users/emanuelespiritowork/SharedRepo:functions/plot_stretch.js");

var clip = clip_to.clip_to(s2_coll, AOI, 10);

var scale = s2_scale.s2_scale(clip);

var mosaic = mosaic_recent.mosaic_recent(s2_coll, AOI, 10);

var null_var = plot_stretch.plot_stretch(mosaic, ["B4","B3","B2"], 2, 10);

//proprietà di un pixel di camino senza usare SCL

//riflettanza in tutte le bande superiore a 0.5

