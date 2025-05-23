import './style.css';
import * as THREE from 'three';
import GUI from 'lil-gui';
import Stats from 'stats-js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';

//追加
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

console.log(gsap);

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

//軸ヘルパー
// const axesHelper = new THREE.AxesHelper(2);
// scene.add(axesHelper);

//レンダラー
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.render(scene, camera);

//周囲光
const light = new THREE.AmbientLight(0xffffff, 5);
scene.add(light);

//オブジェクト
const mtlLoader = new MTLLoader();
mtlLoader.load('models/Panda/Panda.mtl', (materials) => {
  materials.preload();

  const objLoader = new OBJLoader();
  objLoader.setMaterials(materials);
  objLoader.load('models/Panda/Panda.obj', (obj) => {
    scene.add(obj);
    obj.scale.set(0.2, 0.2, 0.2);

    gsap
      .timeline({
        scrollTrigger: {
          trigger: '.trigger',
          start: 'top center',
          end: 'bottom center',
          toggleActions: 'restart none none none',
          scrub: true,
          markers: true,
        },
      })
      .set(obj.position, { x: -2, y: 3 })
      .to(obj.position, { y: 0, duration: 0.8, ease: 'power1.in' })
      .to(obj.position, { y: 2, duration: 0.6, ease: 'power1.out' })
      .to(obj.position, { y: 0, duration: 0.6, ease: 'power1.in' })
      .to(obj.position, { y: 1, duration: 0.4, ease: 'power1.out' })
      .to(obj.position, { y: 0, duration: 0.4, ease: 'power1.in' })
      .to(obj.position, { y: 0.5, duration: 0.2, ease: 'power1.out' })
      .to(obj.position, { y: 0, duration: 0.2, ease: 'power1.in' })
      .to(obj.position, { x: 2, duration: 3.2, ease: 'none' }, 0)
      .to(obj.rotation, { z: -Math.PI * 2, duration: 3.2, ease: 'none' }, 0);
  });
});

//更新
const update = () => {
  stats.begin();
  renderer.render(scene, camera);
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
