import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
const data = window.localStorage.getItem("short_long_ratios") ? JSON.parse(window.localStorage.getItem("short_long_ratios")) : [[0, 0, 0, 0], [0, 0, 0, 0]];

function toPercents(arr) {
    let total = arr.reduce((a,b) => a+b);
    return arr.map(v => v * 12 / (total === 0 ? 1: total));
}
class Box extends THREE.Mesh {
    constructor(i, j) {
        super()
        let percents = toPercents(data[i]);
        this.geometry = new THREE.BoxGeometry(0, 0, 0)
        this.material = new THREE.MeshStandardMaterial({ color: new THREE.Color('green').convertSRGBToLinear() })
        let percent = percents[j] === 0 ? 0.01 : percents[j];
        this.position.set(i*2, percent / 1, j * 2);
        this.i = i;
        this.j = j;
    }

    render() {
        let percents = toPercents(data[this.i]);
        let percent = percents[this.j] === 0 ? 0.01 : percents[this.j];
        this.scale.y = percent;
        this.position.y = percent/2;

    }

    onResize(width, height, aspect) {
    }

    onPointerOver(e) {
        this.material.color.set('hotpink')
        this.material.color.convertSRGBToLinear()
    }

    onPointerOut(e) {
        this.material.color.set('green')
        this.material.color.convertSRGBToLinear()
    }

    onClick(e) {
        let isRightMB;
        e = e || window.event;

        if ("which" in e)  // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
            isRightMB = e.which == 3;
        else if ("button" in e)  // IE, Opera
            isRightMB = e.button == 2;


        if (isRightMB) {
            data[this.i][this.j] = Math.max(0, data[this.i][this.j] - 1);

        } else {
            data[this.i][this.j] = data[this.i][this.j] + 1;

        }
        let percents = toPercents(data[this.i]);
        window.localStorage.setItem("short_long_ratios", JSON.stringify(data))
        this.cubeActive = !this.cubeActive
        this.geometry.y = percents[this.j] === 0 ? 0.01 : percents[this.j]
    }
}


/**
* Creates a line
* @param {THREE.Vector3} endPosition - ending position to create a line
* @return {THREE.Line} the mesh
*/
const createLine = endPosition => {
    const geometry = new THREE.Geometry();
    const material = new THREE.LineBasicMaterial({ color: 0x0000ff });
    geometry.vertices.push(new THREE.Vector3(-1, 0, -1), endPosition);
    return new THREE.Line(geometry, material);
}


// Setup ------------------------------------------------ /
// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xced4da);

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(10, 10, 10);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.autoRotate = false;
controls.autoRotateSpeed = 5;
controls.enableDamping = true;
controls.maxPolarAngle = Math.PI / 2 - 0.1;
controls.minDistance = 8;
controls.maxDistance = 64;
controls.target = (new THREE.Vector3(3, 0, 3));
controls.update();

// Meshes
let box;
for (let i = 0; i < 2; i++) {
    let count = 0;

    for (let j = 0; j < 4; j++) {
        box = new Box(i, j);
        scene.add(box);
        count++;
    }
}

// Circle
const disk = new THREE.Mesh(new THREE.CircleGeometry(7, 64), new THREE.MeshBasicMaterial({ color: 0xdee2e6 }));
disk.position.set(0, 0, 0);
disk.lookAt(new THREE.Vector3(0, 0, 0));

// Line
const yAxis = createLine(new THREE.Vector3(-1, 6, -1));
const xAxis = createLine(new THREE.Vector3(8, 0, -1));
const zAxis = createLine(new THREE.Vector3(-1, 0, 8));
scene.add(yAxis);
scene.add(xAxis);
scene.add(zAxis);

let width = 0
let height = 0
let intersects = []
let hovered = {}
const mouse = new THREE.Vector2()
const raycaster = new THREE.Raycaster()
// Light
const light1 = new THREE.PointLight(0xFFFFFF, 1, 500);
const light2 = new THREE.PointLight(0xFFFFFF, 1, 500);
light1.position.set(25, 10, 25);
light2.position.set(-25, 10, -25);
scene.add(light1);
scene.add(light2);


function resize() {
    width = window.innerWidth
    height = window.innerHeight
    camera.aspect = width / height
    const target = new THREE.Vector3(0, 0, 0)
    const distance = camera.position.distanceTo(target)
    const fov = (camera.fov * Math.PI) / 180
    const viewportHeight = 2 * Math.tan(fov / 2) * distance
    const viewportWidth = viewportHeight * (width / height)
    camera.updateProjectionMatrix()
    renderer.setSize(width, height)
    scene.traverse((obj) => {
        if (obj.onResize) obj.onResize(viewportWidth, viewportHeight, camera.aspect)
    })
}

window.addEventListener('resize', resize)
resize()


window.addEventListener('pointermove', (e) => {
    mouse.set((e.clientX / width) * 2 - 1, -(e.clientY / height) * 2 + 1)
    raycaster.setFromCamera(mouse, camera)
    intersects = raycaster.intersectObjects(scene.children, true)

    // If a previously hovered item is not among the hits we must call onPointerOut
    Object.keys(hovered).forEach((key) => {
        const hit = intersects.find((hit) => hit.object.uuid === key)
        if (hit === undefined) {
            const hoveredItem = hovered[key]
            if (hoveredItem.object.onPointerOver) hoveredItem.object.onPointerOut(hoveredItem)
            delete hovered[key]
        }
    })

    intersects.forEach((hit) => {
        // If a hit has not been flagged as hovered we must call onPointerOver
        if (!hovered[hit.object.uuid]) {
            hovered[hit.object.uuid] = hit
            if (hit.object.onPointerOver) hit.object.onPointerOver(hit)
        }
        // Call onPointerMove
        if (hit.object.onPointerMove) hit.object.onPointerMove(hit)
    })
})
window.addEventListener('mousedown', (e) => {
    e.preventDefault()

    intersects.forEach((hit) => {
        // Call onClick
        if (hit.object.onClick) hit.object.onClick(e)
    })
})

function animate(t) {
    requestAnimationFrame(animate)
    scene.traverse((obj) => {
        if (obj.render) obj.render(t)
    })
    renderer.render(scene, camera)
}

animate();
