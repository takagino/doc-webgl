import * as THREE from "three";
import GUI from 'lil-gui';
import Stats from 'stats-js';
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

//UIデバッグ
const gui = new GUI();

//FPSデバッグ
const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);


/*--------------------
必須項目
--------------------*/

//キャンバスの取得
const canvas = document.querySelector("#webgl");

//サイズ
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

//シーン
const scene = new THREE.Scene();

//カメラ
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  1000
);
camera.position.set(0, 0, 6);
scene.add(camera);

//周囲光
const light = new THREE.AmbientLight(0xffffff, 1);
scene.add(light);

//レンダラー
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);

/*--------------------
3Dモデル
--------------------*/

//GLTFデータの読み込み
const gltfLoader = new GLTFLoader();
gltfLoader.load("/models/tetora/scene.gltf", (gltf) => {
  gltf.scene.scale.set(0.05, 0.05, 0.05);
  gltf.scene.rotation.set(-1.1, 0, -0.3);
  scene.add(gltf.scene);
});

/*--------------------
イベント時の処理
--------------------*/

window.addEventListener("resize", () => {
  //サイズのアップデート
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  //カメラのアップデート
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  //レンダラーのアップデート
  renderer.setSize(sizes.width, sizes.height);
});

//アニメーション
const animate = () => {
  stats.begin();
  renderer.render(scene, camera);
  stats.end();

  requestAnimationFrame(animate);
};

animate();
