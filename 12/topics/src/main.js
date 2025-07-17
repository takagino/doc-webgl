import './style.css';
import * as THREE from 'three';
import GUI from 'lil-gui';
import Stats from 'stats-js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { DragControls } from 'three/examples/jsm/controls/DragControls.js';

//UIデバッグ
const gui = new GUI();

//FPSデバッグ
const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

//シーン
const scene = new THREE.Scene();

//カメラ
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight);
camera.position.z = 5;
scene.add(camera);

const loader = new THREE.CubeTextureLoader();
const environmentMap = loader.load([
  'textures/cube/posx.jpg', // 右面
  'textures/cube/negx.jpg', // 左面
  'textures/cube/posy.jpg', // 上面
  'textures/cube/negy.jpg', // 下面
  'textures/cube/posz.jpg', // 前面
  'textures/cube/negz.jpg', // 背面
]);

scene.background = environmentMap;

//周囲光
const light = new THREE.AmbientLight(0xffffff, 5);
scene.add(light);

//軸ヘルパー
const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper);

//レンダラー
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.render(scene, camera);

//コントロール
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

//ドラッグコントロール
const draggableObjects = [];
const dragControls = new DragControls(draggableObjects, camera, renderer.domElement);

dragControls.addEventListener('dragstart', (event) => (controls.enabled = false));
dragControls.addEventListener('dragend', () => (controls.enabled = true));

function createNumberTexture(number) {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');

  // 背景
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, size, size);

  // 数字
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 64px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(number, size / 2, size / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

let expectedNumber = 1;

const texture = createNumberTexture(1);
const box = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ map: texture })
);

box.position.set(
  (Math.random() - 0.5) * 30,
  (Math.random() - 0.5) * 10,
  (Math.random() - 0.5) * 30
);
box.name = 1;

scene.add(box);
draggableObjects.push(box);

// レイキャスター
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// 要素の取得
const info = document.getElementById('info');

window.addEventListener('click', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(draggableObjects, true); // 変更

  intersects.forEach((intersect) => {
    if (intersect.object.isMesh) {
      const target = intersect.object;
      const clickedNumber = target.name;

      if (clickedNumber === expectedNumber) {
        target.material.color.set(0x00ff00); // 正解 → 緑
        info.textContent = `${target.name} がクリックされました`;
        expectedNumber++;

        if (expectedNumber >= draggableObjects.length + 1) {
          info.textContent = '全ての数字をクリックしました！';
        }
      }
    }
  });
});

//更新
const update = () => {
  stats.begin();
  renderer.render(scene, camera);
  controls.update();
  stats.end();
  window.requestAnimationFrame(update);
};

update();

//ウィンドウリサイズ
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
