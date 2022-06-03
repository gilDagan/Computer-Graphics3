import {OrbitControls} from './OrbitControls.js'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


function degrees_to_radians(degrees)
{
  var pi = Math.PI;
  return degrees * (pi/180);
}

// Add here the rendering of your spaceship
const hullGeometry = new THREE.CylinderGeometry( 0.7, 0.7, 2.1, 32, 32);
const hullMaterial = new THREE.MeshBasicMaterial( {color: 0xcd5c5c } );
const hull = new THREE.Mesh(hullGeometry, hullMaterial);

const headGeometry = new THREE.ConeGeometry( 0.7, 1.8, 32, 32 );
const headMaterial = new THREE.MeshBasicMaterial( {color: 0xffa07a} );
const head = new THREE.Mesh( headGeometry, headMaterial );

const moveHeadAboveHull = new THREE.Matrix4();
moveHeadAboveHull.makeTranslation(0,1.955,0);

const shipGroup = new THREE.Group();
shipGroup.add(hull);
shipGroup.add(head);

scene.add( shipGroup );

head.applyMatrix4(moveHeadAboveHull);

const rotateShip = new THREE.Matrix4();
rotateShip.makeRotationY(degrees_to_radians(-8));

const scaleShip = new THREE.Matrix4();
scaleShip.makeScale(0.7,0.7,0.7);

shipGroup.applyMatrix4(rotateShip);
shipGroup.applyMatrix4(scaleShip);

const wingGeometry = new THREE.BufferGeometry();
const wingVertices = new Float32Array( [
	1, -0.5,  0.0,
	0.5, -0.5,  0.0,
	0.5,  0.5,  0.0,
] );

wingGeometry.setAttribute( 'position', new THREE.BufferAttribute( wingVertices, 3 ) );
const wingMaterial = new THREE.MeshBasicMaterial( { color: 0xbdb76b, side: THREE.DoubleSide });
const wing1 = new THREE.Mesh( wingGeometry, wingMaterial );
const wing2 = wing1.clone();
const wing3 = wing1.clone();

const wingsGroup = new THREE.Group();
wingsGroup.add(wing1);
wingsGroup.add(wing2);
wingsGroup.add(wing3);

hull.add(wingsGroup);

const rotateWing2 = new THREE.Matrix4();
rotateWing2.makeRotationY(degrees_to_radians(120));
wing2.applyMatrix4(rotateWing2);

const rotateWing3 = new THREE.Matrix4();
rotateWing3.makeRotationY(degrees_to_radians(240));
wing3.applyMatrix4(rotateWing3);

const moveWing1 = new THREE.Matrix4();
moveWing1.makeTranslation(0.2,-0.5,0);
wing1.applyMatrix4(moveWing1);

const moveWing2 = new THREE.Matrix4();
moveWing2.makeTranslation(0.2,-0.5,-0.262);
wing2.applyMatrix4(moveWing2);

const moveWing3 = new THREE.Matrix4();
moveWing3.makeTranslation(0,-0.5,0.215);
wing3.applyMatrix4(moveWing3);

const windowGeometry = new THREE.RingGeometry( 0.14, 0.2, 32 );
const windowMaterial = new THREE.MeshBasicMaterial( { color: 0x9acd32, side: THREE.DoubleSide } );
const window1 = new THREE.Mesh( windowGeometry, windowMaterial );
const window2 = window1.clone();
const windowGroup = new THREE.Group();
windowGroup.add(window1);
windowGroup.add(window2);
hull.add( windowGroup );

const moveWindows = new THREE.Matrix4();
moveWindows.makeTranslation(0,0.2,0.7);
windowGroup.applyMatrix4(moveWindows);

const rotateWindows = new THREE.Matrix4();
rotateWindows.makeRotationY(degrees_to_radians(35));
windowGroup.applyMatrix4(rotateWindows);

const moveWindow2 = new THREE.Matrix4();
moveWindow2.makeTranslation(0,0.53,0);
window2.applyMatrix4(moveWindow2);

const planetGeometry = new THREE.SphereGeometry( 3.5, 64, 32 );
const planetMaterial = new THREE.MeshBasicMaterial( { color: 0x708090 } );
const planet = new THREE.Mesh( planetGeometry, planetMaterial );
scene.add( planet );

const movePlanet = new THREE.Matrix4();
movePlanet.makeTranslation(-5,0,0);
planet.applyMatrix4(movePlanet);

