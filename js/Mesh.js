/**
 * Created by felix on 31/1/17.
 */

var plane, ball, planeGeo, ballGeo;
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
var t = 2;
var wireFrameOn = true;
var group;

function drawTrench(sx, firstTime) {
    for (var i = 0; i < planeGeo.vertices.length; i+=(grid+1)) {
        for (var j = i; j < i+(grid+1); j++) {
            var x = j - i;
            var y = grid - i / (grid+1);
            var z = a*Math.pow(x,2) + b*Math.pow(y,2);
            var cur_sx = d*Math.pow(y,2) + sx;
            if (x >= cur_sx - trenchWidth/2 && x <= cur_sx + trenchWidth/2) {
                var theta = (x - cur_sx)/-(trenchWidth/2)*Math.PI;
                z += c*(Math.cos(theta)+1)*t/tmax;
            }
            if (x == parseInt(cur_sx) && y == bally) {
                ballx = cur_sx;
                ballz = z;
            }
            if (firstTime) {
                planeGeo.vertices[j].y += (planeLength - planeWidth)/2;
            }
            planeGeo.vertices[j].z = z;
        }
    }
}

function putBall() {
    ball.position.x = (ballx-grid/2)/grid*planeWidth;
    ball.position.y = (bally-10)/grid*planeLength;
    ball.position.z = a*Math.pow(ballx,2) + b*Math.pow(bally,2) + c*t/tmax + ballRadius - 0.2;
}

function produceMeshGroup() {
    planeGeo = new THREE.PlaneGeometry( planeWidth, planeLength, grid, grid );
    planeGeo.dynamic = true;

    drawTrench(sx, true);

    var planeMaterial = new THREE.MeshPhongMaterial({
        color: 0x6699CC,
        side: THREE.DoubleSide,
        wireframe: wireFrameOn,
        shading: THREE.flatShading,
        shininess: 20
    });
    plane =  new THREE.Mesh( planeGeo, planeMaterial );


    group = new THREE.Group();
    group.add(plane);

    ballGeo = new THREE.SphereGeometry( ballRadius, ballComplexity,  ballComplexity);

    var ballMaterial = new THREE.MeshPhongMaterial({
        color: 0x99FFCC,
        wireframe: wireFrameOn,
        shading: THREE.SmoothShading,
        shininess: 500
    });

    ball = new THREE.Mesh( ballGeo, ballMaterial);

    group.add(ball);
    putBall();

    var materialy = new THREE.LineBasicMaterial({ color: 0x138D75 });

    var yaxisGeo = new THREE.Geometry();
    yaxisGeo.vertices.push( new THREE.Vector3( -5, -5, 0 ), new THREE.Vector3( -5, 5, 0 ) );
    var yaxis = new THREE.Line( yaxisGeo, materialy );
    group.add( yaxis );

    var materialx = new THREE.LineBasicMaterial({ color: 0xFF0033 });

    var xaxisGeo = new THREE.Geometry();
    xaxisGeo.vertices.push( new THREE.Vector3( -5, -5, 0 ), new THREE.Vector3( 5, -5, 0 ) );
    var xaxis = new THREE.Line( xaxisGeo, materialx );
    group.add( xaxis );

    var materialz = new THREE.LineBasicMaterial({ color: 0x2471A3 });

    var zaxisGeo = new THREE.Geometry();
    zaxisGeo.vertices.push( new THREE.Vector3( -5, -5, 0 ), new THREE.Vector3( -5, -5, 10 ) );
    var zaxis = new THREE.Line( zaxisGeo, materialz );
    group.add( zaxis );

}

function updateAll(cur_sx) {
    planeGeo.verticesNeedUpdate = true;
    drawTrench(cur_sx, false);
    putBall();
}
