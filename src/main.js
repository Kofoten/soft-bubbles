import * as THREE from "three";

import vertexShader from "./shaders/vertex.glsl?raw";
import fragmentShader from "./shaders/fragment.glsl?raw";

const worldSize = 20;
const halfWorld = worldSize / 2;

const urlParams = new URLSearchParams(window.location.search);
const countParamValue = parseInt(urlParams.get('count'), 10);
const minSizeParamValue = parseFloat(urlParams.get('minsize'), 10);
const maxSizeParamValue = parseFloat(urlParams.get('maxsize'), 10);
const sizeRateParamValue = parseFloat(urlParams.get('sizerate'), 10);
const speedMultParamValue = parseFloat(urlParams.get('speedmult'), 10);
const minSpeedParamValue = parseFloat(urlParams.get('minspeed'), 10);

const count = Number.isFinite(countParamValue) ? countParamValue : 500;
const minSize = Number.isFinite(minSizeParamValue) ? minSizeParamValue : 5;
const maxSize = Number.isFinite(maxSizeParamValue) ? maxSizeParamValue : 15;
const sizeRate = Number.isFinite(sizeRateParamValue) ? sizeRateParamValue : 1;
const speedMult = Number.isFinite(speedMultParamValue) ? speedMultParamValue : 1;
const minSpeed = Number.isFinite(minSpeedParamValue) ? minSpeedParamValue : 2;

const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-10, 10, 10, -10);
camera.position.z = 10;

const renderer = new THREE.WebGLRenderer();
document.body.appendChild(renderer.domElement);

const clock = new THREE.Clock();

const color = new THREE.Color();
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(count * 3);
const sizes = new Float32Array(count);
const rates = new Float32Array(count);
const speeds = new Float32Array(count);
const colors = new Float32Array(count * 3);
const directions = new Float32Array(count * 2);

geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

const material = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  transparent: true,
  blending: THREE.AdditiveBlending,
});

const particles = new THREE.Points(geometry, material);
for (let i = 0; i < count; i++) {
  const i2 = i * 2;
  const i3 = i * 3;

  positions[i3] = (Math.random() - 0.5) * worldSize;
  positions[i3 + 1] = (Math.random() - 0.5) * worldSize;

  sizes[i] = Math.random() * (maxSize - minSize) + minSize;

  speeds[i] = Math.random() * speedMult + minSpeed;

  rates[i] = Math.random() * sizeRate + 0.1;

  directions[i2] = Math.random() * 2 - 1;
  directions[i2 + 1] = Math.random() * 2 - 1;

  color.setHSL(Math.random(), 1, 0.5);
  colors[i3] = color.r;
  colors[i3 + 1] = color.g;
  colors[i3 + 2] = color.b;
}

scene.add(particles);

function animate() {
  const deltaTime = clock.getDelta();

  const positionsAttribute = particles.geometry.attributes.position;
  const sizesAttribute = particles.geometry.attributes.size;

  for (let i = 0; i < count; i++) {
    const i2 = i * 2;
    const i3 = i * 3;

    const sizeSpeedMultiplier = 1.5 - sizesAttribute.array[i] / maxSize;
    positionsAttribute.array[i3] +=
      directions[i2] * speeds[i] * sizeSpeedMultiplier * deltaTime;
    positionsAttribute.array[i3 + 1] +=
      directions[i2 + 1] * speeds[i] * sizeSpeedMultiplier * deltaTime;
    sizesAttribute.array[i] += rates[i] * deltaTime;

    if (sizesAttribute.array[i] < minSize) {
      rates[i] = Math.random() * sizeRate + 0.1;
    } else if (sizesAttribute.array[i] > maxSize) {
      rates[i] = (Math.random() * sizeRate + 0.1) * -1;
    }

    if (positionsAttribute.array[i3] < -halfWorld) {
      positionsAttribute.array[i3] = -halfWorld;
      directions[i2] *= -1;
    }

    if (positionsAttribute.array[i3] > halfWorld) {
      positionsAttribute.array[i3] = halfWorld;
      directions[i2] *= -1;
    }

    if (positionsAttribute.array[i3 + 1] < -halfWorld) {
      positionsAttribute.array[i3 + 1] = -halfWorld;
      directions[i2 + 1] *= -1;
    }

    if (positionsAttribute.array[i3 + 1] > halfWorld) {
      positionsAttribute.array[i3 + 1] = halfWorld;
      directions[i2 + 1] *= -1;
    }
  }

  positionsAttribute.needsUpdate = true;
  sizesAttribute.needsUpdate = true;

  renderer.render(scene, camera);
}

function onResize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.updateProjectionMatrix();
}

renderer.setAnimationLoop(animate);
window.addEventListener("resize", onResize);
onResize();
