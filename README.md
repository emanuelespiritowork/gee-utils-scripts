# gee-utils-scripts
Welcome to everyone reading
# What you will find in this repository
Here you find a collection of useful scripts to be used into Google Earth Engine (or any javascript IDE authenticated to Google Earth Engine API). In the _functions_ folder, every script contains just a single function that does what his name says. There is also a short description of required data and the target of the function. In the _projects_ folder you will find examples of how to use functions. For those of you already expert of programming languages, you can think at _projects_ as a folder containing the MAIN scripts, while _functions_ is the collection of a LIBRARY functions. Each element in the _functions_ folder is a METHOD.
# Which is the code structure of a function
We take as an example the [clip_to.js](https://github.com/emanuelespiritowork/gee-utils-scripts/blob/master/functions/clip_to.js) function. First you will find data about the author:
```js
/******************************************************
 * Author: Emanuele Spirito
 * Copyright: 2025
 * See latest stable version on my GitHub at 
 * https://github.com/emanuelespiritowork/gee-utils-scripts
*******************************************************/
```
Then you will find the _purpose of the script_ which means what the code is meant for, what are the entries and the outcomes:
```js
/******************************************************
 * PURPOSE OF THIS SCRIPT
 * Input: ee.ImageCollection or ee.Image, ee.FeatureCollection, ee.Number
 * Output: ee.ImageCollection or ee.Image
 * Description: clipping an image or image collection to the geometry
 * of the feature collection at a specific scale
*******************************************************/
```
Then it will start the code starting with an export:
```js
exports.clip_to = function(img_coll, AOI, scale_to_use){
/******************************************************
 * Here is my code that I did not copy
 *******************************************************/
};
```
In some codes, as an example in [s2_scl_uniform.js](https://github.com/emanuelespiritowork/gee-utils-scripts/blob/master/functions/s2_scl_uniform.js), you will find a header section describing on which other codes of mine this code relies on:
```js
/******************************************************
 * REQUIRES THE FOLLOWING FUNCTIONS:
 * clip_to
*******************************************************/

var clip_to = require("users/emanuelespiritowork/SharedRepo:functions/clip_to.js");
```
# How to use them 
They are thought to be imported using _exports_ and _require_ methods as in the [Google Earth Engine reference](https://google-earth-engine.com/Advanced-Topics/Collaborating-in-Earth-Engine-with-Scripts-and-Assets/). You can add them into your Google Earth Engine account in two ways:
- (LONG TERM RELEASE) just copy and paste the function you need to your script. For instance, if you want the _clip_ function, you go in my GitHub folder [functions](https://github.com/emanuelespiritowork/gee-utils-scripts/tree/master/functions), look for [clip_to.js](https://github.com/emanuelespiritowork/gee-utils-scripts/blob/master/functions/clip_to.js) and then copy and paste the function:
```js
var clip_to = function(img_coll, AOI, scale_to_use){
 /******************************************************
 * Here is my code that I did not copy
 *******************************************************/
};
```
Then in the rest of your code you will take grant of function writing:
```js
var YOUR_result = clip_to(YOUR_img_coll, YOUR_AOI, YOUR_scale_to_use);
```
- (BETA VERSION) import the whole dataset into your [Code Editor](https://code.earthengine.google.com/?accept_repo=users/emanuelespiritowork/SharedRepo) or you can choose to use just one function. In both cases, if you want to use the function AAAA in the code BBBB.js you write on your code:
```js
require("users/emanuelespiritowork/SharedRepo:functions/BBBB.js");
var YOUR_result = BBBB.AAAA(...PARAMETERS REQUESTED BY THE FUNCTION....);
```
As a convenience I put just one function in every script and I gave the same name. For a pratical example with _clip_to.js_ what you will do is:
```js
require("users/emanuelespiritowork/SharedRepo:functions/clip_to.js");
var YOUR_result = clip_to.clip_to(YOUR_img_coll, YOUR_AOI, YOUR_scale_to_use);
```
IMPORTANT: doing things as BETA VERSION will always use the code at its latest version. If it does not work, it can be due to a temporary improvements I am making on the code. Be patient and wait until I finish working on it. 
# If the function does not work
If the function does not work as you expect, please create a Issue in the tab above. Be specific and I will try to find the issue and solve it. 
