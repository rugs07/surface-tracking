// function toggleControls() {
//   isArcball = !isArcball;
//   const controlType = document.getElementById("controlType");
//   controlType.innerText = isArcball ? "Arcball" : "CameraCon";
// }

// R : The change in values we have
// Q : How much noiced data?
// A : multiplication for conversion
// var kfResize = new KalmanFilter({ R: 0.0000000001, Q: 5, A: 1.1 });
// var kfZRotate = new KalmanFilter({ R: 0.0000000001, Q: 20, A: 1.5 });
// var kfYRotate = new KalmanFilter({ R: 0.0000000001, Q: 2, A: 1.1 });

// var kf = new KalmanFilter({ R: 0.0000000001, Q: 5, A: 1.1 });

// console.log(kf.filter(2));
// console.log(kf.filter(3));
// console.log(kf.filter(2));
// console.log(kf.filter(1));

const viewSpaceContainer = document.getElementById("viewspacecontainer");

let zArr = [];
let rsArr = [];
let yArr = [];

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

    cameraControls.azimuthAngle = baseTheta;
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

    cameraControls.azimuthAngle = baseTheta;
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
    // cameraControls.rotate(angle, 0, false);
    // Using Show zone to not show the part which was placed on for recording

    let showZone = [-90, 90];
    if (angle > showZone[0] && angle < showZone[1]) {
      // cameraControls.rotate(angle, 0, false);
      cameraControls.azimuthAngle = THREE.MathUtils.degToRad(angle) + baseTheta;
    }
    console.log(
      "yangle",
      angle.toFixed(2),
      THREE.MathUtils.radToDeg(baseTheta).toFixed(2),
      handLabel
    );
  }

  YRAngle = angle;
}

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
}

function convertRingTransRange(value) {
  const oldMin = -25;
  const oldMax = 25;
  const newMin = 25;
  const newMax = 65;
  return ((value - oldMin) * (newMax - newMin)) / (oldMax - oldMin) + newMin;
}

function getYAngleAndRotate(newIndexRef, newPinkyRef, zAngle) {
  // rotate vectors around y-axis by -zAngle
  let rotatedNewIndexRef = rotateVectorZ(newIndexRef, -zAngle);
  let rotatedNewPinkyRef = rotateVectorZ(newPinkyRef, -zAngle);

  // the arctangent of the slope is the angle of the hand with respect to the x-axis
  let yAngle = -Math.atan2(
    rotatedNewPinkyRef.z - rotatedNewIndexRef.z,
    rotatedNewPinkyRef.x - rotatedNewIndexRef.x
  );
  // make show zone from -90 to 90
  yAngle = THREE.MathUtils.radToDeg(yAngle) - 90;
  if (facingMode === "environment") {
    yAngle += 180;
  }

  let normYAngle = normalizeAngle(yAngle);

  if (jewelType === "ring" && enableRingTransparency) {
    let transparencyZone = [-25, 25];
    if (normYAngle > transparencyZone[0] && normYAngle < transparencyZone[1]) {
      ringTrans = 1.35;
      applyRingTrans();
      // converting angles to new range -20 to 20 -> 20 - 60 for transparency
      normYAngle = convertRingTransRange(normYAngle);
    } else {
      if (normYAngle > 0) normYAngle += 0.75;
      else normYAngle -= 0.5;
      resetRingTrans();
    }
  }

  if (enableSmoothing) {
    let diff = normYAngle - YRAngle;
    yArr.push(diff); // Insert new value at the end

    if (yArr.length > 3) {
      yArr.shift(); // Remove first index value

      // Check if all 5 values are either positive or negative
      var allSameSign = yArr.every(function (value) {
        return (value >= 0 && diff >= 0) || (value < 0 && diff < 0);
      });

      if (!allSameSign) {
        normYAngle = YRAngle;
      }
    }
  }

  if (horizontalRotation) {
    rotateY(normYAngle);
  }
  lastPinkyRef = newPinkyRef;
  lastIndexRef = newIndexRef;
}

