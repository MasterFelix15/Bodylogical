/**
 * Created by felix on 25/1/17.
 */
// set the camera
var camera = new THREE.PerspectiveCamera( 80, window.innerWidth/window.innerHeight, 0.1, 1000 );
var scene = new THREE.Scene();

// initialize renderer
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor( 0xCCCCCC);
document.body.appendChild( renderer.domElement );

var ballx;

var planeGeo = new THREE.PlaneGeometry( 10, 10, grid, grid );
//customize plane function
for (var i = 0; i < planeGeo.vertices.length; i+=(grid+1)) {
    for (var j = i; j < i+(grid+1); j++) {
        var x = j - i;
        var y = grid - i / (grid+1);
        var z = a*Math.pow(x,2) + b*Math.pow(y,2);
        var cur_sx = d*Math.pow(y,2) + sx;
        if (x >= cur_sx - 10 && x <= cur_sx + 10) {
            var theta = (x - cur_sx)/-10*Math.PI;
            z += c*(Math.cos(theta)+1)*t/tmax;
        }
        if (x == parseInt(cur_sx) && y == bally) {
            ballx = parseInt(cur_sx);
            ballz = z;
        }
        planeGeo.vertices[j].z = z;
    }
}

var planeMaterial = new THREE.MeshPhongMaterial({
    color: 0x6699CC,
    side: THREE.DoubleSide,
    wireframe: wireFrameOn,
    shading: THREE.flatShading,
    shininess: 20
});
var plane =  new THREE.Mesh( planeGeo, planeMaterial );
var group = new THREE.Group();
scene.add(group);
group.add(plane);

var ballGeo = new THREE.SphereGeometry( ballRadius, ballComplexity,  ballComplexity);

var ballMaterial = new THREE.MeshPhongMaterial({
    color: 0x99FFCC,
    wireframe: wireFrameOn,
    shading: THREE.SmoothShading,
    shininess: 500
});

var ball = new THREE.Mesh( ballGeo, ballMaterial);

group.add(ball);
ball.position.x = (ballx-50)/100*10;
ball.position.y = (bally-50)/100*10;
ball.position.z = ballz + ballRadius;

var materialy = new THREE.LineBasicMaterial({ color: 0x138D75 });

var yaxisGeo = new THREE.Geometry();
yaxisGeo.vertices.push( new THREE.Vector3( -5, -5, 0 ), new THREE.Vector3( -5, 5, 0 ) );
var yaxis = new THREE.Line( yaxisGeo, materialy );
scene.add( yaxis );

var materialx = new THREE.LineBasicMaterial({ color: 0xFF0033 });

var xaxisGeo = new THREE.Geometry();
xaxisGeo.vertices.push( new THREE.Vector3( -5, -5, 0 ), new THREE.Vector3( 5, -5, 0 ) );
var xaxis = new THREE.Line( xaxisGeo, materialx );
scene.add( xaxis );

var materialz = new THREE.LineBasicMaterial({ color: 0x2471A3 });

var zaxisGeo = new THREE.Geometry();
zaxisGeo.vertices.push( new THREE.Vector3( -5, -5, 0 ), new THREE.Vector3( -5, -5, 10 ) );
var zaxis = new THREE.Line( zaxisGeo, materialz );
scene.add( zaxis );

// customize light source color, position
var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
directionalLight.position.set( 20, 20, 20 );
var directionalLight2 = new THREE.DirectionalLight( 0xffffff, 1 );
directionalLight2.position.set( -20, -20, -20 );
scene.add( directionalLight );
scene.add( directionalLight2 );


// customize camera position
camera.position.z = 10;

// integrate OrbitControls API
var controls = new THREE.OrbitControls( camera, renderer.domElement );
controls.minDistance = 1;
controls.maxDistance = 100;

// render
var render = function () {
    requestAnimationFrame( render );
    renderer.render(scene, camera);
};

// handle window resize event
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}


function onKeyDown( event ) {
    if (event.keyCode == 82) {
        reset();
    }
}

// event handlers
function toggleInScript() {
    wireFrameOn = false;
    reset();
}

render();


window.addEventListener( 'keydown', onKeyDown, false );
window.addEventListener( 'resize', onWindowResize, false );
