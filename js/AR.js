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
let windowWidth = document.documentElement.clientWidth;
let windowHeight = document.documentElement.clientHeight;

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
    if (selectedJewel === "flowerbangle") showZone = [-60, 90];

    if (angle > showZone[0] && angle < showZone[1]) {
      // cameraControls.rotate(angle, 0, false);
      cameraControls.azimuthAngle = THREE.MathUtils.degToRad(angle) + baseTheta;
    }
    // console.log(
    //   "yangle",
    //   angle.toFixed(2),
    //   THREE.MathUtils.radToDeg(baseTheta).toFixed(2),
    //   handLabel
    // );
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
  const oldMin = -20;
  const oldMax = 20;
  const newMin = 20;
  const newMax = 60;
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
    let transparencyZone = [-20, 20];
    if (normYAngle > transparencyZone[0] && normYAngle < transparencyZone[1]) {
      ringTrans = 1.35;
      applyRingTrans();
      // converting angles to new range -20 to 20 -> 20 - 60 for transparency
      normYAngle = convertRingTransRange(normYAngle);
    } else {
      if (normYAngle > 0) normYAngle += 0.5;
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
            (value >= 0 && angleDifference >= 5) ||
            (value < 0 && angleDifference < -5)
          );
        });

        if (!allSameSign) {
          normZAngle = ZRAngle;
        }
      }
    }

    // normZAngle *= 0.85;
    if ((isMobile || isIOS) && jewelType === "bangle") {
      normZAngle *= 0.9;
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
    newMin = isMobile ? 0.125 : 0.49;
    if (isIOS) newMin = 0.1;
    newMax = isMobile ? 0.85 : 0.51;
    if (isIOS) newMax = 0.85;

    if (!(isMobile || isIOS)) {
      let respX = mapRange(windowWidth, 1600, 1100, 0.0215, 0.15);
      newMin -= respX;
      newMax += respX;
    }
  } else if (jewelType === "ring") {
    newMin = isMobile ? 0.125 : 0.46;
    if (isIOS) newMin = 0.22;
    newMax = isMobile ? 0.825 : 0.5;
    if (isIOS) newMax = 0.7;

    if (!(isMobile || isIOS)) {
      let respX = mapRange(windowWidth, 1600, 1100, 0.0215, 0.155);
      newMin -= respX;
      newMax += respX;
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
  let newMin = isMobile ? 0.45 : 0.48;
  if (isIOS) newMin = 0.44;
  let newMax = isMobile ? 0.52 : 0.485;
  if (isIOS) newMax = 0.52;

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

function calculateWristSize(points, YTAdd) {
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
  if (isMobile || isIOS) {
    const plusVal = mapRange(YTAdd, 0, 1, 0, 0.12);
    wristSize -= plusVal;
  } else {
    const plusVal = mapRange(YTAdd, 0, 1, 0, 0.06);
    wristSize += plusVal;
  }

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
  let midKnuckle = points[9];
  let midTop = points[12];
  let midPip = points[10];
  let ringPos = {
    x: (points[13].x + points[14].x - 0.04) / 2.0,
    y: (points[13].y + points[14].y - 0.05) / 2.0,
    z: (points[13].z + points[14].z) / 2.0,
  };

  if (isMobile || isIOS) {
    if (handLabel === "Left") ringPos.x -= 0.0025;
  } else {
    ringPos.y -= 0.0175;
    if (handLabel === "Left") ringPos.x -= 0.005;
    else ringPos.x -= 0.0025;
  }

  let stayPoint = null;
  if (jewelType === "bangle") {
    stayPoint = wrist;
  } else if (jewelType === "ring") {
    stayPoint = ringPos;
  }

  // Translation calc
  let XTSub = getNormalizedXTSub(stayPoint.x);
  let YTSub = getNormalizedYTSub(stayPoint.y);
  let respY = windowWidth / 15000;
  if (windowWidth < 1250) respY = windowWidth / 30000;

  let rollMul = 0;
  if (jewelType === "bangle") {
    rollMul = mapRange(windowWidth, 1600, 1100, 0.01, -0.03);
    if (isMobile || isIOS) rollMul = -0.005;
  }
  if (jewelType === "ring") {
    rollMul = mapRange(windowWidth, 1600, 1100, 0.03, -0.001);
    if (isMobile || isIOS) rollMul = 0;
  }
  let YTAdd = Math.abs(Math.sin(THREE.MathUtils.degToRad(ZRAngle)));
  let foldedAngle = calculateAngleAtMiddle(wrist, midKnuckle, midTop);

  // Changing range from (0,1) to (-0.5 to 0.5)
  let newX = stayPoint.x - XTSub;
  let newY = stayPoint.y - YTSub;
  if (!(isMobile || isIOS)) newY += respY;
  if (jewelType === "bangle") {
    newY += YTAdd * rollMul;
    if (handLabel === "Right") newX -= YTAdd * rollMul;
    else newX += YTAdd * rollMul;

    if (isMobile || isIOS) {
      if (handLabel === "Right") newX += YTAdd * -rollMul * 2;
      else newX += YTAdd * rollMul * 2;

      if (facingMode === "environment") {
        if (handLabel === "Right") {
          newY += 0.01;
          newX -= 0.025;
        } else {
          if (YRAngle < 0) {
            newY += 0.01;
            newX += 0.025;
          } else {
            newY -= 0.03;
            newX += 0.01;
          }
        }

        if (YRAngle >= -30 && YRAngle < 0) {
          // newY += YRAngle * (foldedAngle * 0.0000125);
          // newY += 0.1;
          const val = YRAngle / 1800;
          newY -= val;
          newX += val / 4;
        } else if (YRAngle >= 0 && YRAngle < 30) {
          // newY += (90 - YRAngle) * (foldedAngle * 0.0000125);
          // newY -= 0.1;
          if (handLabel === "Right") {
            const val = YRAngle / 300;
            newY += val;
            newX -= val / 4;
          }
        } else if (YRAngle >= 30 && YRAngle < 60) {
          const val = YRAngle / 1200;
          newY += val;
          newX -= val / 4;
        } else if (YRAngle >= 60 && YRAngle < 90) {
          const val = YRAngle / 3600;
          newY += val;
          newX -= val / 4;
        }
      }
    } else {
      if (YRAngle >= 45 && YRAngle < 90) {
        newY += (90 - YRAngle) * (foldedAngle * 0.00003125);
      } else if (YRAngle >= 0 && YRAngle < 45) {
        newY += YRAngle * (foldedAngle * 0.00003125);
      }
    }
    // console.log(YRAngle);
  } else {
    newY += YTAdd * rollMul;
    if (handLabel === "Left") {
      newX -= 0.001;
    }
  }

  const XTMul = isMobile || isIOS ? 1400 : 1700;
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
    if (isDirectionalRing)
      getZAngleAndRotate(points[13], points[14], canX, canY);
    else {
      if (
        (handLabel === "Right" && facingMode !== "environment") ||
        (handLabel === "Left" && facingMode === "environment")
      ) {
        getZAngleAndRotate(points[14], points[13], canX, canY);
      } else {
        getZAngleAndRotate(points[13], points[14], canX, canY);
      }
    }

    getYAngleAndRotate(firstKnuckle, pinkyKnuckle, ZRAngle);
  }

  // Resizing
  const dist = calculateWristSize(points, YTAdd);

  let resizeMul;

  if (jewelType === "bangle") {
    // back-cam
    resizeMul = 7.5;

    // front-cam
    if (facingMode !== "environment") {
      resizeMul = isMobile || isIOS ? 7 : 6.5;
    }

    if (!(isIOS || isMobile)) {
      resizeMul += mapRange(windowWidth, 1600, 1100, 1, 0);
    }
  } else if (jewelType === "ring") {
    // back-cam
    resizeMul = 1.2;

    // front-cam
    if (facingMode !== "environment") {
      resizeMul = isMobile || isIOS ? 1.2 : 1.4;
    }

    if (!(isIOS || isMobile)) {
      resizeMul += mapRange(windowWidth, 1600, 1100, 0.35, 0);
    }

    if (selectedJewel === "floralring") {
      resizeMul -= 0.15;
    }
  }

  let resizeAdd = 1;
  // if (isMobile || isIOS) resizeAdd = YTAdd * 0.1;

  if (jewelType === "ring") {
    resizeAdd = isMobile || isIOS ? YTAdd : 0;
  }

  if (jewelType === "ring") {
    // if (YRAngle >= 30 && (isMobile || isIOS)) {
    //   resizeAdd -= YRAngle * 0.00075;
    // }
  } else {
    console.log(YRAngle);
    if (YRAngle > 30) {
      resizeMul -= foldedAngle * 0.01;
      if (isIOS || isMobile) {
        if (facingMode !== "environment") resizeMul -= 0.75;
        else resizeMul -= 0.5;
      }
    } else if (YRAngle < -30) {
      resizeMul += 2;
      resizeMul -= foldedAngle * 0.15;
      resizeAdd += foldedAngle * 10;

      if (isIOS || isMobile) {
        if (facingMode !== "environment") {
          if (handLabel === "Right") resizeMul -= 1;
        } else {
          // if (handLabel === "Right") resizeMul -= 0.5;
        }
      }
    } else {
      // -30 to 30
      resizeMul -= foldedAngle * 0.01;
      if (isIOS || isMobile) {
        if (facingMode !== "environment") resizeMul -= 0.5;
        else resizeMul -= 0.25;
      }
    }

    if ((isMobile || isIOS) && facingMode === "environment") {
      if (handLabel === "Right") {
        if (YRAngle >= -45 && YRAngle <= 0)
          resizeMul += mapRange(YRAngle, -45, 0, 0, 3);
        else if (YRAngle >= 90 && YRAngle <= 110)
          resizeMul += mapRange(YRAngle, 90, 110, 1.5, 3);
      } else {
        if (YRAngle >= -110 && YRAngle <= -60) {
          resizeMul += mapRange(YRAngle, -110, -60, 0, 3);
        }
      }
    }
  }

  if (resize && !isArcball) {
    let smoothenSize = smoothResizing(dist * resizeMul);

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
