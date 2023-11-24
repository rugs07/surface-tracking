import { ARButton } from "./extras/ARButton.js";

let container;
let camera, scene, renderer;
let controller;

let reticle;

let hitTestSource = null;
let hitTestSourceRequested = false;

if (jewelType === "placement") {
  init();
  animate();
}

function init() {
  const placementDiv = document.getElementById("placement");

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.01,
    20
  );

  const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 3);
  light.position.set(0.5, 1, 0.25);
  scene.add(light);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.xr.enabled = true;

  const placeCanvas = renderer.domElement;
  placeCanvas.id = "placeCanvas";
  placeCanvas.style.zIndex = "30";
  placementDiv.appendChild(placeCanvas);

  if (isMobile || isIOS) {
    document
      .getElementById("ar-bottom-container")
      .appendChild(
        ARButton.createButton(renderer, { requiredFeatures: ["hit-test"] })
      );
  } else {
    const arToggleContainer = document.getElementById("ar-toggle-container");
    arToggleContainer.insertBefore(
      ARButton.createButton(renderer, { requiredFeatures: ["hit-test"] }),
      arToggleContainer.firstChild
    );
  }

  // const geometry = new THREE.CylinderGeometry(0.1, 0.1, 0.2, 32).translate(
  //   0,
  //   0.1,
  //   0
  // );

  function onSelect() {
    if (reticle.visible) {
      // const material = new THREE.MeshPhongMaterial({
      //   color: 0xffffff * Math.random(),
      // });
      // const mesh = new THREE.Mesh(geometry, material);
      // reticle.matrix.decompose(mesh.position, mesh.quaternion, mesh.scale);
      // mesh.scale.y = Math.random() * 2 + 1;
      // scene.add(mesh);

      const glamCanvas = document.getElementById("glamCanvas");
      showJewel();

      let position = new THREE.Vector3(),
        quaternion = new THREE.Quaternion(),
        scale = new THREE.Vector3();
      console.log(
        "position, quaternion, scale : ",
        position,
        quaternion,
        scale
      );
      reticle.matrix.decompose(position, quaternion, scale);
      // console.log(
      //   "position",
      //   position,
      //   "quaternion",
      //   quaternion,
      //   "scale",
      //   scale
      // );

      glamCanvas.style.transform =
        "translate3d(" + position.x + "px, " + position.y + "px, " + 0 + "px)";

      let zPos = -position.z;
      if (zPos === 0) zPos = 0.1;
      let objScale = (1 / zPos) * 0.75;
      cameraControls.zoomTo(objScale, false);
    }
  }

  controller = renderer.xr.getController(0);
  controller.addEventListener("select", onSelect);
  scene.add(controller);

  reticle = new THREE.Mesh(
    new THREE.RingGeometry(0.15, 0.2, 32).rotateX(-Math.PI / 2),
    new THREE.MeshBasicMaterial()
  );
  reticle.matrixAutoUpdate = false;
  reticle.visible = false;
  scene.add(reticle);

  window.addEventListener("resize", onWindowResize);
}
window.addEventListener("resize", onWindowResize);

function onWindowResize() {
  const originalFOV = 70;
  // Update the canvas size as you did before
  let canvasWidth = document.documentElement.clientWidth;
  let canvasHeight = document.documentElement.clientHeight;
  // console.log("canvasWidth  : ", canvasWidth);
  // console.log("canvasHeight  : ", canvasHeight);

  // outputCanvasElement.width = canvasWidth;
  // outputCanvasElement.height = canvasHeight;

  // Calculate the zoom level (you may need to adjust this factor)
  const zoomLevel = window.devicePixelRatio;

  // Adjust the camera's field of view based on the zoom level
  camera.fov = originalFOV / zoomLevel; // originalFOV is your base FOV
  camera.aspect = canvasWidth / canvasHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(canvasWidth, canvasHeight);
}
// function onWindowResize() {
//   console.log("window.innerWidth : ", window.innerWidth);
//   console.log("window.innerHeight : ", window.innerHeight);
//   // const zoomLevel = window.devicePixelRatio;

//   camera.aspect = window.innerWidth / window.innerHeight;
//   camera.updateProjectionMatrix();

//   renderer.setSize(window.innerWidth, window.innerHeight);
// }

function animate() {
  renderer.setAnimationLoop(render);
}

function render(timestamp, frame) {
  if (frame) {
    const referenceSpace = renderer.xr.getReferenceSpace();
    const session = renderer.xr.getSession();

    if (hitTestSourceRequested === false) {
      session.requestReferenceSpace("viewer").then(function (referenceSpace) {
        session
          .requestHitTestSource({ space: referenceSpace })
          .then(function (source) {
            hitTestSource = source;
          });
      });

      session.addEventListener("end", function () {
        hitTestSourceRequested = false;
        hitTestSource = null;
      });

      hitTestSourceRequested = true;
    }

    if (hitTestSource) {
      const hitTestResults = frame.getHitTestResults(hitTestSource);

      if (hitTestResults.length) {
        const hit = hitTestResults[0];

        reticle.visible = true;
        reticle.matrix.fromArray(hit.getPose(referenceSpace).transform.matrix);
      } else {
        reticle.visible = false;
        hideJewel();
      }
    }
  }

  renderer.render(scene, camera);
}
