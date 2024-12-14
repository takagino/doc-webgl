import "./style.css";
import * as THREE from "three";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "stats-js";

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

//レンダラー
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);

let text;
const material = new THREE.MeshMatcapMaterial({ color: 0x99cc00 });

const group = new THREE.Group();
scene.add(group);

//桁数を揃える
const leftFillNum = (num) => {
  return num.toString().padStart(2, "0");
};

const drawTime = (font) => {
  group.remove(text);
  const now = new Date();
  const hour = leftFillNum(now.getHours());
  const minute = leftFillNum(now.getMinutes());
  const second = leftFillNum(now.getSeconds());
  const milliSecond = now.getMilliseconds();
  const currentTime = `${hour}:${minute}:${second}`;

  const textGeometry = new TextGeometry(currentTime, {
    font: font,
    size: 1,
    depth: 0.1,
    curveSegments: 1,
    bevelEnabled: true,
    bevelThickness: 0.1,
    bevelSize: 0.1,
  });
  textGeometry.center();
  text = new THREE.Mesh(textGeometry, material);
  group.add(text);

  setTimeout(drawTime, 1000 - milliSecond, font);
};

//フォントの読み込み
const fontLoader = new FontLoader();
fontLoader.load("./fonts/helvetiker_regular.typeface.json", (font) => {
  setTimeout(drawTime, 10, font);
});

//オブジェクト追加
for (let i = 0; i < 80; i++) {
  const geometry = new THREE.BoxGeometry();
  const box = new THREE.Mesh(geometry, material);

  box.position.x = (Math.random() - 0.5) * 10;
  box.position.y = (Math.random() - 0.5) * 10;
  box.position.z = (Math.random() - 0.5) * 10;
  box.rotation.x = Math.random() * Math.PI;
  box.rotation.y = Math.random() * Math.PI;
  const scale = Math.random();
  box.scale.set(scale, scale, scale);
  group.add(box);
}

/*--------------------
イベント時の処理
--------------------*/

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

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
const clock = new THREE.Clock();

const animate = () => {
  stats.begin();
  renderer.render(scene, camera);
  stats.end();

  const elapsedTime = clock.getElapsedTime();

  //group.rotation.x = elapsedTime * 0.05;
  group.rotation.y = elapsedTime * 0.05;
  group.rotation.z = elapsedTime * 0.05;

  controls.update();

  requestAnimationFrame(animate);
};

animate();
