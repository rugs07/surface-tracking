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
let xtArr = [];
let ytArr = [];
let windowWidth = document.documentElement.clientWidth;
let windowHeight = document.documentElement.clientHeight;
console.log("windowWidth : ", windowWidth);
console.log("windowHeight : ", windowHeight);

if (isMobile || isIOS) {
  windowWidth = window.screen.width;
  windowHeight = window.screen.height;
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
    // cameraControls.rotate(0, angle, false);
  }

  XRAngle = angle;
  XRDelta = THREE.MathUtils.degToRad(-XRAngle);

  // console.log(
  //   THREE.MathUtils.radToDeg(XRAngle),
  //   THREE.MathUtils.radToDeg(YRAngle),
  //   THREE.MathUtils.radToDeg(ZRAngle)
  // );
}

function rotateY(angle) {
  // if (isArcball) {
  //   var quaternion = new THREE.Quaternion().setFromAxisAngle(
  //     new THREE.Vector3(0, 1, 0),
  //     angle
  //   );
  //   gCamera.position.applyQuaternion(quaternion);
  //   gCamera.up.applyQuaternion(quaternion);
  //   gCamera.quaternion.multiplyQuaternions(quaternion, gCamera.quaternion);
  // } else {
  //   // cameraControls.rotate(angle, 0, false);
  //   // Using Show zone to not show the part which was placed on for recording

  //   let showZone = [-90, 90];
  //   if (selectedJewel === "flowerbangle") showZone = [-60, 90];

  //   if (angle > showZone[0] && angle < showZone[1]) {
  //     // cameraControls.azimuthAngle = THREE.MathUtils.degToRad(angle) + baseTheta;
  //   }
  //   // console.log(
  //   //   "yangle",
  //   //   angle.toFixed(2),
  //   //   THREE.MathUtils.radToDeg(baseTheta).toFixed(2),
  //   //   handLabel
  //   // );
  // }

  YRAngle = angle;

  if (
    (handLabel === "Right" && facingMode !== "environment") ||
    (handLabel === "Left" && facingMode === "environment")
  )
    YRDelta = THREE.MathUtils.degToRad(90 - YRAngle);
  else YRDelta = THREE.MathUtils.degToRad(-90 - YRAngle);
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
  // cameraControls.setFocalOffset(canX, canY, 0.0, false);

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

  gsplatCanvas.style.transform = transform;

  ZRAngle = angle;
  XTrans = canX;
  YTrans = canY;

  // ZRDelta = THREE.MathUtils.degToRad(180 - ZRAngle);
}

function convertRingTransRange(value) {
  const oldMin = -20;
  const oldMax = 20;
  const newMin = 20;
  const newMax = 55;
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
      ringTrans = 1.3;
      // applyRingTrans();
      // converting angles to new range -20 to 20 -> 20 - 60 for transparency
      normYAngle = convertRingTransRange(normYAngle);
    } else {
      if (normYAngle > 0) normYAngle += 0.5;
      else normYAngle -= 0.5;
      // resetRingTrans();
    }
  }

  // previous code
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


  //advanced code with new method
//   function calculateWeightedAverage(values, weights) {
//     let weightedSum = values.reduce((acc, val, i) => acc + val * weights[i], 0);
//     let weightSum = weights.reduce((acc, val) => acc + val, 0);
//     return weightedSum / weightSum;
// }

// if (enableSmoothing) {
//     let diff = normYAngle - YRAngle;
//     yArr.push(diff); // Insert new value at the end

//     // Define weights for the weighted average calculation
//     const weights = [1, 2, 3]; // Example weights, adjust based on preference

//     if (yArr.length > weights.length) {
//         yArr.shift(); // Ensure yArr doesn't grow indefinitely
//     }

//     if (yArr.length === weights.length) {
//         // Calculate weighted average difference
//         let weightedDiff = calculateWeightedAverage(yArr, weights);

//         // Apply the weighted difference to adjust YRAngle smoothly
//         YRAngle += weightedDiff;

//         // Clear the array to start fresh for the next set of frames
//         yArr = [];
//     }
// }


  if (horizontalRotation) {
    // if (normYAngle > 90) normYAngle = 90;
    // else if (normYAngle < -90) normYAngle = -90;
    rotateY(-normYAngle);
  } else if (verticalRotation) {
    if (normYAngle > 90) normYAngle = 90;
    else if (normYAngle < -90) normYAngle = -90;
    rotateY(-normYAngle);
  }
  lastPinkyRef = newPinkyRef;
  lastIndexRef = newIndexRef;
}

