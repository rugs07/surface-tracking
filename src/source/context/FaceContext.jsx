// GlobalFaceFunctionsContext.js
import * as THREE from "three";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useVariables } from "./variableContext";

const GlobalFaceFunctionsContext = createContext();
let GlobalHandLabel;
export const GlobalFaceFunctionsProvider = ({ children }) => {
  // var handType;
  let zArr = [];
  let rsArr = [];
  let yArr = [];
  let xtArr = [];
  let ytArr = [];
  let type
  const [handType, setHandType] = useState()
  const [recentYRotations, setRecentYRotations] = useState([]);
  const [recentZRotations, setRecentZRotations] = useState([]);
  // const gsplatCanvas = document.getElementById("gsplatCanvas");
  // Define your globally accessible functions
  let {

    setHandLabels,
    isDirectionalRing,
    setHandPointsX,
    setHandPointsY,
    setHandPointsZ,
    setEarZoom1,
    setEarZoom2,
    XRAngle,
    XRDelta,
    setXRDelta,
    setYRDelta,
    setYRDelta2,
    enableRingTransparency,
    XTrans,
    YTrans,
    translation,
    YRAngle,
    enableSmoothing,
    facingMode,
    verticalRotation,
    jewelType,
    horizontalRotation,
    totalTransX,
    totalTransY,
    lastMidRef,
    ZRAngle,
    lastRefOfMid,
    handLabels,
    YRDelta,
    YRDelta2,
    lastPinkyRef,
    lastIndexRef,
    isMobile,
    selectedJewel,
    scaleMul,
    cameraNear,
    cameraFar,
    resize,
    isArcball,
    setCameraFarVar,
    setJewelType,
    setCameraNearVar,
    setIsvisible1,
    setIsvisible2
  } = useVariables();
//   console.log(enableSmoothing, "arcontext enable smoothing ");
  // const { calculateAngleAtMiddle } = ARFunctions()
  jewelType === type;
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
    setXRDelta(-XRDelta);
    // (
    //   THREE.MathUtils.radToDeg(XRAngle),
    //   THREE.MathUtils.radToDeg(YRAngle),
    //   THREE.MathUtils.radToDeg(ZRAngle)

    // );
  }

  function rotateY(angle) {

    YRAngle = angle;
    YRDelta = THREE.MathUtils.degToRad(-90 - YRAngle - 200);
    YRDelta2 = THREE.MathUtils.degToRad(-90 - YRAngle - 150);
    console.log(YRAngle,"YRAngle");

    if(YRAngle>=77 && YRAngle<=103){
      setIsvisible1(true);
      setIsvisible2(true);
    }
    else if(Math.abs(YRAngle)<77){
      setIsvisible1(false);
      setIsvisible2(true);
    }
    else if(Math.abs(YRAngle) >103){
      setIsvisible1(true);
      setIsvisible2(false);
    }

    setYRDelta(YRDelta);
    setYRDelta2(YRDelta2);
    return {YRDelta,YRDelta2};
  }

  const mapRange = (value, oldMin, oldMax, newMin, newMax) => {
    const oldRange = oldMax - oldMin;

    const newRange = newMax - newMin;

    const newValue = ((value - oldMin) * newRange) / oldRange + newMin;

    return newValue;
  };

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

  function rotateZ1(angle, canX, canY) {
    let canP = 0;
    let adjustmentFactor = window.innerWidth * 0.5;
    let transform = null;
    // if (!translation) transform = "rotateZ(" + angle + "deg)";
    // else canP = canX - adjustmentFactor;
    console.log(canX,canY,"CanX and canY");
    transform =
      "translate3d(" +
      -canX +
      "px, " +
      canY +
      "px, " +
      0 +
      "px) rotateZ(" +
      -angle +
      "deg)";

    gsplatCanvas.style.transform = transform;

    ZRAngle = angle;
    XTrans = -canX;
    YTrans = canY;
    // ZRDelta = THREE.MathUtils.degToRad(180 - ZRAngle);
  }

  function rotateZ2(angle, canX, canY) {
    let canP = 0;
    let adjustmentFactor = window.innerWidth * 0.5;
    let transform = null;
    // if (!translation) transform = "rotateZ(" + angle + "deg)";
    // else canP = canX - adjustmentFactor;
    transform =
      "translate3d(" +
      -canX +
      "px, " +
      canY +
      "px, " +
      0 +
      "px) rotateZ(" +
      -angle +
      "deg)";

    gsplatCanvas2.style.transform = transform;

    ZRAngle = angle;
    XTrans = -canX;
    YTrans = canY;
    // ZRDelta = THREE.MathUtils.degToRad(180 - ZRAngle);
  }

  function getYAngleAndRotate(newIndexRef, newPinkyRef, zAngle) {
    let rotatedNewIndexRef = rotateVectorZ(newIndexRef, -zAngle);
    let rotatedNewPinkyRef = rotateVectorZ(newPinkyRef, -zAngle);

    let yAngle = -Math.atan2(
      rotatedNewPinkyRef.z - rotatedNewIndexRef.z,
      rotatedNewPinkyRef.x - rotatedNewIndexRef.x
    );

    yAngle = THREE.MathUtils.radToDeg(yAngle) - 90;
    console.log(yAngle,"Yangle")

    if (facingMode === "environment") {
      yAngle += 180;
    }

    let normYAngle = normalizeAngle(yAngle);

    if (enableSmoothing) {
      // Increase smoothing window
      setRecentYRotations(prevRotations => {
        const updatedRotations = [...prevRotations, normYAngle];
        return updatedRotations.slice(-10); // Increase to 10 points
      });

      // Calculate weighted average with more recent values having higher weight
      if (recentYRotations.length === 10) {
        const weights = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const weightedSum = recentYRotations.reduce((sum, angle, index) => sum + angle * weights[index], 0);
        const weightSum = weights.reduce((sum, weight) => sum + weight, 0);
        const smoothedAngle = weightedSum / weightSum;

        // Clamp maximum angle change
        const maxAngleChange = 5; // Adjust this value as needed
        normYAngle = Math.max(Math.min(smoothedAngle, YRAngle + maxAngleChange), YRAngle - maxAngleChange);
      }
    }

    // if (horizontalRotation) {
    //   rotateY(-normYAngle);
    // } else if (verticalRotation) {
    //   normYAngle = Math.max(-90, Math.min(90, normYAngle));
    //   rotateY(-normYAngle);
    // }

    rotateY(-normYAngle);

    newPinkyRef = lastPinkyRef;
    newIndexRef = lastIndexRef;
  }

  function getXAngleAndRotate(wrist, newRefOfMid, zAngle) {
    if (lastRefOfMid) {
      newRefOfMid = rotateVectorZ(newRefOfMid, -zAngle);
      wrist = rotateVectorZ(wrist, -zAngle);

      const dy = newRefOfMid.y - wrist.y;
      const dz = newRefOfMid.z - wrist.z;

      let xAngle = Math.atan2(dy, dz);
      xAngle = THREE.MathUtils.radToDeg(xAngle) + 65;

      let normXAngle = normalizeAngle(xAngle);

      if (normXAngle < -10) normXAngle = -10;
      if (normXAngle > 10) normXAngle = 10;

      xArr.shift(); // Remove first index value
      rotateX(normXAngle);
    }

    newRefOfMid = lastRefOfMid;
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

  function getZAngleAndRotate1(wrist, newMidRef, canX, canY) {
    if (lastMidRef) {
      const dy = newMidRef.y - wrist.y;
      const dx = newMidRef.x - wrist.x;

      let zAngle = Math.atan2(dy, dx);
      zAngle = THREE.MathUtils.radToDeg(zAngle) + 90;

      let normZAngle = normalizeAngle(zAngle);

      if (enableSmoothing) {
        // Smooth rotation
        setRecentZRotations(prevRotations => {
          const updatedRotations = [...prevRotations, normZAngle];
          return updatedRotations.slice(-10); // Keep last 10 points
        });

        if (recentZRotations.length === 10) {
          const weights = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
          const weightedSum = recentZRotations.reduce((sum, angle, index) => sum + angle * weights[index], 0);
          const weightSum = weights.reduce((sum, weight) => sum + weight, 0);
          const smoothedAngle = weightedSum / weightSum;

          // Use a smaller max angle change for more responsiveness
          const maxAngleChange = 2;
          normZAngle = Math.max(Math.min(smoothedAngle, ZRAngle + maxAngleChange), ZRAngle - maxAngleChange);
        }

        // Smooth translation
        const translationSmoothingFactor = 1; // Adjust this value between 0 and 1 for desired smoothness

        let smoothedX = XTrans * (1 - translationSmoothingFactor) + canX * translationSmoothingFactor;
        let smoothedY = YTrans * (1 - translationSmoothingFactor) + canY * translationSmoothingFactor;

        // Update the global translation variables
        XTrans = smoothedX;
        YTrans = smoothedY;

        // Use the smoothed values for rotation
        canX = smoothedX;
        canY = smoothedY;
      }

      // if (isMobile || isIOS) {
      //   if (jewelType === "bangle" || type === "bangle") normZAngle *= 1;
      // }
    //   rotateZ(normZAngle, canX, canY);
    rotateZ1(normZAngle, canX, canY);

    }
    
    lastMidRef = newMidRef;
  }

  function getZAngleAndRotate2(wrist, newMidRef, canX, canY) {
    if (lastMidRef) {
      const dy = newMidRef.y - wrist.y;
      const dx = newMidRef.x - wrist.x;

      let zAngle = Math.atan2(dy, dx);
      zAngle = THREE.MathUtils.radToDeg(zAngle) + 90;

      let normZAngle = normalizeAngle(zAngle);

      if (enableSmoothing) {
        // Smooth rotation
        setRecentZRotations(prevRotations => {
          const updatedRotations = [...prevRotations, normZAngle];
          return updatedRotations.slice(-10); // Keep last 10 points
        });

        if (recentZRotations.length === 10) {
          const weights = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
          const weightedSum = recentZRotations.reduce((sum, angle, index) => sum + angle * weights[index], 0);
          const weightSum = weights.reduce((sum, weight) => sum + weight, 0);
          const smoothedAngle = weightedSum / weightSum;

          // Use a smaller max angle change for more responsiveness
          const maxAngleChange = 2;
          normZAngle = Math.max(Math.min(smoothedAngle, ZRAngle + maxAngleChange), ZRAngle - maxAngleChange);
        }

        // Smooth translation
        const translationSmoothingFactor = 1; // Adjust this value between 0 and 1 for desired smoothness

        let smoothedX = XTrans * (1 - translationSmoothingFactor) + canX * translationSmoothingFactor;
        let smoothedY = YTrans * (1 - translationSmoothingFactor) + canY * translationSmoothingFactor;

        // Update the global translation variables
        XTrans = smoothedX;
        YTrans = smoothedY;

        // Use the smoothed values for rotation
        canX = smoothedX;
        canY = smoothedY;
      }

      // if (isMobile || isIOS) {
      //   if (jewelType === "bangle" || type === "bangle") normZAngle *= 1;
      // }
    //   rotateZ(normZAngle, canX, canY);
    rotateZ2(normZAngle, canX, canY);

    }
    
    lastMidRef = newMidRef;
  }

  function euclideanDistance(a, b) {
    return Math.sqrt(
      Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2) + Math.pow(a.z - b.z, 2)
    );
  }

  function manhattanDistance(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y) + Math.abs(a.z - b.z);
  }

  function normalizePoint(point, sourceVideoRatioWH=1) {
    if (sourceVideoRatioWH >= 1) {
      return {
        x: point.x * sourceVideoRatioWH,
        y: point.y,
        z: point.z
      };
    } else {
      return {
        x: point.x,
        y: point.y / sourceVideoRatioWH,
        z: point.z
      };
    }
  }
  
  function normalizePoints(points, sourceVideoRatioWH) {
    if (Array.isArray(points)) {
      return points.map(point => normalizePoint(point, sourceVideoRatioWH));
    } else {
      return normalizePoint(points, sourceVideoRatioWH);
    }
  }

  function calculateFaceSize1(points, YRAngle, ZRAngle) {
    // calculate wrist size as distance between wrist and first knuckle and distance between thumb knuckle and pinky knuckle on first frame and then adjust for scale using wrist.z value
    // let wristSize = manhattanDistance(points[0], points[5]);
    // wristSize += manhattanDistance(points[9], points[17]);
    // wristSize /= 2;

    //Inner edge of eyes
    let facesize = null;
    let eyegap = euclideanDistance(points[4], points[177]);
    facesize = eyegap;
    console.log(eyegap);

    lastSize = facesize;
    return facesize;
  }

  function calculateFaceSize2(points, YRAngle, ZRAngle) {
    // calculate wrist size as distance between wrist and first knuckle and distance between thumb knuckle and pinky knuckle on first frame and then adjust for scale using wrist.z value
    // let wristSize = manhattanDistance(points[0], points[5]);
    // wristSize += manhattanDistance(points[9], points[17]);
    // wristSize /= 2;

    //Inner edge of eyes
    let facesize = null;
    let eyegap = euclideanDistance(points[4], points[401]);
    facesize = eyegap;
    console.log(eyegap);

    lastSize = facesize;
    return facesize;
  }

  let lastSize = null;

  function smoothResizing(facesize) {
    // console.log(GlobalHandLabel, "smooth resizing");
    if (enableSmoothing) {
      let diff = 0;
      if (lastSize !== null) {
        diff = facesize - lastSize;

        rsArr.push(diff); // Insert new value at the end

        if (rsArr.length > 3) {
          rsArr.shift(); // Remove the first index value

          // Check if all values are either positive or negative
          var allSameSign = rsArr.every(function (value) {
            return (value >= 0 && diff >= 0) || (value < 0 && diff < 0);
          });

          if (!allSameSign) return lastSize;

          // Apply weighted moving average for smoother transition
          let sumWeights = 0;
          let weightedSum = 0;
          for (let i = 0; i < rsArr.length; i++) {
            const weight = i + 1; // Assign higher weight to more recent changes
            sumWeights += weight;
            weightedSum += rsArr[i] * weight;
          }
          const smoothDiff = weightedSum / sumWeights;
          facesize = lastSize + smoothDiff;
        }
      }
      lastSize = facesize;
    } else {
      lastSize = facesize;
    }
    return facesize;
  }

  function translateRotateMesh(points, sourcevideowidth,sourcevideoheight) {
    if (!points || points.length === 0) {
      return;
    }

    // Calculate earring positions staypoint1 is right & staypoint2 is left
    let stayPoint1 = null;
    let stayPoint2 = null;
    const desiredDistance = 1.25; // dist on the vector for staypoint
    
    if (points[401] && points[433]) {
      // Calculate the vector between point 401 and 433
      const vector2 = {
        y: points[376].y - points[401].y,
        z: points[376].z - points[401].z,
        x: points[376].x - points[401].x,
      };

      // Calculate the earring position
      stayPoint2 = {
        x: points[401].x - vector2.x * desiredDistance,
        y: points[401].y - vector2.y * desiredDistance,
        z: points[401].z - vector2.z * desiredDistance,
      };    
    }

    if (points[177] && points[147]) {
    
      // Calculate the vector between point 401 and 433
      const vector1 = {
        x: points[147].x - points[177].x,
        y: points[147].y - points[177].y,
        z: points[147].z - points[177].z,
      };
         
      // Calculate the earring position
      stayPoint1 = {
        x: points[177].x - vector1.x * desiredDistance,
        y: points[177].y - vector1.y * desiredDistance,
        z: points[177].z - vector1.z * desiredDistance,
      };
    }

    let window_scale, canX1, canY1, canX2, canY2;
    let windowWidth = document.documentElement.clientWidth;
    let windowHeight = document.documentElement.clientHeight;
    let sourceVideoRatioWH = sourcevideowidth / sourcevideoheight;

    if (windowWidth / windowHeight > sourceVideoRatioWH) {
      // Image is taller than the canvas, so we crop top & bottom & scale as per best fit of width
      window_scale = windowWidth / sourcevideowidth;
      canX1 = stayPoint1.x * windowWidth - windowWidth / 2;
      canX2 = stayPoint2.x * windowWidth - windowWidth / 2;

      canY1 = stayPoint1.y * (sourcevideoheight * window_scale) - (sourcevideoheight * window_scale) / 2;
      canY2 = stayPoint2.y * (sourcevideoheight * window_scale) - (sourcevideoheight * window_scale) / 2;
    } else {
        // Image is wider than the canvas, so we crop left & right & scale as per best fit of height
        window_scale = windowHeight / sourcevideoheight;
        canY1 = stayPoint1.y * windowHeight - windowHeight / 2;
        canY2 = stayPoint2.y * windowHeight - windowHeight / 2;

        canX1 = stayPoint1.x * (sourcevideowidth * window_scale) - (sourcevideowidth * window_scale) / 2;
        canX2 = stayPoint2.x * (sourcevideowidth * window_scale) - (sourcevideowidth * window_scale) / 2;
    }

    let nosepoint = normalizePoint(points[4], sourceVideoRatioWH);
    let centerfacepoint = normalizePoint(points[9], sourceVideoRatioWH);
    let norm_points = normalizePoints(points, sourceVideoRatioWH);
    // let earpoint_y1 = points[177];

    getZAngleAndRotate1(nosepoint, centerfacepoint, canX1, canY1);
    getZAngleAndRotate2(nosepoint, centerfacepoint, canX2, canY2);
    // getZAngleAndRotate1(points[234], points[127], canX1, canY1);
    // getZAngleAndRotate2(points[454], points[356], canX2, canY2);
    getYAngleAndRotate(points[234], points[454], ZRAngle)
    
    // Resizing 
    // logic 1 and 2 equally good need more testing across phones and laptop on portrait and landscape
    const dist1 = calculateFaceSize1(points, YRAngle, ZRAngle) * window_scale; // logic 1 
    // const dist1 = calculateFaceSize1(points, YRAngle, ZRAngle) * windowWidth/windowHeight; // logic 2
    let resizeMul1 = window.innerWidth < 768 ? 0.6 : 0.8;
    // let smoothenSize = smoothResizing(dist * resizeMul1);
    setEarZoom1(dist1*resizeMul1);

    let resizeMul2 = window.innerWidth < 768 ? 0.6 : 0.8;
    const dist2 = calculateFaceSize2(points, YRAngle, ZRAngle) * window_scale;
    setEarZoom2(dist2*resizeMul2);
  }
  

  const calculateAngleAtMiddle = (landmark1, landmark2, landmark3) => {
    // Calculate vectors between landmarks
    const vector1 = [
      landmark1.x - landmark2.x,
      landmark1.y - landmark2.y,
      landmark1.z - landmark2.z,
    ];
    const vector2 = [
      landmark3.x - landmark2.x,
      landmark3.y - landmark2.y,
      landmark3.z - landmark2.z,
    ];

    // Calculate dot product of the two vectors
    const dotProduct =
      vector1[0] * vector2[0] +
      vector1[1] * vector2[1] +
      vector1[2] * vector2[2];

    // Calculate magnitudes of the vectors
    const magnitude1 = Math.sqrt(
      vector1[0] * vector1[0] +
      vector1[1] * vector1[1] +
      vector1[2] * vector1[2]
    );
    const magnitude2 = Math.sqrt(
      vector2[0] * vector2[0] +
      vector2[1] * vector2[1] +
      vector2[2] * vector2[2]
    );

    // Calculate the cosine of the angle using dot product and magnitudes
    const cosAngle = dotProduct / (magnitude1 * magnitude2);

    // Calculate the angle in radians
    const angleInRadians = Math.acos(cosAngle);

    // Convert the angle to degrees
    const angleInDegrees = (angleInRadians * 180) / Math.PI;

    return Math.trunc(angleInDegrees / 10);
  };

  const contextValue = {
    rotateX,
    rotateY,
    normalizeAngle,
    rotateZ1,
    rotateZ2,
    mapRange,
    getYAngleAndRotate,
    getXAngleAndRotate,
    rotateVectorZ,
    getZAngleAndRotate1,
    getZAngleAndRotate2,
    euclideanDistance,
    manhattanDistance,
    calculateFaceSize1,
    calculateFaceSize2,
    smoothResizing,
    calculateAngleAtMiddle,
    translateRotateMesh,
  };

  return (
    <GlobalFaceFunctionsContext.Provider value={contextValue}>
      {children}
    </GlobalFaceFunctionsContext.Provider>
  );
};

export const FaceFunctions = () => useContext(GlobalFaceFunctionsContext);
