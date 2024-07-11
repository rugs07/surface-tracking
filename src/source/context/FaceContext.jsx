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
    setWristZoom,
    XRAngle,
    XRDelta,
    setXRDelta,
    setYRDelta,
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


    window.innerWidth < 768 ? YRAngle = angle : YRAngle = -angle
    // YRAngle = -angle;

    if (
      (GlobalHandLabel == "Right" && facingMode !== "environment") ||
      (GlobalHandLabel == "Left" && facingMode === "environment")
    ) {
      YRDelta = THREE.MathUtils.degToRad(90 - YRAngle-10);
    } else {
      YRDelta = THREE.MathUtils.degToRad(-90 - YRAngle-10);
    }

    setYRDelta(YRDelta);
    // console.log(handType, 'hand type');
    return YRDelta;
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
    // canX, canY, "canxandy";
    let canP = 0;
    // cameraControls.setFocalOffset(canX, canY, 0.0, false);
    let adjustmentFactor = window.innerWidth * 0.5;
    angle = angle;
    let transform = null;
    if (!translation) transform = "rotateZ(" + angle + "deg)";
    else canP = canX - adjustmentFactor;
    const angless = window.innerWidth < 768 ? -angle : angle
    console.log(canX,canY,"CanX and canY");
    transform =
      "translate3d(" +
      -canX +
      "px, " +
      canY +
      "px, " +
      0 +
      "px) rotateZ(" +
      angle +
      "deg)";
    // transform, "can's";
    gsplatCanvas.style.transform = transform;

    ZRAngle = -angle;
    XTrans = -canX;
    YTrans = canY;
    // ZRDelta = THREE.MathUtils.degToRad(180 - ZRAngle);
  }

  function rotateZ2(angle, canX, canY) {
    // canX, canY, "canxandy";
    let canP = 0;
    // cameraControls.setFocalOffset(canX, canY, 0.0, false);
    let adjustmentFactor = window.innerWidth * 0.5;
    angle = angle;
    let transform = null;
    if (!translation) transform = "rotateZ(" + angle + "deg)";
    else canP = canX - adjustmentFactor;
    const angless = window.innerWidth < 768 ? -angle : angle
    console.log(canX,canY,"CanX and canY");
    transform =
      "translate3d(" +
      -canX +
      "px, " +
      canY +
      "px, " +
      0 +
      "px) rotateZ(" +
      angle +
      "deg)";
    // transform, "can's";

    gsplatCanvas2.style.transform = transform;

    ZRAngle = -angle;
    XTrans = -canX;
    YTrans = canY;
    // ZRDelta = THREE.MathUtils.degToRad(180 - ZRAngle);
  }

  function convertRingTransRange(value) {
    const oldMin = -25;
    const oldMax = 25;
    const newMin = 25;
    const newMax = 65;
    return ((value - oldMin) * (newMax - newMin)) / (oldMax - oldMin) + newMin;
  }

  function getYAngleAndRotate(newIndexRef, newPinkyRef, zAngle) {
    let rotatedNewIndexRef = rotateVectorZ(newIndexRef, -zAngle);
    let rotatedNewPinkyRef = rotateVectorZ(newPinkyRef, -zAngle);

    let yAngle = -Math.atan2(
      rotatedNewPinkyRef.z - rotatedNewIndexRef.z,
      rotatedNewPinkyRef.x - rotatedNewIndexRef.x
    );

    yAngle = THREE.MathUtils.radToDeg(yAngle) - 90;

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

    if (horizontalRotation) {
      rotateY(-normYAngle);
    } else if (verticalRotation) {
      normYAngle = Math.max(-90, Math.min(90, normYAngle));
      rotateY(-normYAngle);
    }

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
      console.log("hello aaraha h kya")
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
      console.log("hello aaraha h kya")
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

  function calculateFaceSize(points, YRAngle, ZRAngle) {
    // calculate wrist size as distance between wrist and first knuckle and distance between thumb knuckle and pinky knuckle on first frame and then adjust for scale using wrist.z value
    // let wristSize = manhattanDistance(points[0], points[5]);
    // wristSize += manhattanDistance(points[9], points[17]);
    // wristSize /= 2;

    //Inner edge of eyes
    let facesize = null;
    let eyegap = euclideanDistance(points[155], points[362]);
    facesize = eyegap;
    console.log(eyegap);

    lastSize = facesize;
    return facesize;
  }

  let lastSize = null;
  mapRange;

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

  function translateRotateMesh(points, handLabel, isPalmFacing, sourceImage) {
    if (!points || points.length === 0) {
      return;
    }
    setHandLabels(handLabel);
    let earringPos = {
      x: points[401].x,
      y: points[401].y,
      z: points[401].z,
    };
    
    let stayPoint = null;
    
    if (points[401] && points[433]) {
      const point401 = {
        x: points[401].x,
        y: points[401].y,
        z: points[401].z,
      };
      const point433 = {
        x: points[433].x,
        y: points[433].y,
        z: points[433].z,
      };
    
      // Calculate the vector between point 401 and 433
      const vector = {
        x: point433.x - point401.x,
        y: point433.y - point401.y,
        z: point433.z - point401.z,
      };
    
      // Determine the desired distance to the right of point 401
      const desiredXDistance = 0.5; // Adjust this value as needed
      const desiredYDistance = 0.05
    
      // Calculate the earring position
      earringPos = {
        x: point401.x - vector.x * desiredXDistance*4,
        y: point401.y - vector.y * desiredYDistance,
        z: point401.z,
      };
    
      stayPoint = earringPos;
    }
    
    let nosepoint1 = points[4];
    let centerfacepoint1 = points[9];
    let earpoint11 = points[177];
    let earpoint21 = points[401];
  
    let window_scale, canX, canY;
    let windowWidth = document.documentElement.clientWidth;
    let windowHeight = document.documentElement.clientHeight;
    windowWidth = window.screen.width;
    if (windowWidth / windowHeight > sourceImage.width / sourceImage.height) {
      // Image is taller than the canvas, so we crop top & bottom & scale as per best fit of width
      canX = (1 - stayPoint.x) * windowWidth - windowWidth / 2;

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
        // console.log(window_scale,"window scale",sourceImage.width,"sourceimage width")
        // console.log(canX,"CanX",canY,"canY",stayPoint.x,stayPoint.y,"Staypointsx and y");
    }

    // (window_scale);

    // (sourceImage.height, windowHeight, sourceImage.width, windowWidth ) // Sample: 720 731 1280 1536
    // rotation & translation (getZAngleAndRotate also translates)
    // totalTransX = canX;

    totalTransX = canX;
    totalTransY = canY;
    // totalTransY = canY;
    getZAngleAndRotate1(nosepoint1, centerfacepoint1, canX, canY);
    getYAngleAndRotate(nosepoint1,earpoint21,ZRAngle)
    
    // Resizing
    const dist = calculateFaceSize(points, YRAngle, ZRAngle);

    let resizeMul1 = 2;

    let smoothenSize = smoothResizing(dist * resizeMul1);
    setWristZoom(smoothenSize);
    // setWristZoom(smoothenSize);
    // scaleMul = smoothenSize * 0.5;

    // Use if required
    // const baseNear = jewelType === "bangle" ? 0.093 : 0.0975;
    // cameraNear = baseNear + scaleMul * 0.01;

    // if (jewelType === "bangle" || type === "bangle") {
    //   const baseNear = 0.093;
    //   cameraNear = baseNear + scaleMul * 0.01;
    //   setCameraNearVar(cameraNear);
    // }

    // const baseFar = jewelType === "bangle" || type === "bangle" ? 4.5 : 5.018;
    // cameraFar = baseFar + scaleMul * 0.01;
    // setCameraFarVar(cameraFar);
    //(cameraFar);


    // cameraControls.zoomTo(smoothenSize, false);
    // let transform = 'translate3d(10px, 20px, 0) rotateZ(45deg)';
    // gsplatCanvas.style.transform = transform;

    // if (resize && isArcball)
      // gCamera.position.set(gCamera.position.x, gCamera.position.y, 1 / dist);
  }
  function translateRotateMesh2(points, handLabel, isPalmFacing, sourceImage) {
    if (!points || points.length === 0) {
      return;
    }
    setHandLabels(handLabel);
    let earringPos1 = {
      x: points[177].x,
      y: points[177].y,
      z: points[177].z,
    };
    
    let stayPoint1 = null;
    
    if (points[177] && points[215]) {
      const point177 = {
        x: points[177].x,
        y: points[177].y,
        z: points[177].z,
      };
      const point215 = {
        x: points[215].x,
        y: points[215].y,
        z: points[215].z,
      };
    
      // Calculate the vector between point 401 and 433
      const vector = {
        x: point215.x - point177.x,
        y: point215.y - point177.y,
        z: point215.z - point177.z,
      };
    
      // Determine the desired distance to the right of point 401
      const desiredXDistance = 0.5; // Adjust this value as needed
      const desiredYDistance = 0.05
    
      // Calculate the earring position
      earringPos1 = {
        x: point177.x - vector.x * desiredXDistance*4,
        y: point177.y - vector.y * desiredYDistance,
        z: point177.z,
      };
    
      stayPoint1 = earringPos1;
    }
    
    let nosepoint2 = points[4];
    let centerfacepoint2 = points[9];
    let earpoint12 = points[177];
    let earpoint22 = points[401];
  
    let window_scale, canX, canY;
    let windowWidth = document.documentElement.clientWidth;
    let windowHeight = document.documentElement.clientHeight;
    windowWidth = window.screen.width;
    if (windowWidth / windowHeight > sourceImage.width / sourceImage.height) {
      // Image is taller than the canvas, so we crop top & bottom & scale as per best fit of width
      canX = (1 - stayPoint1.x) * windowWidth - windowWidth / 2;

      // if(window.navigator.userAgent.includes("Firefox")){
      //   window_scale = (windowWidth/sourceImage.width) * 1.75;
      // }
      window_scale = windowWidth / sourceImage.width;
      canY =
        stayPoint1.y * (sourceImage.height * window_scale) -
        (sourceImage.height * window_scale) / 2;
    } else {
        // Image is wider than the canvas, so we crop left & right & scale as per best fit of height
        canY = stayPoint1.y * windowHeight - windowHeight / 2;
        window_scale = windowHeight / sourceImage.height;
        canX =
        stayPoint1.x * (sourceImage.width * window_scale) -
        (sourceImage.width * window_scale) / 2;
        // console.log(window_scale,"window scale",sourceImage.width,"sourceimage width")
        // console.log(canX,"CanX",canY,"canY",stayPoint.x,stayPoint.y,"Staypointsx and y");
    }

    // (window_scale);

    // (sourceImage.height, windowHeight, sourceImage.width, windowWidth ) // Sample: 720 731 1280 1536
    // rotation & translation (getZAngleAndRotate also translates)
    // totalTransX = canX;

    totalTransX = canX;
    totalTransY = canY;
    // totalTransY = canY;
    getZAngleAndRotate2(nosepoint2, centerfacepoint2, canX, canY);
    getYAngleAndRotate(nosepoint2,earpoint22,ZRAngle)
    
    // Resizing
    const dist = calculateFaceSize(points, YRAngle, ZRAngle);

    let resizeMul = 2;

    let smoothenSize = smoothResizing(dist * resizeMul);
    setWristZoom(smoothenSize);
    // setWristZoom(smoothenSize);
    // scaleMul = smoothenSize * 0.5;

    // Use if required
    // const baseNear = jewelType === "bangle" ? 0.093 : 0.0975;
    // cameraNear = baseNear + scaleMul * 0.01;

    // if (jewelType === "bangle" || type === "bangle") {
    //   const baseNear = 0.093;
    //   cameraNear = baseNear + scaleMul * 0.01;
    //   setCameraNearVar(cameraNear);
    // }

    // const baseFar = jewelType === "bangle" || type === "bangle" ? 4.5 : 5.018;
    // cameraFar = baseFar + scaleMul * 0.01;
    // setCameraFarVar(cameraFar);
    //(cameraFar);


    // cameraControls.zoomTo(smoothenSize, false);
    // let transform = 'translate3d(10px, 20px, 0) rotateZ(45deg)';
    // gsplatCanvas.style.transform = transform;

    // if (resize && isArcball)
      // gCamera.position.set(gCamera.position.x, gCamera.position.y, 1 / dist);
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
    convertRingTransRange,
    getYAngleAndRotate,
    getXAngleAndRotate,
    rotateVectorZ,
    getZAngleAndRotate1,
    getZAngleAndRotate2,
    euclideanDistance,
    manhattanDistance,
    calculateFaceSize,
    smoothResizing,
    calculateAngleAtMiddle,
    translateRotateMesh,
    translateRotateMesh2,
  };

  return (
    <GlobalFaceFunctionsContext.Provider value={contextValue}>
      {children}
    </GlobalFaceFunctionsContext.Provider>
  );
};

export const FaceFunctions = () => useContext(GlobalFaceFunctionsContext);
