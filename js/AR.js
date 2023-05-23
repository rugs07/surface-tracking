// function toggleControls() {
//   isArcball = !isArcball;
//   const controlType = document.getElementById("controlType");
//   controlType.innerText = isArcball ? "Arcball" : "CameraCon";
// }

const viewSpaceContainer = document.getElementById("viewspacecontainer");

function enableTranslation() {
  translation = true;
  console.log("translation", translation);
  console.log("horizontalRotation", horizontalRotation);
  console.log("verticalRotation", verticalRotation);
  console.log("XYRotation", XYRotation);
  console.log("resize", resize);

  if (isArcball) {
    arcballControls.setTarget(0.0, 0.0, 0.0);
  } else {
    resetMesh();
  }
}

function disableTranslation() {
  translation = false;
  console.log("translation", translation);
  console.log("horizontalRotation", horizontalRotation);
  console.log("verticalRotation", verticalRotation);
  console.log("XYRotation", XYRotation);
  console.log("resize", resize);

  if (isArcball) {
    arcballControls.setTarget(0.0, 0.0, 0.0);
  } else {
    resetMesh();

    let degZ = ZRAngle;
    degZ = -degZ;
    ZRAngle = 0;
    var transform = "rotateZ(" + degZ + "deg)";
    glamCanvas.style.transform = transform;
  }
}

function enableHorizontalRotation() {
  horizontalRotation = true;
  console.log("translation", translation);
  console.log("horizontalRotation", horizontalRotation);
  console.log("verticalRotation", verticalRotation);
  console.log("XYRotation", XYRotation);
  console.log("resize", resize);

  if (isArcball) {
    arcballControls.setTarget(0.0, 0.0, 0.0);
  } else {
    resetMesh();
  }
}

function disableHorizontalRotation() {
  horizontalRotation = false;
  console.log("translation", translation);
  console.log("horizontalRotation", horizontalRotation);
  console.log("verticalRotation", verticalRotation);
  console.log("XYRotation", XYRotation);
  console.log("resize", resize);

  if (isArcball) {
    arcballControls.setTarget(0.0, 0.0, 0.0);
  } else {
    resetMesh();

    let degZ = ZRAngle;
    degZ = -degZ;
    ZRAngle = 0;
    var transform = "rotateZ(" + degZ + "deg)";
    glamCanvas.style.transform = transform;
  }
}

function enableVerticalRotation() {
  verticalRotation = true;
  console.log("translation", translation);
  console.log("horizontalRotation", horizontalRotation);
  console.log("verticalRotation", verticalRotation);
  console.log("XYRotation", XYRotation);
  console.log("resize", resize);

  if (isArcball) {
    arcballControls.setTarget(0.0, 0.0, 0.0);
  } else {
    resetMesh();
  }
}

function disableVerticalRotation() {
  verticalRotation = false;
  console.log("translation", translation);
  console.log("horizontalRotation", horizontalRotation);
  console.log("verticalRotation", verticalRotation);
  console.log("XYRotation", XYRotation);
  console.log("resize", resize);

  if (isArcball) {
    arcballControls.setTarget(0.0, 0.0, 0.0);
  } else {
    resetMesh();

    let degZ = ZRAngle;
    degZ = -degZ;
    ZRAngle = 0;
    var transform = "rotateZ(" + degZ + "deg)";
    glamCanvas.style.transform = transform;
  }
}

function enableResizing() {
  resize = true;
  console.log("translation", translation);
  console.log("horizontalRotation", horizontalRotation);
  console.log("verticalRotation", verticalRotation);
  console.log("XYRotation", XYRotation);
  console.log("resize", resize);

  if (isArcball) {
    arcballControls.setTarget(0.0, 0.0, 0.0);
  } else {
    cameraControls.moveTo(0, 0, 0);
    // cameraControls.zoomTo(2, true);

    cameraControls.azimuthAngle = baseThetha;
    cameraControls.polarAngle = basePhi;
  }
}