// function getYAngleAndRotate(newIndexRef, newPinkyRef, zAngle) {
//   if (jewelType === "ring" && enableRingTransparency) {
//     if (
//       Math.abs(newIndexRef.x - newPinkyRef.x) <= 0.15 &&
//       Math.abs(newIndexRef.y - newPinkyRef.y) <= 0.15
//     ) {
//       applyRingTrans(1.35);
//     } else {
//       applyRingTrans(1.5);
//     }
//   }

//   if (lastPinkyRef && lastIndexRef) {
//     // rotate vectors around y-axis by -zAngle
//     let rotatedLastIndexRef = rotateVectorZ(lastIndexRef, -zAngle);
//     let rotatedLastPinkyRef = rotateVectorZ(lastPinkyRef, -zAngle);
//     let rotatedNewIndexRef = rotateVectorZ(newIndexRef, -zAngle);
//     let rotatedNewPinkyRef = rotateVectorZ(newPinkyRef, -zAngle);

//     const my1 =
//       (rotatedLastPinkyRef.z - rotatedLastIndexRef.z) /
//       (rotatedLastPinkyRef.x - rotatedLastIndexRef.x);
//     const my2 =
//       (rotatedNewPinkyRef.z - rotatedNewIndexRef.z) /
//       (rotatedNewPinkyRef.x - rotatedNewIndexRef.x);

//     let yAngleChange = -Math.atan((my2 - my1) / (1 + my1 * my2));

//     if (enableSmoothing) {
//       let yNew = THREE.MathUtils.radToDeg(
//         cameraControls.azimuthAngle + yAngleChange
//       );

//       let diff = yNew - YRAngle;
//       // if (Math.abs(diff) < 0.05) {
//       yArr.push(diff); // Insert new value at the end

//       if (yArr.length > 3) {
//         yArr.shift(); // Remove first index value

//         // Check if all 5 values are either positive or negative
//         var allSameSign = yArr.every(function (value) {
//           return (value >= 0 && diff >= 0) || (value < 0 && diff < 0);
//         });

//         if (!allSameSign) {
//           yNew = YRAngle;
//           yAngleChange = 0;
//         }
//         // }
//       }
//     }

//     if (horizontalRotation) {
//       rotateY(yAngleChange);
//     }
//   }

//   lastPinkyRef = newPinkyRef;
//   lastIndexRef = newIndexRef;
// }

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
    let normZAngle = normalizeAngle(zAngle);

    // Set the maximum allowed rotation angle
    const maxRotationAngle = 180;

    if (enableSmoothing) {
      // Calculate the angle difference between the current and the new angle
      const angleDifference = ZRAngle - normZAngle;
      // console.log("z rot:", ZRAngle, angleDifference, zAngle, normZAngle);

      zArr.push(angleDifference); // Insert new value at the end

      if (zArr.length > 3) {
        zArr.shift(); // Remove first index value
        // Check if all 5 values are either positive or negative
        var allSameSign = zArr.every(function (value) {
          return (
            (value >= 0 && angleDifference >= 0) ||
            (value < 0 && angleDifference < 0)
          );
        });

        if (!allSameSign) {
          normZAngle = ZRAngle;
        }
      }
    }

    // if (angleDifference <= 2) {
    //   let newZRAngle = kf.filter(normZAngle);
    //   console.log("origAngle", normZAngle, "filtered", kf.filter(newZRAngle));
    //   normZAngle = newZRAngle;
    // }

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
    newMin = isMobile ? 0.27 : 0.44;
    if (isIOS) newMin = 0.22;
    newMax = isMobile ? 0.72 : 0.54;
    if (isIOS) newMax = 0.72;

    if (facingMode === "environment") {
      if (isMobile) newMin = 0.26;
      if (isIOS) newMin = 0.2;
    }
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
  // let wristSize = manhattanDistance(points[0], points[5]);
  // wristSize += manhattanDistance(points[9], points[17]);
  // wristSize /= 2;

  let wristSize = euclideanDistance(points[0], points[9]);
  // if (diff <= 0.1) {
  //     const newSize = kfResize.filter(wristSize);
  //     console.log("origsize", wristSize, "filtered", newSize);
  //     wristSize = newSize;
  // }
  lastSize = wristSize;

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

