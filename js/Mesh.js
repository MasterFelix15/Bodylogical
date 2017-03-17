/**
 * Created by felix on 31/1/17.
 */

var plane;
var ball;
var planeGeo;
var ballGeo;
var planeWidth = 10;
var planeLength = 50;
var trenchWidth = 20;
var ballx, ballz;
var grid = 100;
var ballComplexity = 24;
var a = 1/5000;
var b = 1/500;
var c = -0.3;
var d = -1/200;
var sx = 70;
var bally = 2;
var ballRadius = 0.5;
var tmax = 3;
// variables to control the sinking of trench
var steadyTime = 2;
var maxTime = 5;
var trenches = [];
var t = 2;
var wireFrameOn = false;
var group;

var lineStartY = 1;
var lineOffset = 2;
var BMILineNum = 20;
var BMILineIndexOffset = grid/lineOffset;
var lineGeos = [];

var lastframeX = sx;
var startYear = 25;
var yearScale = 0.25;
var bmiTable = {};

var sleep = 0;
var calories = 0;
var steps = 0;
var preset = "0/0/0";
var deltaTime = 182.5 * 24 * 60;
var lineStartOffset = lineStartY;
var lineTimeCounter;

function Trench(center, min, max, depth) {
    this.center = center;
    this.min = min;
    this.max = max;
    this.depth = depth;
}

function addTrench(center) {
    var newTrench = new Trench(center, center-10, center+10, c);
    var trenchIndex = 0;
    for (var i = 0; i < trenches.length-1; i++) {
        if (trenches[i].center <= center && trenches[i+1].center >= center) {
            // this is where the new trench belongs
            trenchIndex = i+1;
            break;
        }
    }
    if (center > trenches[trenches.length-1].center) {

    }
}

function drawTrench(timeOffset, firstTime) {
    lineTimeCounter = timeOffset - parseInt(timeOffset);
    lineStartOffset = lineStartY - lineTimeCounter;
    console.log(lineStartOffset);
    for (var i = planeGeo.vertices.length - grid - 1; i >= 0; i-=(grid+1)) {
        for (var j = i; j < i+(grid+1); j++) {
            var x = j - i;
            var y = parseInt(grid - i / (grid+1));
            var z = a*Math.pow(x,2) + b*Math.pow(y,2);
            /////////////////////////////////////////////////

            // calculate current time smoothly
            var cur_time = ((y+timeOffset)*yearScale+startYear)*365*24*60; // time is measured in minutes
            var prev_point = Math.floor(cur_time/deltaTime) * deltaTime;
            var next_point = prev_point + deltaTime;
            var ratio = (next_point - cur_time)/deltaTime;
            var bmi = ratio * bmiTable[preset][prev_point] + (1-ratio) * bmiTable[preset][next_point];
            var cur_sx = (30 - bmi)/10.0*100;

            // var cur_sx = d*Math.pow(y,2) + sx;
            if (x >= cur_sx - trenchWidth/2 && x <= cur_sx + trenchWidth/2) {
                var theta = (x - cur_sx) / -(trenchWidth / 2) * Math.PI;
                z += c * (Math.cos(theta) + 1) * t / tmax;
            }
            if (x == parseInt(cur_sx) && y == bally) {
                ballx = cur_sx;
                ballz = a*Math.pow(ballx,2) + b*Math.pow(bally,2) + 2*c*t/tmax + ballRadius;
            }
            if (firstTime) {
                planeGeo.vertices[j].y += (planeLength - planeWidth)/2;
            }
            planeGeo.vertices[j].z = z;

            // process frame line offset
            if ((y-lineStartY)%lineOffset == 0) {

                var zOffset = b*Math.pow(y,2) - b*Math.pow(y+lineStartOffset-1,2);
                //console.log(lineStartOffset);
                lineGeos[parseInt((y-lineStartY)/lineOffset)].vertices[x] = new THREE.Vector3 (
                    planeGeo.vertices[j].x,
                    planeGeo.vertices[j].y - (1-lineStartOffset),
                    planeGeo.vertices[j].z + 0.05 - zOffset);
            }

            if (x%(grid/BMILineNum) == 0) {
                lineGeos[BMILineIndexOffset + x/(grid/BMILineNum)].vertices[y] = new THREE.Vector3 (
                    planeGeo.vertices[j].x,
                    planeGeo.vertices[j].y,
                    planeGeo.vertices[j].z + 0.01);
            }
        }
    }
    lastframeX = sx;
}

function drawMultipleTrenches(sx, firstTime) {
    for (var i = 0; i < planeGeo.vertices.length; i+=(grid+1)) {
        for (var j = i; j < i+(grid+1); j++) {
            var x = j - i;
            var y = grid - i / (grid+1);
            var z = a*Math.pow(x,2) + b*Math.pow(y,2);
            for (var k = 0; k < trenches.length; k++) {
                var cur_sx = d * Math.pow(y, 2) + sx[k];
                if (x >= cur_sx - trenchWidth / 2 && x <= cur_sx + trenchWidth / 2) {
                    var theta = (x - cur_sx) / -(trenchWidth / 2) * Math.PI;
                    z += c * (Math.cos(theta) + 1) * t / tmax;
                }
                if (x == parseInt(cur_sx) && y == bally) {
                    ballx = cur_sx;
                    ballz = a * Math.pow(ballx, 2) + b * Math.pow(bally, 2) + 2 * c * t / tmax + ballRadius;
                }
            }
            if (firstTime) {
                planeGeo.vertices[j].y += (planeLength - planeWidth) / 2;
            }
            planeGeo.vertices[j].z = z;
        }
    }
}

