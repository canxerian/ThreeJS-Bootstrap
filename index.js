import * as THREE from 'three';
import {
    OrbitControls
} from 'https://unpkg.com/three@0.139.2/examples/jsm/controls/OrbitControls.js';

export function main() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    const controls = new OrbitControls(camera, renderer.domElement);

    document.body.appendChild(renderer.domElement);

    // Material
    const material = new THREE.MeshPhongMaterial({
        color: new THREE.Color(1, 1, 1)
    });

    // Cube
    const boxGeo = new THREE.BoxGeometry();
    const boxMesh = new THREE.Mesh(boxGeo, material);
    scene.add(boxMesh);

    // Light
    const fillLight = new THREE.DirectionalLight(new THREE.Color(0.08, 0.86, 0.9), 3);
    fillLight.position.set(-1, 2, 4);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(new THREE.Color(0.827, 0.466, 0.854), 1);
    rimLight.position.set(4, 0.4, -1);
    scene.add(rimLight);


    camera.position.z = 5;

    function render(time) {
        time *= 0.001; // convert time to seconds

        boxMesh.rotation.x = time;
        boxMesh.rotation.y = time;

        renderer.render(scene, camera);

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}