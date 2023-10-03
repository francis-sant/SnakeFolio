//--------------------------Second option------
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
// import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

// const loader = new GLTFLoader();
//import { TextGeometry } from '../../three.js-master/';

// SCENE
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// RENDERER
const renderer = new THREE.WebGLRenderer({ antialias: true });

// Set the renderer size and add it to the DOM
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 1, 0);
scene.add(light);

// Set up the isometric camera
const distance = 20;
// const aspect = window.innerWidth / window.innerHeight;
camera.position.set(
  distance * Math.sin(Math.PI / 4),
  distance * Math.cos(Math.PI / 4),
  distance
);
camera.lookAt(scene.position);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enabled = true;
controls.enableDamping = true; // the camera to slow down smoothly after the user stops moving it.
controls.dampingFactor = 0.05; // the strength of the damping effect.
controls.screenSpacePanning = false; //camera will move in the direction of the mouse pointer instead of the scene's axes.
controls.minDistance = -50; //sets the minimum distance that the camera can be from the target point (i.e., the point that the camera is looking at).
controls.maxDistance = 50; //If the camera moves farther than this distance, it will stop moving.

// Box
const geometry2 = new THREE.BoxGeometry(0.5, 0.5, 0.5);
const material2 = new THREE.MeshNormalMaterial();
let cube = new THREE.Mesh(geometry2, material2);
cube.position.set(0, 0, 0.5);
scene.add(cube);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.set(10, 1, 10);
scene.add(ambientLight, pointLight);

let snakeBalls = [];

// Add the cube to a new position
// function addNewCube() {
//   const newCube = new THREE.Mesh(geometry2, material2);
//   newCube.position.set(
//     Math.random() * 16 - 8, // Random x position between -8 and 8
//     0.5, // Put it on the floor
//     Math.random() * 16 - 8 // Random z position between -8 and 8
//   );
//   scene.add(newCube);
//   cube = newCube;
// }

//function that will add the ball
function addBallToSnake(numBalls) {
  // Remove any existing balls from the snake
  for (let i = 0; i < snakeBalls.length; i++) {
    scene.remove(snakeBalls[i]);
  }
  snakeBalls.length = 0;

  // Add new balls to the snake
  for (let i = 0; i < numBalls; i++) {
    const ballGeometry = new THREE.SphereGeometry(0.2, 32, 32);
    const ballMaterial = new THREE.MeshStandardMaterial({
      color: Math.random() * 0xffffff,
      roughness: 0.7,
      metalness: 0.3,
    });
    const ball = new THREE.Mesh(ballGeometry, ballMaterial);
    if (i === 0) {
      ball.position.set(
        Math.random() * 16 - 8, // Random x position between -8 and 8
        0.5, 
        Math.random() * 16 - 8 // Random z position between -8 and 8
      );
    } else {
      const lastBall = snakeBalls[i - 1];
      ball.position.copy(lastBall.position);
    }
    snakeBalls.push(ball);
    scene.add(ball);
  }
}

addBallToSnake(2);

const cube1 = new THREE.Mesh(geometry2, material2);
cube1.position.set(-3, 0, 5);
cube1.visible = false;

scene.add(cube1);

const cube2 = new THREE.Mesh(geometry2, material2);
cube2.position.set(0, 0, 5);
cube2.visible = false;
scene.add(cube2);

const cube3 = new THREE.Mesh(geometry2, material2);
cube3.position.set(-7, 0, 5);
cube3.visible = false;
scene.add(cube3);

