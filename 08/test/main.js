import './style.css';
import * as THREE from "three";
import GUI from 'lil-gui';
import Stats from 'stats-js';
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { MTLLoader } from "three/addons/loaders/MTLLoader.js";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
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
const lightFolder = gui.addFolder("Light");
lightFolder.add(light, "intensity", 0, 3, 0.01).name("AmbientLight");

//平行光源
const directionalLight = new THREE.DirectionalLight(0xff0fff, 0.5);
scene.add(directionalLight);
directionalLight.position.set(3, 3, 0);

lightFolder.add(directionalLight, "intensity", 0, 3, 0.01).name("DirectionalLight");

//半球光源
const hemisphereLight = new THREE.HemisphereLight(0x0fffff, 0xffff00, 0.5);
scene.add(hemisphereLight);

lightFolder.add(hemisphereLight, "intensity", 0, 3, 0.01).name("HemisphereLight");

//レンダラー
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);

const axesHelper = new THREE.AxesHelper( 2 );
scene.add(axesHelper);

/*--------------------
3Dモデル
--------------------*/

//床
const planeGeometry = new THREE.PlaneGeometry(10, 10);
const material = new THREE.MeshNormalMaterial();
const plane = new THREE.Mesh(planeGeometry, material);
scene.add(plane);
plane.position.set(0, -0.5, 0);
plane.rotation.x = -Math.PI * 0.5;

//オブジェクトの追加
const key = {
  up: false,
  down: false,
  right: false,
  left: false,
  space: false,
};

//グループの追加
const group = new THREE.Group();
scene.add(group);

const gltfLoader = new GLTFLoader();
gltfLoader.load("models/acorn/scene.gltf", (gltf) => {
  gltf.scene.scale.set(0.5, 0.5, 0.5);
  //scene.add(gltf.scene);
});

//テクスチャの読み込み
const mtlLoader = new MTLLoader();
mtlLoader.load("models/Risu/Squirrel-bl.mtl", (materials) => {
  materials.preload();

  //OBJデータの読み込み
  const objLoader = new OBJLoader();
  objLoader.setMaterials(materials); //追加
  objLoader.load("models/Risu/Squirrel-bl.obj", (obj) => {
    group.add(obj);

    const scl = {
      val: 0.5,
    };
    obj.scale.set(scl.val, scl.val, scl.val);

    const scaleFolder = gui.addFolder("Scale");
    scaleFolder.add(scl, "val", 0.1, 1, 0.01).onChange((val) => {
      obj.scale.set(val, val, val);
    });

    const positionFolder = gui.addFolder( 'Position' );
    positionFolder.add(obj.position, "x", -10, 10, 0.1);
    positionFolder.add(obj.position, "y", -10, 10, 0.1);
    positionFolder.add(obj.position, "z", -10, 10, 0.1);

    const rotationFolder = gui.addFolder( 'Rotation' );
    rotationFolder.add(obj.rotation, "x", -10, 10, 0.1);
    rotationFolder.add(obj.rotation, "y", -10, 10, 0.1);
    rotationFolder.add(obj.rotation, "z", -10, 10, 0.1);

    // キーダウンイベント設定（変更）
    document.addEventListener("keydown", (e) => {
      switch (e.code) {
        case "ArrowUp":
          key.up = true;
          obj.rotation.y = 3;
          break;
        case "ArrowDown":
          key.down = true;
          obj.rotation.y = 0;
          break;
        case "ArrowRight":
          key.right = true;
          obj.rotation.y = 1.5;
          break;
        case "ArrowLeft":
          key.left = true;
          obj.rotation.y = -1.5;
          break;
        case "KeyR":
          group.position.set(0, 0, 0);
          break;
        case "Space":
          key.space = true;
          break;
      }
    });

    // キーアップイベント設定（追加）
    document.addEventListener("keyup", (e) => {
      switch (e.code) {
        case "ArrowUp":
          key.up = false;
          break;
        case "ArrowDown":
          key.down = false;
          break;
        case "ArrowRight":
          key.right = false;
          break;
        case "ArrowLeft":
          key.left = false;
          break;
      }
    });
  });
});


/*--------------------
イベント時の処理
--------------------*/

//マウスコントロール
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

let speed = 0;
//アニメーション
const animate = () => {
  stats.begin();
  renderer.render(scene, camera);
  stats.end();

  controls.update();

  if (key.up && group.position.z > -4) {
    group.position.z -= 0.1;
  }
  if (key.down && group.position.z < 4.5) {
    group.position.z += 0.1;
  }
  if (key.right && group.position.x < 4) {
    group.position.x += 0.1;
  }
  if (key.left && group.position.x > -4) {
    group.position.x -= 0.1;
  }

  group.position.y += speed;
  if (key.space) {
    speed = 0.1;
  }

  if (group.position.y >= 3) {
      speed = -0.1;
      key.space = false;
    }

  if (group.position.y < 0) {
    group.position.y = 0;
    speed = 0;
    //key.space = true;
  }

  requestAnimationFrame(animate);
};

animate();
