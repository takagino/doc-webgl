import './style.css';
import * as THREE from 'three';
import GUI from 'lil-gui';
import Stats from 'stats-js';

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
const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper);

//レンダラー
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.render(scene, camera);

//オブジェクト
const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshNormalMaterial());
scene.add(cube);

gui.add(cube.rotation, 'x', 0, Math.PI * 2, 0.01).name('X軸回転');
gui.add(cube.rotation, 'y', 0, Math.PI * 2, 0.01).name('Y軸回転');
gui.add(cube.rotation, 'z', 0, Math.PI * 2, 0.01).name('Z軸回転');

//gsap
gsap
  .timeline({
    repeat: -1,
    repeatDelay: 2,
  })
  .set(cube.position, { y: 3 })
  .to(cube.position, { y: 0, duration: 0.8, ease: 'power1.in' })
  .to(cube.position, { y: 2, duration: 0.6, ease: 'power1.out' })
  .to(cube.position, { y: 0, duration: 0.6, ease: 'power1.in' })
  .to(cube.position, { y: 1, duration: 0.4, ease: 'power1.out' })
  .to(cube.position, { y: 0, duration: 0.4, ease: 'power1.in' })
  .to(cube.position, { y: 0.5, duration: 0.2, ease: 'power1.out' })
  .to(cube.position, { y: 0, duration: 0.2, ease: 'power1.in' });

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