//responsible for snake//
function snakeheadTouchesCube() {
  requestAnimationFrame(snakeheadTouchesCube);
  if (snakeBalls.length > 0) {
    const firstBall = snakeBalls[0];
    const targetPosition = camera.position.clone();
    targetPosition.sub(
      camera.getWorldDirection(new THREE.Vector3()).multiplyScalar(-6)
    );
    firstBall.position.lerp(targetPosition, 0.1); //to move slower
    for (let i = 1; i < snakeBalls.length; i++) {
      const currentBall = snakeBalls[i];
      const prevBall = snakeBalls[i - 1];
      currentBall.position.lerp(prevBall.position, 0.2);
    }
  }

  // Check for collision between the snake's head and the cube
  if (snakeBalls.length > 0) {
    console.log(snakeBalls.length);
    const head = snakeBalls[0];
    const distance = head.position.distanceTo(cube.position);
    if (distance < 0.35) {
      // If the head is touching the cube
      // Remove the old cube from the scene
      scene.remove(cube);

      // Add a new cube at a random position
      const newCube = new THREE.Mesh(geometry2, material2);
      newCube.position.set(
        Math.random() * 8 - 4, // Random x position between -4 and 4
        Math.random() * 8 - 4, // Random y position between -4 and 4
        Math.random() * 8 + 2 // Random z position between 2 and 10
      );
      scene.add(newCube);
      cube = newCube;

      // Add a new ball to the snake
      const ballGeometry = new THREE.SphereGeometry(0.2, 32, 32);
      const ballMaterial = new THREE.MeshStandardMaterial({
        color: Math.random() * 0xffffff,
        roughness: 0.7,
        metalness: 0.3,
      });
      const ball = new THREE.Mesh(ballGeometry, ballMaterial);
      const lastBall = snakeBalls[snakeBalls.length - 1];
      ball.position.copy(lastBall.position);
      snakeBalls.push(ball);
      scene.add(ball);
    }
  }
  if (snakeBalls.length == 7) {
    toggleBanner();
    // Show the hidden cubes
    // cube1.visible = true;
    // cube1.addEventListener("click", function () {
    //   // Redirect to your desired link
    //   window.location.href = "https://www.example.com";
    // });
    // cube2.visible = true;
    // cube3.visible = true;
  } else {
    // Hide the cubes if the snake length is less than 7
    // cube1.visible = false;
    // cube2.visible = false;
    // cube3.visible = false;
  }
  renderer.render(scene, camera);
}

// Redirect to the desired pages or show the geometrical objects
// window.location.href = "https://example.com/my-projects";
//  Create the animation loop

let time2 = 0;
const numBalls = 10;
const angleStep = (2 * Math.PI) / numBalls;
const radius = 5;
const orbitBalls = [];

//  Create the animation loop
//static orbitingballs//

for (let i = 0; i < numBalls; i++) {
  const ballGeometry = new THREE.SphereGeometry(0.2, 32, 32);
  const ballMaterial = new THREE.MeshStandardMaterial({
    color: Math.random() * 0xffffff,
    roughness: 0.1,
    metalness: 0.2,
  });
  const ball = new THREE.Mesh(ballGeometry, ballMaterial);
  const angle = i * angleStep;
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;
  ball.position.set(x, y, 0);
  orbitBalls.push(ball);
  scene.add(ball);
}

function animation2() {
  time2 += 0.005;
  for (let i = 0; i < numBalls; i++) {
    const ball = orbitBalls[i];
    const angle = i * angleStep;
    const x = Math.cos(angle * time2) * radius;
    const y = Math.sin(angle * time2) * radius;
    ball.position.set(x, y, 0);
  }
  renderer.render(scene, camera);
}

let orbitingBalls = [];
let clickableBalls = [];

function addNewBall() {
  const ballGeometry = new THREE.SphereGeometry(0.2, 32, 32);
  const ballMaterial = new THREE.MeshStandardMaterial({
    color: Math.random() * 0xffffff,
    roughness: 0.1,
    metalness: 0.2,
  });
  const ball = new THREE.Mesh(ballGeometry, ballMaterial);
  const angle = orbitBalls.length * angleStep;
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;
  ball.position.set(x, y, 0);
  orbitBalls.push(ball);
  scene.add(ball);
}

renderer.setAnimationLoop(animation2);

// Handle window resize
window.addEventListener("resize", function () {
  const width = window.innerWidth;
  const height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});

snakeheadTouchesCube();

let btn = document.getElementById("btn");
let content = document.querySelector(".big-banner");

btn.addEventListener("click", (event) => {
  event.preventDefault();
  content.classList.add("deactivate");
});

// let btn2 = document.getElementById("btn-continue");
// let content2 = document.querySelector(".portfolio");

// btn2.addEventListener("click", (event) => {
//   event.preventDefault();
//   content2.classList.toggle("deactivate");
// });
let portfolio = document.querySelector(".portfolio");
let btnContinue = document.getElementById("btn-continue");
btnContinue.addEventListener("click", (event) => {
  event.preventDefault();

  portfolio.classList.add("activate");
  // console.log("Clicked");
});

function toggleBanner() {
  if (snakeBalls.length >= 7) {
    portfolio.classList.remove("deactivate");
  } else {
    portfolio.classList.add("deactivate");
  }
}