function disableResizing() {
  resize = false;
  console.log("translation", translation);
  console.log("horizontalRotation", horizontalRotation);
  console.log("verticalRotation", verticalRotation);
  console.log("XYRotation", XYRotation);
  console.log("resize", resize);

  if (isArcball) {
    arcballControls.setTarget(0.0, 0.0, 0.0);
  } else {
    cameraControls.moveTo(0, 0, 0);
    // // cameraControls.zoomTo(2, true);

    let degZ = THREE.MathUtils.radToDeg(ZRAngle);
    degZ = -degZ;
    ZRAngle = 0;
    var transform = "rotateZ(" + degZ + "deg)";
    glamCanvas.style.transform = transform;

    cameraControls.azimuthAngle = baseThetha;
    cameraControls.polarAngle = basePhi;
  }
}

function enableXYRotation() {
  XYRotation = true;
  console.log("translation", translation);
  console.log("horizontalRotation", horizontalRotation);
  console.log("verticalRotation", verticalRotation);
  console.log("XYRotation", XYRotation);
  console.log("resize", resize);

  if (isArcball) {
    arcballControls.setTarget(0.0, 0.0, 0.0);
  } else {
    resetMesh();
  }
}

function disableXYRotation() {
  XYRotation = false;
  console.log("translation", translation);
  console.log("horizontalRotation", horizontalRotation);
  console.log("verticalRotation", verticalRotation);
  console.log("XYRotation", XYRotation);
  console.log("resize", resize);

  if (isArcball) {
    arcballControls.setTarget(0.0, 0.0, 0.0);
  } else {
    resetMesh();
  }
}

function rotateX(angle) {
  if (isArcball) {
    var quaternion = new THREE.Quaternion().setFromAxisAngle(
      new THREE.Vector3(1, 0, 0),
      angle
    );

    gCamera.position.applyQuaternion(quaternion);
    gCamera.up.applyQuaternion(quaternion);
    gCamera.quaternion.multiplyQuaternions(quaternion, gCamera.quaternion);
  } else {
    cameraControls.rotate(0, angle, false);
  }

  XRAngle = gCamera.rotation.x;
  YRAngle = gCamera.rotation.y;

  // console.log(
  //   THREE.MathUtils.radToDeg(XRAngle),
  //   THREE.MathUtils.radToDeg(YRAngle),
  //   THREE.MathUtils.radToDeg(ZRAngle)
  // );
}

function rotateY(angle) {
  if (isArcball) {
    var quaternion = new THREE.Quaternion().setFromAxisAngle(
      new THREE.Vector3(0, 1, 0),
      angle
    );
    gCamera.position.applyQuaternion(quaternion);
    gCamera.up.applyQuaternion(quaternion);
    gCamera.quaternion.multiplyQuaternions(quaternion, gCamera.quaternion);
  } else {
    cameraControls.rotate(angle, 0, false);
  }

  XRAngle = gCamera.rotation.x;
  YRAngle = gCamera.rotation.y;

  // console.log(
  //   THREE.MathUtils.radToDeg(XRAngle),
  //   THREE.MathUtils.radToDeg(YRAngle),
  //   THREE.MathUtils.radToDeg(ZRAngle)
  // );
}

// To normalize angles betweeen -180deg to 180deg
// function normalizeAngle(angle) {
//   angle = angle % 360.0;
//   if (angle > 180.0) {
//     angle -= 360.0;
//   }
//   return angle;
// }

// function getYRMul(angle) {
//   let old_min, old_max, new_min, new_max, new_val;
//   // -90 to -180
//   if (angle <= -90) {
//     old_min = -90;
//     old_max = -180;
//     new_min = varY;
//     new_max = varX;
//     new_val =
//       ((angle - old_max) * (new_max - new_min)) / (old_min - old_max) + new_min;
//   }
//   // 0 to -90
//   else if (angle <= 0) {
//     old_min = 0;
//     old_max = -90;
//     new_min = varX;
//     new_max = varY;
//     new_val =
//       ((angle - old_max) * (new_max - new_min)) / (old_min - old_max) + new_min;
//   }
//   // 0 to 90
//   else if (angle <= 90) {
//     old_min = 0;
//     old_max = 90;
//     new_min = varX;
//     new_max = varY;
//     new_val =
//       ((angle - old_min) * (new_max - new_min)) / (old_max - old_min) + new_min;
//   }
//   // 90 to 180
//   else if (angle <= 180) {
//     old_min = 90;
//     old_max = 180;
//     new_min = varY;
//     new_max = varX;
//     new_val =
//       ((angle - old_max) * (new_max - new_min)) / (old_min - old_max) + new_min;
//   }
//   return new_val;
// }