let lastSize = null;

function smoothResizing(wristSize) {
  if (enableSmoothing) {
    let diff = 0;
    if (lastSize) {
      diff = wristSize - lastSize;

      rsArr.push(diff); // Insert new value at the end

      if (rsArr.length > 3) {
        rsArr.shift(); // Remove first index value

        // Check if all 5 values are either positive or negative
        var allSameSign = rsArr.every(function (value) {
          return (value >= 0 && diff >= 0) || (value < 0 && diff < 0);
        });

        if (!allSameSign) return lastSize;
      }
    }
  }
  return wristSize;
}

//function to use mediapipe hand prediction data for translation and rotation
function translateRotateMesh(points, handLabel, isPalmFacing) {
  let wrist = points[0];
  let firstKnuckle = points[5];
  let thumbTip = points[4];
  let pinkyTip = points[20];
  let pinkyKnuckle = {
    x: (points[17].x + points[18].x) / 2.0,
    y: (points[17].y + points[18].y) / 2.0,
    z: (points[17].z + points[18].z) / 2.0,
  };
  // let midKnuckle = points[9];
  let midPip = points[10];
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

  // Translation calc
  let XTSub = getNormalizedXTSub(stayPoint.x);
  let YTSub = getNormalizedYTSub(stayPoint.y);

  let rollMul = isMobile || isIOS ? -0.02 : -0.03;
  let YTAdd = Math.abs(Math.sin(THREE.MathUtils.degToRad(ZRAngle))) * rollMul;

  // Changing range from (0,1) to (-0.5 to 0.5)
  const newX = stayPoint.x - XTSub;
  let newY = stayPoint.y - YTSub;
  if (jewelType === "bangle") {
    newY += YTAdd;
  }

  const XTMul = 1400;
  const YTMul = 850;

  const canX = newX * XTMul;
  const canY = newY * YTMul;

  // rotation & translation (getZAngleAndRotate also translates)
  totalTransX = canX;
  totalTransY = canY;
  if (jewelType === "bangle") {
    getZAngleAndRotate(wrist, midPip, canX, canY);
    getYAngleAndRotate(firstKnuckle, pinkyKnuckle, ZRAngle);
  } else if (jewelType === "ring") {
    getZAngleAndRotate(points[13], points[14], canX, canY);
    getYAngleAndRotate(firstKnuckle, pinkyKnuckle, ZRAngle);
  }

  // Resizing
  const dist = calculateWristSize(points);

  let resizeMul;

  if (jewelType === "bangle") {
    resizeMul = isMobile ? 3.75 : 4.75;
    if (isIOS) resizeMul = 3.25;
  } else if (jewelType === "ring") {
    if (facingMode === "environment") {
      resizeMul = isMobile ? 0.95 : 1.25;
      if (isIOS) resizeMul = 0.95;
    } else {
      resizeMul = isMobile ? 1.15 : 1.4;
      if (isIOS) resizeMul = 1.15;
    }
  }

  let resizeAdd = YTAdd * -13;
  if (jewelType === "ring") resizeAdd = YTAdd * -3;

  if (resize && !isArcball) {
    let smoothenSize = smoothResizing(dist * resizeMul + resizeAdd);
    cameraControls.zoomTo(smoothenSize, false);
  }

  if (resize && isArcball)
    gCamera.position.set(gCamera.position.x, gCamera.position.y, 1 / dist);
}

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
