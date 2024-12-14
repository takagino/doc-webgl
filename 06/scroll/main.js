import "./style.css";
import * as THREE from "three";
import GUI from "lil-gui";
import Stats from "stats-js";

//追加
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

console.log(gsap);

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

//ライト
const directionalLight = new THREE.DirectionalLight(0xffffff, 4);
directionalLight.position.set(0.5, 1, 0);
scene.add(directionalLight);

//レンダラー
const renderer = new THREE.WebGLRenderer({
  canvas: canvas, //「キャンバスの取得」で取得した要素に設定
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);

//オブジェクトの追加
const boxGeometry = new THREE.BoxGeometry(5, 5, 5, 10);
const boxMaterial = new THREE.MeshNormalMaterial();
const box = new THREE.Mesh(boxGeometry, boxMaterial);
box.position.set(0, 0.5, -15);
box.rotation.set(1, 1, 0);

scene.add(box);

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

gsap.fromTo(
  boxGeometry.parameters,
  {},
  {
    width: 3,
    scrollTrigger: {
      trigger: "#projects",
      start: "top 80%",
      end: "bottom 20%",
      markers: true,
      scrub: true,
    },
  }
);

gsap.fromTo(
  box.position,
  {},
  {
    x: 5,
    z: 0,
    scrollTrigger: {
      trigger: "#skills",
      start: "top 80%",
      end: "bottom 20%",
      markers: true,
      scrub: true,
    },
  }
);