// To normalize angles between 0 to 360 deg
function normalizeAngle(angle) {
  // Normalize the angle to the range of -180 to 180 degrees
  angle = angle % 360;

  // Map the angle to the equivalent angle in the range of 0 to 360 degrees
  if (angle < -180) {
    angle += 360;
  } else if (angle > 180) {
    angle -= 360;
  }

  return angle;
}

function rotateZ(angle, canX, canY) {
  cameraControls.setFocalOffset(canX, canY, 0.0, false);

  let transform = null;
  if (!translation) transform = "rotateZ(" + angle + "deg)";
  else
    transform =
      "translate3d(" +
      canX +
      "px, " +
      canY +
      "px, " +
      0 +
      "px) rotateZ(" +
      angle +
      "deg)";

  glamCanvas.style.transform = transform;

  ZRAngle = angle;

  // YRMul range : for ZRAngle ( 0 - 90 ) -> ( 1 - 1.5 )
  //               for ZRAngle ( 0 - -90 ) -> ( 1 - 1.5 )
  // YRMul = (ZRAngle / 90) * 0.5 + 1;

  // console.log(THREE.MathUtils.radToDeg(XRAngle),THREE.MathUtils.radToDeg(YRAngle), THREE.MathUtils.radToDeg(ZRAngle));
}

function getYAngleAndRotate(newIndexRef, newPinkyRef, zAngle) {
  if (jewelType === "ring") {
    if (
      Math.abs(newIndexRef.x - newPinkyRef.x) <= 0.15 &&
      Math.abs(newIndexRef.y - newPinkyRef.y) <= 0.15
    ) {
      applyRingTrans(1.35);
    } else {
      applyRingTrans(1.5);
    }
  }

  if (lastPinkyRef && lastIndexRef) {
    // rotate vectors around y-axis by -zAngle
    let rotatedLastIndexRef = rotateVectorZ(lastIndexRef, -zAngle);
    let rotatedLastPinkyRef = rotateVectorZ(lastPinkyRef, -zAngle);
    let rotatedNewIndexRef = rotateVectorZ(newIndexRef, -zAngle);
    let rotatedNewPinkyRef = rotateVectorZ(newPinkyRef, -zAngle);

    const my1 =
      (rotatedLastPinkyRef.z - rotatedLastIndexRef.z) /
      (rotatedLastPinkyRef.x - rotatedLastIndexRef.x);
    const my2 =
      (rotatedNewPinkyRef.z - rotatedNewIndexRef.z) /
      (rotatedNewPinkyRef.x - rotatedNewIndexRef.x);

    let yAngle = -Math.atan((my2 - my1) / (1 + my1 * my2));

    if (horizontalRotation) {
      rotateY(yAngle);
    }
  }

  lastPinkyRef = newPinkyRef;
  lastIndexRef = newIndexRef;
}

function rotateVectorZ(vector, angle) {
  angle = THREE.MathUtils.degToRad(angle); // if the angle is in degrees, convert it to radians

  let sin = Math.sin(angle);
  let cos = Math.cos(angle);

  let rotatedVector = {};
  rotatedVector.x = vector.x * cos - vector.y * sin;
  rotatedVector.y = vector.x * sin + vector.y * cos;
  rotatedVector.z = vector.z;

  return rotatedVector;
}

// function rotateVectorY(vector, angle) {
//   angle = THREE.MathUtils.degToRad(angle); // if the angle is in degrees, convert it to radians

//   let sin = Math.sin(angle);
//   let cos = Math.cos(angle);

//   let rotatedVector = {};
//   rotatedVector.x = vector.x * cos - vector.z * sin;
//   rotatedVector.y = vector.y;
//   rotatedVector.z = vector.x * sin + vector.z * cos;

//   return rotatedVector;
// }

// function rotateVectorX(vector, angle) {
//   angle = THREE.MathUtils.degToRad(angle); // if the angle is in degrees, convert it to radians

//   let sin = Math.sin(angle);
//   let cos = Math.cos(angle);

//   let rotatedVector = {};
//   rotatedVector.x = vector.x;
//   rotatedVector.y = vector.y * cos - vector.z * sin;
//   rotatedVector.z = vector.y * sin + vector.z * cos;

//   return rotatedVector;
// }

// MidKnuckle when wrist is at origin and hand is verticle
// x: 0.481456995010376;
// y: 0.2965908646583557;
// z: 0.016597559675574303;

