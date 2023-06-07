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

// Lưu trữ các đối tượng hành tinh đã tạo
const planets = {
  mercury,
  venus,
  earth,
  mars,
  jupiter,
  saturn,
  uranus,
  neptune,
  pluto
};

// Lấy các phần tử checkbox hành tinh từ HTML
const checkboxes = document.querySelectorAll('input[name="planet"]');

// Lấy nút "Hủy hành tinh" từ HTML
const deleteButton = document.getElementById('deletePlanetButton');
const restoreButton = document.getElementById('restorePlanetButton');

// Xử lý sự kiện khi nút "Hủy hành tinh" được nhấp
deleteButton.addEventListener('click', function() {
  // Duyệt qua từng checkbox
  checkboxes.forEach(function(checkbox) {
    // Kiểm tra xem checkbox có được chọn không
    if (checkbox.checked) {
      const planetName = checkbox.value;
      // Kiểm tra xem tên hành tinh có tồn tại trong đối tượng planets không
      if (planets.hasOwnProperty(planetName)) {
        const planet = planets[planetName];
        // Xóa đối tượng hành tinh khỏi scene
        scene.remove(planet.obj);
      }
    }
  });

  // Vô hiệu hóa nút "Hủy hành tinh"
  deleteButton.disabled = true;
});

// ...

// Xử lý sự kiện khi các checkbox thay đổi trạng thái
checkboxes.forEach(function(checkbox) {
  checkbox.addEventListener('change', function() {
    const planetName = checkbox.value;
    if (planets.hasOwnProperty(planetName)) {
      const planet = planets[planetName];
      
      if (checkbox.checked) {
        // Nếu checkbox được chọn, hiển thị hành tinh
        if (!scene.contains(planet.obj)) {
          scene.add(planet.obj);
        }
      } else {
        // Nếu checkbox không được chọn, ẩn hành tinh
        if (scene.contains(planet.obj)) {
          scene.remove(planet.obj);
        }
      }
    }
    
    // Kiểm tra xem có checkbox nào được chọn hay không
    const anyCheckboxChecked = Array.from(checkboxes).some(function(checkbox) {
      return checkbox.checked;
    });

    // Kích hoạt hoặc vô hiệu hóa nút "Hủy hành tinh" dựa trên trạng thái checkbox
    deleteButton.disabled = !anyCheckboxChecked;
  });
});

// Xử lý sự kiện khi nút "Khôi phục hành tinh" được nhấp
restoreButton.addEventListener('click', function() {
  // Duyệt qua từng checkbox
  checkboxes.forEach(function(checkbox) {
    const planetName = checkbox.value;
    // Kiểm tra xem tên hành tinh có tồn tại trong đối tượng planets không
    if (planets.hasOwnProperty(planetName)) {
      const planet = planets[planetName];
      
      // Kiểm tra xem hành tinh có bị ẩn không
      if (!scene.contains(planet.obj)) {
        // Hiển thị hành tinh bằng cách thêm nó vào scene
        scene.add(planet.obj);
        // Đặt lại trạng thái checkbox
        checkbox.checked = true;
      }
    }
  });

  // Kích hoạt tất cả các checkbox và vô hiệu hóa nút "Khôi phục hành tinh"
  checkboxes.forEach(function(checkbox) {
    checkbox.disabled = false;
  });
  restoreButton.disabled = true;
});
// ...


const pointLight = new THREE.PointLight(0xFFFFFF, 2, 300);
scene.add(pointLight);

let rotationSpeed = 0.004; // Tốc độ ban đầu

function adjustRotationSpeed(speed) {
rotationSpeed = speed;
}

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