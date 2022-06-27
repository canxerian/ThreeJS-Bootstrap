import * as THREE from 'three';
import {
    OrbitControls
} from 'https://unpkg.com/three@0.139.2/examples/jsm/controls/OrbitControls.js';

import {
    GLTFLoader
} from 'https://unpkg.com/three@0.139.2/examples/jsm/loaders/GLTFLoader.js';

let model, sun;

function createRenderer() {
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.toneMappingExposure = 3;
    renderer.shadowMap.enabled = true;
    return renderer;
}

function createCamera() {
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    return camera;
}

function addModel(scene) {
    const loader = new GLTFLoader();
    loader.load('assets/little_hermit_crab/scene.gltf', result => {
        model = result.scene.children[0];
        model.traverse(obj => {
            if (obj.isMesh) {
                obj.castShadow = true;
                obj.receiveShadow = true;

                if (obj.material.map) {
                    obj.material.map.anisotrophy = 16;
                }
            }
        });
        scene.add(model);


        // Ground plane
        const geo = new THREE.PlaneGeometry(6, 6, 8, 8);
        const mat = new THREE.MeshPhongMaterial({ color: 0xffffff, side: THREE.DoubleSide });
        const plane = new THREE.Mesh(geo, mat);
        plane.rotateX(- Math.PI / 2);
        plane.position.y -= 0.5;
        plane.receiveShadow = true;
        scene.add(plane);
    });
}

function addCubemap(scene) {
    const path = "https://threejs.org/examples/textures/cube/skyboxsun25deg/";
    const format = '.jpg';
    const urls = [
        `${path}px.jpg`,
        `${path}nx.jpg`,
        `${path}py.jpg`,
        `${path}ny.jpg`,
        `${path}pz.jpg`,
        `${path}nz.jpg`,
    ];
    const loader = new THREE.CubeTextureLoader();
    const cubeMap = loader.load(urls);
    cubeMap.format = THREE.RGBFormat;

    scene.background = cubeMap;
}
function addLights(scene) {
    const skyCol = new THREE.Color(0.513, 0.835, 0.866);
    const groundCol = new THREE.Color(0.815, 0.184, 0.439);
    const hemiLight = new THREE.HemisphereLight(skyCol, groundCol, 2);
    scene.add(hemiLight);

    sun = new THREE.SpotLight(0xffffff, 2.2);
    sun.castShadow = true;
    sun.shadow.bias = -0.0001;
    sun.shadow.mapSize = new THREE.Vector2(4096, 4096);
    scene.add(sun);
}

export function main() {
    const scene = new THREE.Scene();
    const camera = createCamera();
    const renderer = createRenderer();
    const controls = new OrbitControls(camera, renderer.domElement);
    document.body.appendChild(renderer.domElement);

    addCubemap(scene);
    addLights(scene);
    addModel(scene);

    function render(time) {
        time *= 0.001; // convert time to seconds

        sun.position.set(
            camera.position.x + 5,
            camera.position.y + 20,
            camera.position.z + 10,
        );

        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}