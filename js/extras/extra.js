// Extra functions for AR

// Rotate point w.r.t rotated x,y,z axes
function rotatePoint(x, y, z, xAngle, yAngle, zAngle) {
  // Convert angles to radians
  // xAngle = (xAngle * Math.PI) / 180;
  // yAngle = (yAngle * Math.PI) / 180;
  // zAngle = (zAngle * Math.PI) / 180;

  // Rotation matrix around x-axis
  const rx = [
    [1, 0, 0],
    [0, Math.cos(xAngle), Math.sin(xAngle)],
    [0, -Math.sin(xAngle), Math.cos(xAngle)],
  ];

  // Rotation matrix around y-axis
  const ry = [
    [Math.cos(yAngle), 0, -Math.sin(yAngle)],
    [0, 1, 0],
    [Math.sin(yAngle), 0, Math.cos(yAngle)],
  ];

  // Rotation matrix around z-axis
  const rz = [
    [Math.cos(zAngle), Math.sin(zAngle), 0],
    [-Math.sin(zAngle), Math.cos(zAngle), 0],
    [0, 0, 1],
  ];

  // Combine the three rotation matrices
  const r = math.multiply(math.multiply(rz, ry), rx);

  // Apply the rotation to the point
  const point = math.matrix([[x], [y], [z]]);
  const rotatedPoint = math.multiply(r, point);

  // Extract the new coordinates from the rotated point
  const newX = rotatedPoint.get([0, 0]);
  const newY = rotatedPoint.get([1, 0]);
  const newZ = rotatedPoint.get([2, 0]);

  return { x: newX, y: newY, z: newZ };
}

function getNormalizedToPixelCoordinates(normalizedX, normalizedY) {
  const imageWidth = viewSpaceContainer.clientWidth;
  const imageHeight = viewSpaceContainer.clientHeight;

  const xInPixel = Math.min(
    Math.floor(normalizedX * imageWidth),
    imageWidth - 1
  );
  const yInPixel = Math.min(
    Math.floor(normalizedY * imageHeight),
    imageHeight - 1
  );

  return { xInPixel, yInPixel };
}

function setOrbitPoint(mouseX, mouseY) {
  const elRect = gRenderer.domElement.getBoundingClientRect();
  const canvasX = mouseX - elRect.left;
  const canvasY = mouseY - elRect.top;

  const normalizedMouse = new THREE.Vector2();
  normalizedMouse.set(
    (canvasX / elRect.width) * 2.0 - 1.0,
    ((elRect.height - canvasY) / elRect.height) * 2.0 - 1.0
  );

  gCamera.updateMatrixWorld();
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(normalizedMouse, gCamera);

  const intersections = raycaster.intersectObjects(gRayMarchScene.children);

  if (intersections.length !== 0) {
    cameraControls.setOrbitPoint(
      intersections[0].point.x,
      intersections[0].point.y,
      0,
      false
    );
  }
}

// To handle Camera-Controls events

