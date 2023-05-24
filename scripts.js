import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';

import starsTexture from '../img/stars.jpg';
import sunTexture from '../img/sun.jpg';
import mercuryTexture from '../img/mercury.jpg';
import venusTexture from '../img/venus.jpg';
import earthTexture from '../img/earth.jpg';
import marsTexture from '../img/mars.jpg';
import jupiterTexture from '../img/jupiter.jpg';
import saturnTexture from '../img/saturn.jpg';
import saturnRingTexture from '../img/saturn ring.png';
import uranusTexture from '../img/uranus.jpg';
import uranusRingTexture from '../img/uranus ring.png';
import neptuneTexture from '../img/neptune.jpg';
import plutoTexture from '../img/pluto.jpg';

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.set(-90, 140, 140);
orbit.update();

const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture
]);

const textureLoader = new THREE.TextureLoader();

const sunGeo = new THREE.SphereGeometry(16, 30, 30);
const sunMat = new THREE.MeshBasicMaterial({
    map: textureLoader.load(sunTexture)
});
const sun = new THREE.Mesh(sunGeo, sunMat);
scene.add(sun);

function createPlanete(size, texture, position, ring) {
    const geo = new THREE.SphereGeometry(size, 30, 30);
    const mat = new THREE.MeshStandardMaterial({
        map: textureLoader.load(texture)
    });
    const mesh = new THREE.Mesh(geo, mat);
    const obj = new THREE.Object3D();
    obj.add(mesh);
    if(ring) {
        const ringGeo = new THREE.RingGeometry(
            ring.innerRadius,
            ring.outerRadius,
            32);
        const ringMat = new THREE.MeshBasicMaterial({
            map: textureLoader.load(ring.texture),
            side: THREE.DoubleSide
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        obj.add(ringMesh);
        ringMesh.position.x = position;
        ringMesh.rotation.x = -0.5 * Math.PI;
    }
    scene.add(obj);
    mesh.position.x = position;
    return {mesh, obj}
}

const mercury = createPlanete(3.2, mercuryTexture, 28);
const venus = createPlanete(5.8, venusTexture, 44);
const earth = createPlanete(6, earthTexture, 62);
const mars = createPlanete(4, marsTexture, 78);
const jupiter = createPlanete(12, jupiterTexture, 100);
const saturn = createPlanete(10, saturnTexture, 138, {
    innerRadius: 10,
    outerRadius: 20,
    texture: saturnRingTexture
});
const uranus = createPlanete(7, uranusTexture, 176, {
    innerRadius: 7,
    outerRadius: 12,
    texture: uranusRingTexture
});
const neptune = createPlanete(7, neptuneTexture, 200);
const pluto = createPlanete(2.8, plutoTexture, 216);

const pointLight = new THREE.PointLight(0xFFFFFF, 2, 300);
scene.add(pointLight);

let rotationSpeed = 0.004; // Tốc độ ban đầu

function adjustRotationSpeed(speed) {
rotationSpeed = speed;
}
// const speedControl = document.createElement('div');
// speedControl.style.position = 'absolute';
// speedControl.style.top = '10px';
// speedControl.style.left = '10px';
// speedControl.style.zIndex = '9999';

// const speedSlider = document.createElement('input');
// speedSlider.type = 'range';
// speedSlider.min = '0.1';
// speedSlider.max = '1';
// speedSlider.step = '0.1';
// speedSlider.value = '0.5';
// speedSlider.style.width = '150px';

// speedControl.appendChild(speedSlider);
// document.body.appendChild(speedControl);

// const speedSlider = document.getElementById('speed-slider');
// let rotationSpeed = parseFloat(speedSlider.value);

// speedSlider.addEventListener('input', function(event) {
//   rotationSpeed = parseFloat(event.target.value);
// });

function animate() {
    //Self-rotation
    sun.rotateY(rotationSpeed);
    mercury.mesh.rotateY(rotationSpeed);
    venus.mesh.rotateY(rotationSpeed);
    earth.mesh.rotateY(rotationSpeed);
    mars.mesh.rotateY(rotationSpeed);
    jupiter.mesh.rotateY(rotationSpeed);
    saturn.mesh.rotateY(rotationSpeed);
    uranus.mesh.rotateY(rotationSpeed);
    neptune.mesh.rotateY(rotationSpeed);
    pluto.mesh.rotateY(rotationSpeed);
    
    //Around-sun-rotation
    mercury.obj.rotateY(rotationSpeed * 10);
    venus.obj.rotateY(rotationSpeed * 4);
    earth.obj.rotateY(rotationSpeed * 2);
    mars.obj.rotateY(rotationSpeed * 1.8);
    jupiter.obj.rotateY(rotationSpeed * 4);
    saturn.obj.rotateY(rotationSpeed * 3.8);
    uranus.obj.rotateY(rotationSpeed * 3);
    neptune.obj.rotateY(rotationSpeed * 3.2);
    pluto.obj.rotateY(rotationSpeed * 0.8);
    
    renderer.render(scene, camera);
}


renderer.setAnimationLoop(animate);

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});