const scalePlanet = new THREE.Matrix4();
scalePlanet.makeScale(0.7,0.7,0.7);
planet.applyMatrix4(scalePlanet)


// This defines the initial distance of the camera
const cameraTranslate = new THREE.Matrix4();
cameraTranslate.makeTranslation(0,0,5);
camera.applyMatrix4(cameraTranslate)

renderer.render( scene, camera );

let isWireframeEnabled = false;

const toggleWireframe = (e) => {
	if (e.key == "w" || e.key=="W"){
		scene.traverse(function(object){
			if(object.material){
				object.material.wireframe = !isWireframeEnabled;
			}
		})
		isWireframeEnabled = !isWireframeEnabled;
	}
}

document.addEventListener('keydown',toggleWireframe)

const translateAnimation = new THREE.Matrix4();
translateAnimation.makeTranslation(shipGroup.position.x - planet.position.x,shipGroup.position.y - planet.position.y,shipGroup.position.z - planet.position.z);

const rotateAnimation1 = new THREE.Matrix4();
rotateAnimation1.makeRotationY(degrees_to_radians(1));

const translateAnimationInvert = new THREE.Matrix4();
translateAnimationInvert.copy( translateAnimation ).invert()


let isAnimation1Enabled = false;

const toggleAnimation1 = (e) => {
	if (e.key == "1") {
		isAnimation1Enabled = !isAnimation1Enabled;
		animate1();
	}
}

document.addEventListener('keydown',toggleAnimation1)

function animate1() {
	if (isAnimation1Enabled) {
		requestAnimationFrame( animate1 );
		shipGroup.applyMatrix4(translateAnimation);
		shipGroup.applyMatrix4(rotateAnimation1);
		shipGroup.applyMatrix4(translateAnimationInvert);
		renderer.render( scene, camera );
	}
}

const rotateAnimation2 = new THREE.Matrix4();
rotateAnimation2.makeRotationZ(degrees_to_radians(1));

let isAnimation2Enabled = false;

const toggleAnimation2 = (e) => {
	if (e.key == "2") {
		isAnimation2Enabled = !isAnimation2Enabled;
		animate2();
	}
}

document.addEventListener('keydown',toggleAnimation2)

function animate2() {
	if (isAnimation2Enabled) {
		requestAnimationFrame( animate2 );
		shipGroup.applyMatrix4(translateAnimation);
		shipGroup.applyMatrix4(rotateAnimation2);
		shipGroup.applyMatrix4(translateAnimationInvert);

		renderer.render( scene, camera );
	}
}

let isAnimation3Enabled = false;

const toggleAnimation3 = (e) => {
	if (e.key == "3") {
		isAnimation3Enabled = !isAnimation3Enabled;
		animate3();
	}
}

document.addEventListener('keydown',toggleAnimation3);

let radius = 0.05;

function animate3() {
	if (isAnimation3Enabled) {
		requestAnimationFrame( animate3 );
		let xPos = 1;
		let yPos = 1;
		let zPos = 1;

		let includeY = 0;
		let includeZ = 0;

		if (isAnimation1Enabled && isAnimation2Enabled){ //orbit in y and z axis
			includeY = 0;
			includeZ = 0;
		}
		else if (isAnimation1Enabled){ //orbit in y axis
			includeY = 0;
			includeZ = 1;
		}
		else { //orbit in z axis
			includeZ = 0;
			includeY = 1;
		}

		if (shipGroup.position.x < planet.position.x){ //The ship is to the left of the planet
			xPos = -1;
		}
		if (shipGroup.position.y < planet.position.y) { //The ship is under the planet
			yPos = -1;
		}
		if (shipGroup.position.z < planet.position.z) {
			zPos = -1;
		}

		const translateAnimation3 = new THREE.Matrix4();
		translateAnimation3.makeTranslation(radius * xPos , radius * yPos * includeY , radius * zPos* includeZ);
		shipGroup.applyMatrix4(translateAnimation3);
		renderer.render( scene, camera );
	}
}


const controls = new OrbitControls( camera, renderer.domElement );

let isOrbitEnabled = true;

const toggleOrbit = (e) => {
	if (e.key == "o"){
		isOrbitEnabled = !isOrbitEnabled;
	}
}

document.addEventListener('keydown',toggleOrbit)

//controls.update() must be called after any manual changes to the camera's transform
controls.update();

function animate() {

	requestAnimationFrame( animate );

	controls.enabled = isOrbitEnabled;
	controls.update();

	renderer.render( scene, camera );

}
animate()