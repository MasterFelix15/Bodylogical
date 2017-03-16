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
var trenches = [65, 70];
var t = 2;
var wireFrameOn = false;
var group;

var lineStartY = 1;
var lineOffset = 2;
var BMILineNum = 20;
var BMILineIndexOffset = grid/lineOffset;
var lineGeos = [];

var lastframeX = sx;

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

function drawTrench(sx, firstTime) {
    var ageLineOffset = Math.sqrt((sx-lastframeX)/d);
    console.log(ageLineOffset);
    for (var i = planeGeo.vertices.length - grid - 1; i >= 0; i-=(grid+1)) {
        for (var j = i; j < i+(grid+1); j++) {
            var x = j - i;
            var y = parseInt(grid - i / (grid+1));
            var z = a*Math.pow(x,2) + b*Math.pow(y,2);
            var cur_sx = d*Math.pow(y,2) + sx;
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
                lineGeos[(y-lineStartY)/lineOffset].vertices[x] = new THREE.Vector3 (
                    planeGeo.vertices[j].x,
                    planeGeo.vertices[j].y,
                    planeGeo.vertices[j].z + 0.01);
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

    drawTrench(sx, true);
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

}

function updateAll(cur_sx) {
    planeGeo.verticesNeedUpdate = true;
    for (var i = 0; i < lineGeos.length; i++) {
        lineGeos[i].verticesNeedUpdate = true;
    }

    drawTrench(cur_sx, false);
    putBall();
}