// initMidRef = new THREE.Vector3(
//   0.481456995010376,
//   0.2965908646583557,
//   0.016597559675574303
// );

// initWrist = new THREE.Vector3(
//   0.5131832957267761,
//   0.4570295810699463,
//   -1.5639262107569607e-9
// );

// function limitAngleDifference(currentAngle, targetAngle, maxDifference) {
//   let angleDifference = targetAngle - currentAngle;
//   // Clamp the angle difference
//   angleDifference = Math.max(-maxDifference, Math.min(maxDifference, angleDifference));
//   let limitedAngle = currentAngle + angleDifference;
//   return limitedAngle;
// }

function getZAngleAndRotate(wrist, newMidRef, canX, canY) {
  if (lastMidRef) {
    const dy = newMidRef.y - wrist.y;
    const dx = newMidRef.x - wrist.x;

    let zAngle = Math.atan2(dy, dx);
    zAngle = THREE.MathUtils.radToDeg(zAngle) + 90;

    // Normalize the angle to the range of -180 to 180 degrees
    const normZAngle = normalizeAngle(zAngle);

    // Set the maximum allowed rotation angle
    const maxRotationAngle = 180;

    // Calculate the angle difference between the current and the new angle
    const angleDifference = Math.abs(ZRAngle - normZAngle);
    // console.log("z rot:", ZRAngle, angleDifference, zAngle, normZAngle);

    rotateZ(normZAngle, canX, canY);
  }

  lastMidRef = newMidRef;
}

function getNormalizedXTSub(value) {
  // define the old and new ranges
  const oldMin = 0;
  const oldMax = 1;
  let newMin, newMax;

  if (jewelType === "bangle") {
    newMin = isMobile ? 0.25 : 0.45;
    if (isIOS) newMin = 0.15;
    newMax = isMobile ? 0.75 : 0.55;
    if (isIOS) newMax = 0.7;
  } else if (jewelType === "ring") {
    newMin = isMobile ? 0.28 : 0.45;
    if (isIOS) newMin = 0.15;
    newMax = isMobile ? 0.7 : 0.55;
    if (isIOS) newMax = 0.7;
  }

  // apply the formula to normalize the value
  const normalizedValue =
    ((value - oldMin) / (oldMax - oldMin)) * (newMax - newMin) + newMin;

  // return the normalized value
  return normalizedValue;
}

function getNormalizedYTSub(value) {
  // define the old and new ranges
  const oldMin = 0;
  const oldMax = 1;
  let newMin = isMobile ? 0.45 : 0.4;
  if (isIOS) newMin = 0.44;
  let newMax = isMobile ? 0.5 : 0.55;
  if (isIOS) newMax = 0.5;

  // apply the formula to normalize the value
  const normalizedValue =
    ((value - oldMin) / (oldMax - oldMin)) * (newMax - newMin) + newMin;

  // return the normalized value
  return normalizedValue;
}

// euclidean distance
function euclideanDistance(a, b) {
  return Math.sqrt(
    Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2) + Math.pow(a.z - b.z, 2)
  );
}
// manhattan distance
function manhattanDistance(a, b) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y) + Math.abs(a.z - b.z);
}
function calculateWristSize(points) {
  // calculate wrist size as distance between wrist and first knuckle and distance between thumb knuckle and pinky knuckle on first frame and then adjust for scale using wrist.z value
  let wristSize = manhattanDistance(points[0], points[5]);
  wristSize += manhattanDistance(points[9], points[17]);
  wristSize /= 2;
  return wristSize;
  // calculate wrist size as average distance between wrist and knuckles
  // let wristSize = 0;
  // let count = 0;
  // for (let i = 0; i < 5; i++) {
  //   if (points[i + 5].x == 0 && points[i + 5].y == 0 && points[i + 5].z == 0)
  //     continue;
  //   wristSize += manhattanDistance(points[0], points[i + 5]);
  //   count++;
  // }
  // if (count === 0) {
  //   throw new Error("No wrist points found");
  // }
  // wristSize /= count;
  // return wristSize;
}

