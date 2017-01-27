/**
 * Created by felix on 26/1/17.
 */
/**
 * let a arbitrary point on the plane surface be (x, y, z)
 * The following equation should be satisfied:
 * z = ax^2 + by^2 (if point is not in a trench)
 * z = ax^2 + by^2 + c(sin(theta)-1)*t/tmax (if point is in a trench)
 * sx is the original x position of the trench centre
 * cur_sx = sx + dy^2
 * theta = (x - cur_sx) normalize to (-PI ~ +PI)
 * ballx will be calculated given bally
 *
 *
 * */

// set edge length and grid size
var grid = 100;
var ballComplexity = 24;
var a = 1/5000;
var b = 1/2000;
var c = -0.3;
var d = -1/200;
var sx = 70;
var bally = 10;
var ballRadius = 0.5;
var ballz;
var tmax = 3;
var t = 2;
var wireFrameOn = true;