function getXAngleAndRotate(wrist, newRefOfMid, zAngle) {
  if (lastRefOfMid) {
    // rotate vectors around y-axis by -zAngle
    newRefOfMid = rotateVectorZ(newRefOfMid, -zAngle);
    wrist = rotateVectorZ(wrist, -zAngle);

    const dy = newRefOfMid.y - wrist.y;
    const dz = newRefOfMid.z - wrist.z;

    let xAngle = Math.atan2(dy, dz);
    xAngle = THREE.MathUtils.radToDeg(xAngle) + 90;

    // Normalize the angle to the range of -180 to 180 degrees
    let normXAngle = normalizeAngle(xAngle);

    if (normXAngle < -10) normXAngle = -10;
    if (normXAngle > 10) normXAngle = 10;
    // if (jewelType === "ring") {
    //   if (normXAngle >= 0 && normXAngle <= 10) normXAngle = 0;
    // }

    // if (enableSmoothing) {
    //   // Calculate the angle difference between the current and the new angle
    //   const angleDifference = XRAngle - normXAngle;
    //   // console.log("z rot:", ZRAngle, angleDifference, zAngle, normXAngle);

    //   xArr.push(angleDifference); // Insert new value at the end
    //   if (xArr.length > 3) {
    //     xArr.shift(); // Remove first index value
    //     // Check if all 3 values are either positive or negative
    //     var allSameSign = xArr.every(function (value) {
    //       return (
    //         (value >= 0 && angleDifference >= 0 && angleDifference <= 20) ||
    //         (value < 0 && angleDifference < 0 && angleDifference >= -20)
    //       );
    //     });

    //     if (!allSameSign) {
    //       normXAngle = XRAngle;
    //     }
    //   }
    // }

    rotateX(normXAngle);
  }

  lastRefOfMid = newRefOfMid;
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

      const XDiff = XTrans - canX;

      xtArr.push(XDiff); // Insert new value at the end

      if (xtArr.length > 3) {
        xtArr.shift(); // Remove first index value
        // Check if all 5 values are either positive or negative
        var allSameSign = xtArr.every(function (value) {
          return (value >= 0 && XDiff >= 0) || (value < 0 && XDiff < 0);
        });

        if (!allSameSign) {
          canX = XTrans;
        }
      }

      const YDiff = YTrans - canY;

      ytArr.push(YDiff); // Insert new value at the end

      if (ytArr.length > 3) {
        ytArr.shift(); // Remove first index value
        // Check if all 5 values are either positive or negative
        var allSameSign = ytArr.every(function (value) {
          return (value >= 0 && YDiff >= 0) || (value < 0 && YDiff < 0);
        });

        if (!allSameSign) {
          canY = YTrans;
        }
      }
    }

    // normZAngle *= 0.85;
    if (isMobile || isIOS) {
      if (jewelType === "bangle") normZAngle *= 0.9;
    }

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
    newMin = 0.44;
    newMax = 0.56;
  } else if (jewelType === "ring") {
    newMin = 0.435;
    newMax = 0.525;
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
  let newMin = 0.4;
  let newMax = 0.55;

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

function calculateWristSize(points, YRAngle, ZRAngle, foldedHand) {
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

  let YTAdd = Math.abs(Math.sin(THREE.MathUtils.degToRad(ZRAngle)));
  let foldResize =
    YTAdd *
    Math.abs(Math.cos(THREE.MathUtils.degToRad(YRAngle))) *
    (1 - foldedHand / 20);

  if (isMobile || isIOS) {
    const mulVal = mapRange(YTAdd, 0, 1, 1, 1.1);
    wristSize *= mulVal;

    wristSize *= mapRange(foldResize, 0, 1, 1, 0.5);
  } else {
    const mulVal = mapRange(YTAdd, 0, 1, 1, 1.25);
    wristSize *= mulVal * 1.6;

    wristSize *= mapRange(foldResize, 0, 1, 1, 0.65);
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
function translateRotateMesh(points, handLabel, isPalmFacing, sourceImage) {
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
    x: (points[13].x + points[14].x) / 2.0,
    y: (points[13].y + points[14].y) / 2.0,
    z: (points[13].z + points[14].z) / 2.0,
  };

  // console.log(wrist);s
  let stayPoint = null;
  if (jewelType === "bangle") {
    if (handLabel === "Left") {
      stayPoint = {
        x: wrist.x - 0.015, // Adjust the x-coordinate to move slightly to the side
        y: wrist.y + 0.02, // Adjust the y-coordinate to move slightly below
        z: wrist.z, // Keep the z-coordinate the same
      };
    } else if (handLabel === "Right") {
      stayPoint = {
        x: wrist.x, // Adjust the x-coordinate to move slightly to the side
        y: wrist.y + 0.02, // Adjust the y-coordinate to move slightly below
        z: wrist.z, // Keep the z-coordinate the same
      };
    }
  } else if (jewelType === "ring") {
    stayPoint = ringPos;
  }
  if (horizontalRotation) {
    if (jewelType === "bangle") {
      if (handLabel === "Left") {
        stayPoint = {
          x: wrist.x, // Adjust the x-coordinate to move slightly to the side
          y: wrist.y, // Adjust the y-coordinate to move slightly below
          z: wrist.z, // Keep the z-coordinate the same
        };
      } else if (handLabel === "Right") {
        stayPoint = {
          x: wrist.x, // Adjust the x-coordinate to move slightly to the side
          y: wrist.y, // Adjust the y-coordinate to move slightly below
          z: wrist.z, // Keep the z-coordinate the same
        };
      }
    }
  }
  // console.log(stayPoint);

  let foldedHand = calculateAngleAtMiddle(wrist, midKnuckle, midTop);
  // console.log(foldedHand); // check foldedhand value
  //backhand open - 17, backhand closed - (0-1), fronthand open - (16-17) , fronthand closed = (4-7)

  let window_scale, canX, canY;

  console.log("SourceImage height : ",sourceImage.height);
  console.log("SourceImage width : ",sourceImage.width);
  //old code
  if (windowWidth / windowHeight > sourceImage.width / sourceImage.height) {
    // Image is taller than the canvas, so we crop top & bottom & scale as per best fit of width
    canX = stayPoint.x * windowWidth - windowWidth / 2;
    // if(window.navigator.userAgent.includes("Firefox")){
    //   window_scale = (windowWidth/sourceImage.width) * 1.75;
    // }
    window_scale = windowWidth / sourceImage.width;
    canY =
      stayPoint.y * (sourceImage.height * window_scale) -
      (sourceImage.height * window_scale) / 2;
  } else {
    // Image is wider than the canvas, so we crop left & right & scale as per best fit of height
    canY = stayPoint.y * windowHeight - windowHeight / 2;
    window_scale = windowHeight / sourceImage.height;
    canX =
      stayPoint.x * (sourceImage.width * window_scale) -
      (sourceImage.width * window_scale) / 2;
  }

  // new code
  // const referenceWidth = 1920;
  // const referenceHeight = 1080;

  //   // Calculate current screen's aspect ratio
  //   const currentAspectRatio = windowWidth / windowHeight;
  //   const referenceAspectRatio = referenceWidth / referenceHeight;

  //   // Normalize window_scale based on the reference size
  //   // This aims to keep the bangle's size consistent across different devices
  //   let normalizedScale = Math.sqrt((windowWidth * windowHeight) / (referenceWidth * referenceHeight));

  //   // Adjust window_scale based on aspect ratio differences
  //   if (currentAspectRatio > referenceAspectRatio) {
  //      canY = stayPoint.y * windowHeight - windowHeight / 2;
  //   window_scale = windowHeight / sourceImage.height * normalizedScale;
  //   canX =
  //     stayPoint.x * (sourceImage.width * window_scale) -
  //     (sourceImage.width * window_scale) / 2;
  //   } else {
  //       canX = stayPoint.x * windowWidth - windowWidth / 2;
  //   window_scale = windowWidth / sourceImage.width * normalizedScale;
  //   canY =
  //     stayPoint.y * (sourceImage.height * window_scale) -
  //     (sourceImage.height * window_scale) / 2;
  //   } // working good for other devices but for windows bangle size is little bit smaller

    console.log(window_scale)

  // console.log(sourceImage.height, windowHeight, sourceImage.width, windowWidth ) // Sample: 720 731 1280 1536
  // rotation & translation (getZAngleAndRotate also translates)
  totalTransX = canX;
  totalTransY = canY;
  if (jewelType === "bangle") {
    getZAngleAndRotate(wrist, midPip, canX, canY);
    getXAngleAndRotate(wrist, midPip, ZRAngle);
    getYAngleAndRotate(firstKnuckle, pinkyKnuckle, ZRAngle);
  } else if (jewelType === "ring") {
    if (isDirectionalRing) {
      getZAngleAndRotate(points[13], points[14], canX, canY);
      getXAngleAndRotate(points[13], points[14], ZRAngle);
    } else {
      if (
        (handLabel === "Right" && facingMode !== "environment") ||
        (handLabel === "Left" && facingMode === "environment")
      ) {
        getZAngleAndRotate(points[14], points[13], canX, canY);
        getXAngleAndRotate(points[14], points[13], ZRAngle);
      } else {
        getZAngleAndRotate(points[13], points[14], canX, canY);
        getXAngleAndRotate(points[13], points[14], ZRAngle);
      }
    }

    getYAngleAndRotate(firstKnuckle, pinkyKnuckle, ZRAngle);
  }

  // Resizing
  const dist = calculateWristSize(points, YRAngle, ZRAngle, foldedHand);

  let resizeMul;
  // console.log(isPalmFacing);
  function calculateScaleAdjustment(foldedHand, isPalmFacing) {
    let scaleAdjustment = 1.0;

    // Define thresholds based on the observed folded hand angles
    const openHandThreshold = 16; // Average between backhand and fronthand open
    const closedHandThreshold = { backhand: 1, fronthand: 4 }; // Average for closed hand states

    // Adjust scale based on the folded hand angle and device type
    if (
      foldedHand >= closedHandThreshold.fronthand &&
      foldedHand <= openHandThreshold
    ) {
      // Hand is partially closed or in a natural state
      if (isMobile || isIOS) {
        scaleAdjustment = 1.05; // Slightly larger adjustment for mobile devices
      } else {
        scaleAdjustment = 1; // Smaller adjustment for laptops/desktops
      }
    } else if (foldedHand < closedHandThreshold.backhand) {
      // Hand is very closed
      scaleAdjustment = isPalmFacing ? 1.0 : 1.05; // Minor adjustment unless palm is facing, then no change
    }

    // No adjustment needed for fully open hand beyond openHandThreshold
    // as scaleAdjustment remains 1.0

    return scaleAdjustment;
  }

  //previous code
  // function calculateScaleAdjustment(foldedHand, isPalmFacing) {
  //   let scaleAdjustment = 1.0;

  //   if (isPalmFacing) {
  //       scaleAdjustment = 1.05;
  //   }

  //   // Adjust scale based on the folded hand angle
  //   // This threshold and adjustment factor might need to be tuned based on testing
  //   const foldedHandThreshold = 6; // Example threshold for considering the hand as "folded"
  //   if (foldedHand>=3 && foldedHand <= foldedHandThreshold) {
  //       // Increase scale to prevent the bangle from becoming too short
  //       if(isMobile || isIOS){
  //         scaleAdjustment *= 1.1;
  //       }
  //       else{
  //       scaleAdjustment *= 1.15;
  //       }
  //   }
  //   else if(foldedHand<3 && foldedHand > foldedHandThreshold){
  //     scaleAdjustment = 1;
  //   }
  // previous code

  let scaleAdjustment = calculateScaleAdjustment(foldedHand, isPalmFacing);

  if (jewelType === "bangle") {
    // My code
    // if (isMobile || isIOS) {
    //    resizeMul = window_scale * 3;
    //    if(isPalmFacing) resizeMul *=0.7;
    // }
    // else {
    //   if(isPalmFacing) resizeMul = window_scale* 1.52;
    //   else resizeMul = window_scale * 1.5;
    // }

    // if (selectedJewel !== "flowerbangle") resizeMul *= 1.25;
    // My code

    //previous code
    if (isMobile || isIOS) {
      resizeMul = window_scale * 3.0 * scaleAdjustment;
    } else {
      resizeMul = window_scale * 1.5 * scaleAdjustment;
    }

    if (selectedJewel !== "flowerbangle") resizeMul *= 1.15;
  } else if (jewelType === "ring") {
    let visibilityFactor =
      (handLabel === "Right" && !isPalmFacing) ||
      (handLabel === "Left" && isPalmFacing)
        ? 0.9
        : 1.0;
    if (isMobile || isIOS) {
      resizeMul = window_scale * 1.2 * scaleAdjustment * visibilityFactor;
      // if (isPalmFacing) resizeMul *= 0.9;
    } else resizeMul = window_scale * 0.75 * scaleAdjustment * visibilityFactor;

    if (selectedJewel === "floralring") {
      resizeMul *= 0.9;
    }
  }

  let smoothenSize = smoothResizing(dist * resizeMul);
  scaleMul = smoothenSize * 0.5;

  // const baseNear = jewelType === "bangle" ? -4.35 : -4.3;
  // cameraNear = baseNear + scaleMul * 0.01;

  const baseFar = jewelType === "bangle" ? 5 : 5.1;
  cameraFar = baseFar + scaleMul * 0.01;

  // cameraControls.zoomTo(smoothenSize, false);

  if (resize && isArcball)
    gCamera.position.set(gCamera.position.x, gCamera.position.y, 1 / dist);
}