function putBall() {
    ball.position.x = (ballx-grid/2)/grid*planeWidth;
    ball.position.y = (bally-10)/grid*planeLength;
    ball.position.z = ballz;
}

function produceMeshGroup() {

    /////////////////////////////////////////////////
    // Check for the various File API support.
    var data = "";

    function readTextFile(file)
    {
        var rawFile = new XMLHttpRequest();
        rawFile.open("GET", file, false);
        rawFile.onreadystatechange = function ()
        {
            if(rawFile.readyState === 4)
            {
                if(rawFile.status === 200 || rawFile.status == 0)
                {
                    data = rawFile.responseText;
                }
            }
        };
        rawFile.send(null);
    }

    readTextFile("./Pete.rcd");

    var arrayOfRecords = data.split("\n");
    for (var i = 0; i < arrayOfRecords.length; i++) {
        var thisLine = arrayOfRecords[i];
        var attributes = thisLine.split(",");
        var m_time = parseInt(attributes[0]);
        var m_bmi = parseFloat(attributes[1]);
        var m_sleep = parseInt(attributes[2]);
        var m_cal = parseInt(attributes[3]);
        var m_steps = parseInt(attributes[4]);
        var preset = m_sleep.toString()+"/"+m_cal.toString()+"/"+m_steps.toString();
        if (!(preset in bmiTable)) {
            bmiTable[preset] = {};
        }
        bmiTable[preset][m_time] = m_bmi;
    }
    /////////////////////////////////////////////////

    /////////////////////////////////////////////////
    var ageLineMaterial = new THREE.LineBasicMaterial({
        color: 0xFDFEFE,
        linewidth: 2,
        fog:true
    });

    var BMILineMaterial = new THREE.LineBasicMaterial({
        color: 0xEC7063,
        linewidth: 2,
        fog:true
    });

    var planeMaterial = new THREE.MeshPhongMaterial({
        color: 0x85C1E9,
        wireframe: wireFrameOn,
        side: THREE.DoubleSide
    });

    var ballMaterial = new THREE.MeshPhongMaterial({
        color: 0xE8F8F5,
        wireframe: wireFrameOn,
        shading: THREE.SmoothShading,
        shininess: 0
    });
    /////////////////////////////////////////////////


    group = new THREE.Group();

    planeGeo = new THREE.PlaneGeometry( planeWidth, planeLength, grid, grid );
    planeGeo.dynamic = true;

    // create line geometries to represent age
    for (var i = 0; i < grid/lineOffset; i ++) {
        var geometry = new THREE.Geometry();
        geometry.dynamic = true;
        for (var j = 0; j <= grid; j++) {
            geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ));
        }
        lineGeos.push(geometry);
    }

    // create line geometries to represent BMI
    for (var i = 0; i <= BMILineNum; i ++) {
        var geometry = new THREE.Geometry();
        geometry.dynamic = true;
        for (var j = 0; j <= grid; j++) {
            geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ));
        }
        lineGeos.push(geometry);
    }

    console.log(lineGeos.length);

    drawTrench(0, true);
    //drawMultipleTrenches(trenches, true);


    plane =  new THREE.Mesh( planeGeo, planeMaterial );
    group.add(plane);


    for (var i = 0; i < lineGeos.length; i++) {
        if (i < BMILineIndexOffset) {
            group.add( new THREE.Line (lineGeos[i], ageLineMaterial));
        } else {
            group.add(new THREE.Line(lineGeos[i], BMILineMaterial));
        }
    }

    ballGeo = new THREE.SphereGeometry( ballRadius, ballComplexity,  ballComplexity);
    ball = new THREE.Mesh( ballGeo, ballMaterial);
    group.add(ball);
    putBall();

    /////////////////////////////////////////////////
    // var xmlhttp;
    // if (window.XMLHttpRequest) {
    //     // code for IE7+, Firefox, Chrome, Opera, Safari
    //     xmlhttp = new XMLHttpRequest();
    // } else {
    //     // code for IE6, IE5
    //     xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    // }
    // xmlhttp.onreadystatechange = function() {
    //     if (this.readyState == 4 && this.status == 200) {
    //         console.log(this.responseText);
    //     }
    // };
    // var str = "Peter Griffin";
    // xmlhttp.open("GET","./get.php?q="+str,true);
    // xmlhttp.send();
    //
    // console.log(xmlhttp.responseText);
    /////////////////////////////////////////////////
}

function updateAll(timeOffset) {
    preset = sleep.toString()+"/"+calories.toString()+"/"+steps.toString();
    planeGeo.verticesNeedUpdate = true;
    for (var i = 0; i < lineGeos.length; i++) {
        lineGeos[i].verticesNeedUpdate = true;
    }
    drawTrench(timeOffset, false);
    putBall();
}