function handleEvents() {
  const keyState = {
    shiftRight: false,
    shiftLeft: false,
    controlRight: false,
    controlLeft: false,
    arrowUp: false,
    arrowDown: false,
    arrowLeft: false,
    arrowRight: false,
    keyW: false,
    keyA: false,
    keyS: false,
    keyD: false,
  };

  document.addEventListener("keydown", (event) => {
    if (event.code === "ShiftRight") keyState.shiftRight = true;
    if (event.code === "ShiftLeft") keyState.shiftLeft = true;
    if (event.code === "ControlRight") keyState.controlRight = true;
    if (event.code === "ControlLeft") keyState.controlLeft = true;
    if (event.code === "ArrowUp") keyState.arrowUp = true;
    if (event.code === "ArrowDown") keyState.arrowDown = true;
    if (event.code === "ArrowLeft") keyState.arrowLeft = true;
    if (event.code === "ArrowRight") keyState.arrowRight = true;
    if (event.code === "KeyW") keyState.keyW = true;
    if (event.code === "KeyA") keyState.keyA = true;
    if (event.code === "KeyS") keyState.keyS = true;
    if (event.code === "KeyD") keyState.keyD = true;

    if (keyState.shiftRight || keyState.shiftLeft) {
      cameraControls.mouseButtons.left = CameraControls.ACTION.TRUCK;
    } else if (keyState.controlRight || keyState.controlLeft) {
      cameraControls.mouseButtons.left = CameraControls.ACTION.DOLLY;
    } else {
      cameraControls.mouseButtons.left = CameraControls.ACTION.ROTATE;
    }

    if (keyState.arrowUp) {
      cameraControls.zoom(0.1, false);
    } else if (keyState.arrowDown) {
      cameraControls.zoom(-0.1, false);
    } else if (keyState.arrowLeft) {
      cameraControls.truck(0.1, 0, false);
    } else if (keyState.arrowRight) {
      cameraControls.truck(-0.1, 0, false);
    } else if (keyState.keyW) {
      cameraControls.rotate(0, 1.5 * THREE.MathUtils.DEG2RAD, true);
    } else if (keyState.keyA) {
      cameraControls.rotate(1.5 * THREE.MathUtils.DEG2RAD, 0, true);
    } else if (keyState.keyS) {
      cameraControls.rotate(0, -1.5 * THREE.MathUtils.DEG2RAD, true);
    } else if (keyState.keyD) {
      cameraControls.rotate(-1.5 * THREE.MathUtils.DEG2RAD, 0, true);
    }
  });

  document.addEventListener("keyup", (event) => {
    if (event.code === "ShiftRight") keyState.shiftRight = false;
    if (event.code === "ShiftLeft") keyState.shiftLeft = false;
    if (event.code === "ControlRight") keyState.controlRight = false;
    if (event.code === "ControlLeft") keyState.controlLeft = false;
    if (event.code === "ArrowUp") keyState.arrowUp = false;
    if (event.code === "ArrowDown") keyState.arrowDown = false;
    if (event.code === "ArrowLeft") keyState.arrowLeft = false;
    if (event.code === "ArrowRight") keyState.arrowRight = false;
    if (event.code === "KeyW") keyState.keyW = false;
    if (event.code === "KeyA") keyState.keyA = false;
    if (event.code === "KeyS") keyState.keyS = false;
    if (event.code === "KeyD") keyState.keyD = false;

    if (keyState.shiftRight || keyState.shiftLeft) {
      cameraControls.mouseButtons.left = CameraControls.ACTION.TRUCK;
    } else if (keyState.controlRight || keyState.controlLeft) {
      cameraControls.mouseButtons.left = CameraControls.ACTION.DOLLY;
    } else {
      cameraControls.mouseButtons.left = CameraControls.ACTION.ROTATE;
    }

    if (keyState.arrowUp) {
      cameraControls.zoom(0.1, false);
    } else if (keyState.arrowDown) {
      cameraControls.zoom(-0.1, false);
    } else if (keyState.arrowLeft) {
      cameraControls.truck(0.1, 0, false);
    } else if (keyState.arrowRight) {
      cameraControls.truck(-0.1, 0, false);
    } else if (keyState.keyW) {
      cameraControls.rotate(0, 1.5 * THREE.MathUtils.DEG2RAD, true);
    } else if (keyState.keyA) {
      cameraControls.rotate(1.5 * THREE.MathUtils.DEG2RAD, 0, true);
    } else if (keyState.keyS) {
      cameraControls.rotate(0, -1.5 * THREE.MathUtils.DEG2RAD, true);
    } else if (keyState.keyD) {
      cameraControls.rotate(-1.5 * THREE.MathUtils.DEG2RAD, 0, true);
    }
  });

  let lastTapTime = performance.now();
  const doubleTapTimeout = 250;
  const customPointerEvent = new THREE.EventDispatcher();

  document.addEventListener("mousedown", () => {
    const now = performance.now();
    const isDoubleTap = now - lastTapTime < doubleTapTimeout;
    customPointerEvent.dispatchEvent({
      type: isDoubleTap ? "doubletap" : "tap",
    });
    lastTapTime = now;
  });

  customPointerEvent.addEventListener("doubletap", function () {
    cameraControls.mouseButtons.left = CameraControls.ACTION.TRUCK;
    cameraControls.touches.one = CameraControls.ACTION.TRUCK;
  });
  customPointerEvent.addEventListener("tap", function () {
    cameraControls.mouseButtons.left = CameraControls.ACTION.ROTATE;
    cameraControls.touches.one = CameraControls.ACTION.TOUCH_ROTATE;
  });
}

// Extras on HandTrack.js

// let model = null;

// Params to initialize Handtracking js
// const modelParams = {
//   flipHorizontal: true,
//   maxNumBoxes: 3,
//   iouThreshold: 0.5,
//   scoreThreshold: 0.7,
// };

// handTrack.load(modelParams).then((lmodel) => {
//   model = lmodel;
// });

// Method to start a video
// function startVideo() {
//   handTrack.startVideo(inputVideoElement).then(function (status) {
//     if (status) {
//       runDetection();
//     }
//   });
// }

//Method to detect movement
// function runDetection() {
//   model.detect(inputVideoElement).then((predictions) => {
//     model.renderPredictions(
//       predictions,
//       outputCanvasElement,
//       canvasCtx,
//       inputVideoElement
//     );
//     if (isVideo) {
//       requestAnimationFrame(runDetection);

//       if (predictions.length > 0 && predictions[0].label !== "face") {
//         changeData(predictions[0].bbox);
//       }
//     }
//   });
// }

//Method to Change prediction data into useful information
// function changeData(value) {
//   let midvalX = value[0] + value[2] / 2;
//   let midvalY = value[1] + value[3] / 2;

//   // document.querySelector(".hand-1 #hand-x span").innerHTML = midvalX;
//   // document.querySelector(".hand-1 #hand-y span").innerHTML = midvalY;

//   console.log("handX", (midvalX - 300) / 600, "handY", (midvalY - 250) / 500);

//   // translateRotateMesh({ x: (midvalX - 300) / 600, y: (midvalY - 250) / 500 });
// }