//function to use mediapipe hand prediction data for translation and rotation
function translateRotateMesh(points) {
  let wrist = points[0];
  let firstKnuckle = points[5];
  let thumbTip = points[4];
  let pinkyTip = points[20];
  let pinkyKnuckle = {
    x: (points[17].x + points[18].x) / 2.0,
    y: (points[17].y + points[18].y) / 2.0,
    z: (points[17].z + points[18].z) / 2.0,
  };
  let midKnuckle = points[9];
  let ringPos = {
    x:
      facingMode === "environment"
        ? (points[13].x + points[14].x - 0.025) / 2.0
        : (points[13].x + points[14].x - 0.01) / 2.0,
    y: (points[13].y + points[14].y - 0.05) / 2.0,
    z: (points[13].z + points[14].z) / 2.0,
  };

  let stayPoint = null;
  if (jewelType === "bangle") {
    stayPoint = wrist;
  } else if (jewelType === "ring") {
    stayPoint = ringPos;
  }

  let XTSub = getNormalizedXTSub(stayPoint.x);
  let YTSub = getNormalizedYTSub(stayPoint.y);
  let ZTSub = getNormalizedXTSub(stayPoint.z);

  //   changing range from (0,1) to (-0.5 to 0.5)
  const newX = stayPoint.x - XTSub;
  const newY = stayPoint.y - YTSub;
  const newZ = stayPoint.z - ZTSub;

  //   response time can be improved by uncommenting code below minimized arithmetic operations
  //     const newX = wrist.x*0.9 - 0.45;
  //   const newY = wrist.y*0.9 - 0.45;
  //   const newZ = wrist.z*0.9 - 0.45;

  // const YTMul = getYTMul(wrist.y);
  // console.log(newY);

  const XTMul = 1400;
  const YTMul = 850;

  const canX = newX * XTMul;
  const canY = newY * YTMul;

  // let transX = newX * 1.5;
  // let transY = newY * 1;
  // let transZ = newZ * 1;

  // const midY = midKnuckle.y - 0.5;
  //   const dist =
  //     Math.abs(wrist.x - midKnuckle.x) +
  //     Math.abs(wrist.y - midKnuckle.y) +
  //     Math.abs(wrist.z - midKnuckle.z);
  const dist = calculateWristSize(points);

  // if (isArcball) {
  // arcball-controls
  // if (translation && !XYRotation) {
  // 1.5, 1, 1
  // arcballControls.setTarget(transX, transY, transZ);

  //     var transform =
  //       "translate3d(" + canX + "px, " + canY + "px, " + 0 + "px)";
  //     glamCanvas.style.transform = transform;
  //   }
  // } else {
  // camera-controls
  // if (translation && !XYRotation) {
  // -1.5, 1, 1
  // transX = -transX;
  // cameraControls.moveTo(transX, transY, transZ, false);
  // cameraControls.setFocalOffset(canX, canY, 0.0, false);
  // Translate the canvas
  //     var transform =
  //       "translate3d(" + canX + "px, " + canY + "px, " + 0 + "px)";
  //     glamCanvas.style.transform = transform;
  //   }
  // }

  let resizeMul;

  if (jewelType === "bangle") {
    resizeMul = isMobile ? 3.75 : 4.75;
    if (isIOS) resizeMul = 3.25;
  } else if (jewelType === "ring") {
    if (facingMode === "environment") {
      resizeMul = isMobile ? 0.75 : 1.25;
      if (isIOS) resizeMul = 0.75;
    } else {
      resizeMul = isMobile ? 0.85 : 1.25;
      if (isIOS) resizeMul = 0.75;
    }
  }

  if (resize && !isArcball) cameraControls.zoomTo(dist * resizeMul, false);
  if (resize && isArcball)
    gCamera.position.set(gCamera.position.x, gCamera.position.y, 1 / dist);

  // const xAxis = new THREE.Vector3()
  //   .subVectors(pinkyKnuckle, firstKnuckle)
  //   .normalize();
  // const yAxis = new THREE.Vector3().subVectors(midKnuckle, wrist).normalize();
  // const zAxis = new THREE.Vector3().crossVectors(xAxis, yAxis);

  totalTransX = canX;
  totalTransY = canY;

  // getZAngleAndRotate(wrist, midKnuckle, canX, canY);
  getZAngleAndRotate(wrist, midKnuckle, canX, canY);
  getYAngleAndRotate(firstKnuckle, pinkyKnuckle, ZRAngle);
  // console.log("z_rot", ZRAngle, "y_rot", YRAngle);
}
