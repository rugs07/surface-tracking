// GlobalFunctionsContext.js
import * as THREE from "three";
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useVariables } from "./variableContext";

const GlobalFunctionsContext = createContext();
let GlobalHandLabel;
export const GlobalFunctionsProvider = ({ children }) => {
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
  const lastStableSizeRef = useRef(null);
  const [isHandStable, setIsHandStable] = useState(true);
  const foldHistoryRef = useRef([]);
  const selectedJewel = useMemo(() => JSON.parse(
    sessionStorage.getItem("selectedJewel") || "{}"
  ), []);

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
    // selectedJewel,
    scaleMul,
    cameraNear,
    cameraFar,
    resize,
    isArcball,
    setCameraFarVar,
    setJewelType,
    setCameraNearVar,
  } = useVariables();
  // console.log(enableSmoothing, "arcontext enable smoothing ");
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

    // console.log(selectedJewel.type, "fhjksdhfjksd");

    // if (selectedJewel.type === "ring") {

    //   // YRAngle = angle
    //   window.innerWidth < 768 ? YRAngle = angle : YRAngle = -angle
    // } else {
    //   // YRAngle = -angle
    //   window.innerWidth < 768 ? YRAngle = -angle : YRAngle = angle

    // }

    YRAngle = angle


    if (
      (GlobalHandLabel == "Right" && facingMode !== "environment") ||
      (GlobalHandLabel == "Left" && facingMode === "environment")
    ) {
      YRDelta = THREE.MathUtils.degToRad(90 - YRAngle);
    } else {
      YRDelta = THREE.MathUtils.degToRad(-70 - YRAngle);
    }

    setYRDelta(YRDelta);
    // console.log(handType, 'hand type');
    console.log(YRAngle, "yeangle");
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

  function rotateZ(angle, canX, canY) {
    // canX, canY, "canxandy";
    let canPX = canX;
    let canPY = canY;

    // cameraControls.setFocalOffset(canX, canY, 0.0, false);
    let adjustmentFactorX = window.innerWidth * 0.5;
    let adjustmentFactorY = window.innerHeight * 0.5;
    // canPX = canX - adjustmentFactor;
    // angle = -angle;
    let transform = null;
    // const angless = window.innerWidth < 768 ? -angle : angle
    if (!translation) transform = "rotateZ(" + angle + "deg)";
    else {
      canPX += adjustmentFactorX;
      canPY -= adjustmentFactorY;
      transform =
        "translate3d(" +
        -canPX +
        "px, " +
        canPY +
        "px, " +
        0 +
        "px) rotateZ(" +
        -angle +
        "deg)";
    }
    // transform, "can's";
    console.log(canPX, "canPX", canX, "canX");
    gsplatCanvas.style.transform = transform;

    ZRAngle = angle;
    XTrans = -canPX;
    YTrans = canPY;
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

  function getZAngleAndRotate(wrist, newMidRef, canX, canY, sourceVideoRatioWH) {
    wrist = normalizePoints(wrist, sourceVideoRatioWH)
    newMidRef = normalizePoints(newMidRef, sourceVideoRatioWH)
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

      rotateZ(normZAngle, canX, canY);
      console.log(normZAngle, "ZZZZ");
    }

    lastMidRef = newMidRef;
  }

  function getNormalizedXTSub(value) {
    // define the old and new ranges
    const oldMin = 0;
    const oldMax = 1;
    let newMin, newMax;
    let jewel = sessionStorage.getItem("selectedJewel")
    type = JSON.parse(jewel).type
    if (jewelType === "bangle" || type === "bangle") {
      // console.log(type, "getnomalised");
      newMin = 0.44;
      newMax = 0.56;
    }
    else if (jewelType === "bangle" && type === "ring") {
      // console.log(type, "else of get normalised");
      newMin = 0.435;
      newMax = 0.525;
    }

    else if (jewelType === "ring" || type === "ring") {
      // console.log(type, "else of get normalised");
      newMin = 0.435;
      newMax = 0.525;
    }


    const normalizedValue =
      ((value - oldMin) / (oldMax - oldMin)) * (newMax - newMin) + newMin;

    return normalizedValue;
  }

  function getNormalizedYTSub(value) {
    const oldMin = 0;
    const oldMax = 1;
    let newMin = 0.4;
    let newMax = 0.55;

    const normalizedValue =
      ((value - oldMin) / (oldMax - oldMin)) * (newMax - newMin) + newMin;

    return normalizedValue;
  }

  function euclideanDistance(a, b) {
    return Math.sqrt(
      Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2) + Math.pow(a.z - b.z, 2)
    );
  }

  function manhattanDistance(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y) + Math.abs(a.z - b.z);
  }

  function normalizePoint(point, sourceVideoRatioWH) {
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

  function calculateSize(points, YRAngle, ZRAngle, sourceVideoRatioWH = 1) {
    let normalizedPoints = normalizePoints(points, sourceVideoRatioWH);
    let objSize;
    if (jewelType === "bangle" || type === "bangle")
      objSize = euclideanDistance(normalizedPoints[0], normalizedPoints[9]);
    else
      objSize = euclideanDistance(normalizedPoints[13], normalizedPoints[14]) * 0.53;
    // console.log("OSize ", objSize, euclideanDistance(points[0], points[9]), 
    //                       euclideanDistance(normalizedPoints[0], normalizedPoints[9]));
    return objSize;
  }

  // function isHandFoldingStable(foldedHand) {
  //   foldHistoryRef.current.push(foldedHand);
  //   if (foldHistoryRef.current.length > 10) {
  //     foldHistoryRef.current.shift();
  //   }

  //   const avgFold = foldHistoryRef.current.reduce((a, b) => a + b, 0) / foldHistoryRef.current.length;
  //   const stableThreshold = 2; // Adjust this value as needed

  //   return Math.abs(foldedHand - avgFold) < stableThreshold;
  // }

  // let lastStableSize = null;
  let lastSize = null;
  let prevSize = null; // Store the previous frame for velocity calculation
  let sizeArray = []; // Stores multiple frames for smoothing
  // Function to smooth hand landmarks

  const smoothResizing = (size, jewelType = "bangle", isMobile = false) => {
    sizeArray.push(size);
    let velocity = 0;
    if (sizeArray.length > 1 && prevSize) {
      velocity = Math.abs(sizeArray[sizeArray.length - 1] - prevSize);
    }

    console.log(velocity, "velocity ");


    let effectiveLength = sizeArray.length;
    // if (isMobile) {
    //   if (jewelType === "bangle") {
    //     if (velocity > 0.04) {
    //       effectiveLength = Math.min(effectiveLength, 4);
    //     } else if (velocity > 0.015) {
    //       effectiveLength = Math.min(effectiveLength, 6);
    //     } else {
    //       effectiveLength = Math.min(effectiveLength, 8);
    //     }
    //   } else {
    //     if (velocity > 0.015) {
    //       effectiveLength = Math.min(effectiveLength, 4);
    //     } else {
    //       effectiveLength = 6;
    //     }
    //   }
    // } else {
      if (velocity > 0.04) {
        effectiveLength = Math.min(effectiveLength, 4);
      } else if (velocity > 0.015) {
        effectiveLength = Math.min(effectiveLength, 6);
      } else {
        effectiveLength = 8;
      }
    // }
    console.log(effectiveLength, "length");



    if (effectiveLength >= 4) {
      const smoothedSize = sizeArray.slice(-effectiveLength).reduce((acc, value) => acc + value, 0) / effectiveLength;
      size = smoothedSize;
    };

    prevSize = sizeArray[sizeArray.length - 1];

    if (sizeArray.length >= 8) {
      sizeArray.shift();
    }

    return size;


  };
  //   function smoothResizing(wristSize) {
  //     // if (enableSmoothing) {
  //     //   if (lastSize !== null) {
  //     //     const smoothingFactor = 0.1; // Reduce this value for more stability
  //     //     wristSize = lastSize * (1 - smoothingFactor) + wristSize * smoothingFactor;
  //     //   }
  //     //   lastSize = wristSize;
  //     // } else {
  //     //   lastSize = wristSize;
  //     // }
  //     return wristSize;
  //   }



  function translateRotateMesh(points, handLabel, isPalmFacing, sourcevideowidth, sourcevideoheight) {
    GlobalHandLabel = handLabel;
    setHandType(handLabel)
    let jewel = sessionStorage.getItem("selectedJewel")
    type = JSON.parse(jewel).type
    jewelType === type;
    if (!points || points.length === 0) {
      return;
    }
    setHandLabels(handLabel);
    // console.log(type == jewelType, 'ar context');
    // console.log(jewelType, 'arcontext jewel type');
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
      x: points[13].x * 0.32 + points[14].x * 0.68,
      y: points[13].y * 0.32 + points[14].y * 0.68,
      z: points[13].z * 0.32 + points[14].z * 0.68,
    };

    let stayPoint = null;
    console.log(type, "tsm check");

    if (type === "bangle") {
      stayPoint = wrist;
    }
    else {
      stayPoint = ringPos;
    }

    setHandPointsX(stayPoint.x);
    setHandPointsY(stayPoint.y);
    setHandPointsZ(stayPoint.z);
    // (stayPoint);

    // let foldedHand = calculateAngleAtMiddle(wrist, midKnuckle, midTop);
    // (foldedHand); // check foldedhand value
    //backhand open - 17, backhand closed - (0-1), fronthand open - (16-17) , fronthand closed = (4-7)

    let window_scale, canX, canY;
    let windowWidth = document.documentElement.clientWidth;
    let windowHeight = document.documentElement.clientHeight;
    let sourceVideoRatioWH = sourcevideowidth / sourcevideoheight;

    // windowWidth = window.screen.width;
    if (windowWidth / windowHeight > sourceVideoRatioWH) {
      // Image is taller than the canvas, so we crop top & bottom & scale as per best fit of width
      canX = stayPoint.x * windowWidth - windowWidth / 2;
      // if(window.navigator.userAgent.includes("Firefox")){
      //   window_scale = (windowWidth/sourcevideowidth) * 1.75;
      // }
      window_scale = windowWidth / sourcevideowidth;
      canY =
        stayPoint.y * (sourcevideoheight * window_scale) -
        (sourcevideoheight * window_scale) / 2;
    } else {
      // Image is wider than the canvas, so we crop left & right & scale as per best fit of height
      canY = stayPoint.y * windowHeight - windowHeight / 2;
      window_scale = windowHeight / sourcevideoheight;
      canX =
        stayPoint.x * (sourcevideowidth * window_scale) -
        (sourcevideowidth * window_scale) / 2;
    }

    // (window_scale);

    //Make width, height of canvas double
    if (!(gsplatCanvas.width && gsplatCanvas.height)) {
      console.log("Cvs Def", gsplatCanvas.width, gsplatCanvas.height);
      gsplatCanvas.width = 2 * windowWidth;
      gsplatCanvas.height = 2 * windowHeight;
      console.log("Cvs Double", gsplatCanvas.width, gsplatCanvas.height);
    }

    // (sourcevideoheight, windowHeight, sourcevideowidth, windowWidth ) // Sample: 720 731 1280 1536
    // rotation & translation (getZAngleAndRotate also translates)
    // totalTransX = canX;

    totalTransX = canX;
    totalTransY = canY;
    // totalTransY = canY;
    if (jewelType === "bangle" || type === "bangle") {
      // console.log(type, 'file checks');
      getZAngleAndRotate(wrist, midPip, canX, canY, sourceVideoRatioWH);
      getXAngleAndRotate(wrist, midPip, ZRAngle);
      getYAngleAndRotate(firstKnuckle, pinkyKnuckle, ZRAngle);
      // console.log(handLabel, "tsm function");
    }
    else if (jewelType === "bangle" && type === "ring") {
      if (isDirectionalRing) {
        getZAngleAndRotate(points[13], points[14], canX, canY, sourceVideoRatioWH);
        getXAngleAndRotate(points[13], points[14], ZRAngle);
      } else {
        if (
          (handLabel === "Right" && facingMode !== "environment") ||
          (handLabel === "Left" && facingMode === "environment")
        ) {
          getZAngleAndRotate(points[14], points[13], canX, canY, sourceVideoRatioWH);
          getXAngleAndRotate(points[14], points[13], ZRAngle);
        } else {
          getZAngleAndRotate(points[13], points[14], canX, canY, sourceVideoRatioWH);
          getXAngleAndRotate(points[13], points[14], ZRAngle);
        }
      }
    }
    else if (jewelType === "ring" || type === "ring") {
      if (isDirectionalRing) {
        getZAngleAndRotate(points[13], points[14], canX, canY, sourceVideoRatioWH);
        getXAngleAndRotate(points[13], points[14], ZRAngle);
      } else {
        if (
          (handLabel === "Right" && facingMode !== "environment") ||
          (handLabel === "Left" && facingMode === "environment")
        ) {
          getZAngleAndRotate(points[14], points[13], canX, canY, sourceVideoRatioWH);
          getXAngleAndRotate(points[14], points[13], ZRAngle);
        } else {
          getZAngleAndRotate(points[13], points[14], canX, canY, sourceVideoRatioWH);
          getXAngleAndRotate(points[13], points[14], ZRAngle);
        }
      }

      getYAngleAndRotate(firstKnuckle, pinkyKnuckle, ZRAngle);
    }


    // Resizing
    let dist = calculateSize(points, YRAngle, ZRAngle, sourceVideoRatioWH);

    // Size stabilization
    // const stabilityFactor = 0.95;
    // if (lastStableSizeRef.current === null) {
    //   lastStableSizeRef.current = dist;
    // } else {
    //   dist = lastStableSizeRef.current * stabilityFactor + dist * (1 - stabilityFactor);
    //   lastStableSizeRef.current = dist;
    // }

    // let baseSize = (jewelType === "bangle" || type === "bangle") ? 1.0 : 0.25;
    let baseSize = 1.75

    let resizeMul = window_scale * baseSize;
    if (selectedJewel.label === "floralring") {
      resizeMul *= 0.9;
    }

    // Smoothening size transition
    let smoothenSize = smoothResizing(dist * resizeMul);
    // let smoothenSize = dist * resizeMul;
    setWristZoom(smoothenSize);
    // scaleMul = smoothenSize * 0.5;

    // const handStable = isHandFoldingStable(foldedHand);
    // if (handStable !== isHandStable) {
    //   setIsHandStable(handStable);
    //   if (handStable) {
    //     lastStableSizeRef.current = null; // Reset stable size when hand becomes stable
    //   }
    // }

    // Apply additional stability for mobile devices
    // if (isMobile || isIOS) {
    //   const stabilityFactor = isHandStable ? 0.95 : 0.7;
    //   dist = lastStableSizeRef.current * stabilityFactor + dist * (1 - stabilityFactor);
    // }

    // function calculateScaleAdjustment(foldedHand, isPalmFacing) {
    //   let scaleAdjustment = 1.0;
    //   let scaleAdjustment = 1.0;
    //   const openHandThreshold = 16;
    //   const closedHandThreshold = 7;

    //   if (foldedHand < closedHandThreshold) {
    //     // Hand is very closed
    //     scaleAdjustment = isPalmFacing ? 0.8 : 0.9;
    //   } else if (foldedHand < openHandThreshold) {
    //     // Hand is partially closed
    //     scaleAdjustment = isPalmFacing ? 0.9 : 1.0;
    //   }
    //   // For open hand, scaleAdjustment remains 1.0

    //   return 1.0;


    //   // Define thresholds based on the observed folded hand angles
    //   const openHandThreshold = 16; // Average between backhand and fronthand open
    //   const closedHandThreshold = { backhand: 1, fronthand: 1 }; // Average for closed hand states

    //   // Adjust scale based on the folded hand angle and device type
    //   if (

    //     foldedHand
    //   ) {
    //     // Hand is partially closed or in a natural state
    //     if (isMobile || isIOS) {
    //       scaleAdjustment = isPalmFacing ? 1.0 : 1.0; // Slightly larger adjustment for mobile devices
    //     } else {
    //       scaleAdjustment = isPalmFacing ? 1.0 : 1.0; // Smaller adjustment for laptops/desktops
    //     }
    //   } else {
    //     // Hand is very closed
    //     scaleAdjustment = isPalmFacing ? 1.0 : 1.0; // Minor adjustment unless palm is facing, then no change
    //   }

    //   // No adjustment needed for fully open hand beyond openHandThreshold
    //   // as scaleAdjustment remains 1.0

    //   return 1.0;
    // }

    // let scaleAdjustment = calculateScaleAdjustment(foldedHand, isPalmFacing);


    // Use if required
    // const baseNear = jewelType === "bangle" ? 0.093 : 0.0975;
    // cameraNear = baseNear + scaleMul * 0.01;

    if (jewelType === "bangle" || type === "bangle") {
      const baseNear = 0.093;
      cameraNear = baseNear + scaleMul * 0.01;
      setCameraNearVar(cameraNear);
    }

    const baseFar = jewelType === "bangle" || type === "bangle" ? 4.5 : 5.018;
    cameraFar = baseFar + scaleMul * 0.01;
    setCameraFarVar(cameraFar);
    //(cameraFar);

    // (cameraFar);
    // (cameraNear);
    // (scaleMul)

    // cameraControls.zoomTo(smoothenSize, false);
    // let transform = 'translate3d(10px, 20px, 0) rotateZ(45deg)';
    // gsplatCanvas.style.transform = transform;

    // if (resize && isArcball)
    //   gCamera.position.set(gCamera.position.x, gCamera.position.y, 1 / dist);
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
    rotateZ,
    mapRange,
    convertRingTransRange,
    getYAngleAndRotate,
    getXAngleAndRotate,
    rotateVectorZ,
    getZAngleAndRotate,
    getNormalizedXTSub,
    getNormalizedYTSub,
    euclideanDistance,
    manhattanDistance,
    calculateSize,
    smoothResizing,
    calculateAngleAtMiddle,
    translateRotateMesh,
  };

  return (
    <GlobalFunctionsContext.Provider value={contextValue}>
      {children}
    </GlobalFunctionsContext.Provider>
  );
};

export const ARFunctions = () => useContext(GlobalFunctionsContext);
