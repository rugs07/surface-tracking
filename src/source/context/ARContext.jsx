// GlobalFunctionsContext.js
import * as THREE from "three";
import React, { createContext, useContext, useEffect, useState } from "react";
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
  console.log(enableSmoothing, "arcontext enable smoothing ");
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


    window.innerWidth < 768 ? YRAngle = -angle : YRAngle = angle
    // YRAngle = -angle;

    if (
      (GlobalHandLabel == "Right" && facingMode !== "environment") ||
      (GlobalHandLabel == "Left" && facingMode === "environment")
    ) {
      YRDelta = THREE.MathUtils.degToRad(90 - YRAngle);
    } else {
      YRDelta = THREE.MathUtils.degToRad(-90 - YRAngle);
    }

    setYRDelta(-YRDelta);
    console.log(handType, 'hand type');
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
    canX, canY, "canxandy";
    let canP = 0;
    // cameraControls.setFocalOffset(canX, canY, 0.0, false);
    let adjustmentFactor = window.innerWidth * 0.5;
    angle = angle;
    let transform = null;
    if (!translation) transform = "rotateZ(" + angle + "deg)";
    else canP = canX - adjustmentFactor;
    const angless = window.innerWidth < 768 ? -angle : angle
    transform =
      "translate3d(" +
      canX +
      "px, " +
      canY +
      "px, " +
      0 +
      "px) rotateZ(" +
      angless +
      "deg)";
    transform, "can's";
    gsplatCanvas.style.transform = transform;

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

  function getZAngleAndRotate(wrist, newMidRef, canX, canY) {
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

      if (isMobile || isIOS) {
        if (jewelType === "bangle" || type === "bangle") normZAngle *= 1;
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
    let jewel = sessionStorage.getItem("selectedJewel")
    type = JSON.parse(jewel).type
    if (jewelType === "bangle" || type === "bangle") {
      console.log(type, "getnomalised");
      newMin = 0.44;
      newMax = 0.56;
    }
    else if (jewelType === "bangle" && type === "ring") {
      console.log(type, "else of get normalised");
      newMin = 0.435;
      newMax = 0.525;
    }

    else if (jewelType === "ring" || type === "ring") {
      console.log(type, "else of get normalised");
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

  function calculateWristSize(points, YRAngle, ZRAngle, foldedHand) {
    // calculate wrist size as distance between wrist and first knuckle and distance between thumb knuckle and pinky knuckle on first frame and then adjust for scale using wrist.z value
    // let wristSize = manhattanDistance(points[0], points[5]);
    // wristSize += manhattanDistance(points[9], points[17]);
    // wristSize /= 2;

    let wristSize = euclideanDistance(points[0], points[9]);
    //(wristSize, 'wristSize');
    // if (diff <= 0.1) {
    //     const newSize = kfResize.filter(wristSize);
    //     ("origsize", wristSize, "filtered", newSize);
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
  }

  let lastSize = null;
  mapRange;
  function smoothResizing(wristSize) {
    console.log(GlobalHandLabel, "smooth resizing");
    if (enableSmoothing) {
      let diff = 0;
      if (lastSize !== null) {
        diff = wristSize - lastSize;

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
          wristSize = lastSize + smoothDiff;
        }
      }
      lastSize = wristSize;
    } else {
      lastSize = wristSize;
    }
    return wristSize;
  }

  function translateRotateMesh(points, handLabel, isPalmFacing, sourceImage) {
    GlobalHandLabel = handLabel;
    setHandType(handLabel)
    let obj1 = { value: handLabel }
    var typehand = handLabel;
    console.log(typehand,);
    let jewel = sessionStorage.getItem("selectedJewel")
    type = JSON.parse(jewel).type
    console.log(JSON.parse(jewel).type);
    jewelType === type;
    if (!points || points.length === 0) {
      return;
    }
    setHandLabels(handLabel);
    console.log(type == jewelType, 'ar context');
    console.log(jewelType, 'arcontext jewel type');
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

    let stayPoint = null;
    console.log(type, "tsm check");
    if (verticalRotation) {
      // setJewelType(type);

      console.log(jewelType == type, "check");
      if (type === "bangle") {
        if (handLabel === "Left") {
          stayPoint = {
            x: wrist.x - 0.01,
            y: wrist.y + 1.035,
            z: wrist.z,
          };
        } else if (handLabel === "Right") {
          stayPoint = {
            x: wrist.x,
            y: wrist.y + 100.035,
            z: wrist.z,
          };
        }
      }
      else {
        stayPoint = ringPos;
      }
      // else if (jewelType === "bangle" && type === 'ring') {
      //   stayPoint = ringPos;
      // }
      // else if (jewelType === "ring" || type === "ring") {
      //   stayPoint = ringPos;
      // }

    }

    if (horizontalRotation) {
      if (type === "bangle") {
        if (handLabel === "Left") {
          stayPoint = {
            x: wrist.x - 0.015,
            y: wrist.y,
            z: wrist.z,
          };
        } else if (handLabel === "Right") {
          stayPoint = {
            x: wrist.x + 0.015,
            y: wrist.y,
            z: wrist.z,
          };
        }
      }
      else {
        stayPoint = ringPos;
      }

      // else if (jewelType === "bangle" && type === "ring") {
      //   stayPoint = ringPos;
      // }
      // else if (jewelType === "bangle" ? type === "ring" : "bangle" || type === "ring") {
      //   stayPoint = ringPos;
      // }



      setHandPointsX(stayPoint.x);
      setHandPointsY(stayPoint.y);
      setHandPointsZ(stayPoint.z);
    }
    // (stayPoint);

    let foldedHand = calculateAngleAtMiddle(wrist, midKnuckle, midTop);
    // (foldedHand); // check foldedhand value
    //backhand open - 17, backhand closed - (0-1), fronthand open - (16-17) , fronthand closed = (4-7)

    let window_scale, canX, canY;
    let windowWidth = document.documentElement.clientWidth;
    let windowHeight = document.documentElement.clientHeight;
    windowWidth = window.screen.width;
    "SourceImage height : ", sourceImage.height;
    "SourceImage width : ", sourceImage.width;
    //old code

    windowWidth, stayPoint.x, "win height";
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
    }

    // (window_scale);

    // (sourceImage.height, windowHeight, sourceImage.width, windowWidth ) // Sample: 720 731 1280 1536
    // rotation & translation (getZAngleAndRotate also translates)
    // totalTransX = canX;

    totalTransX = canX;
    totalTransY = canY;
    // totalTransY = canY;
    if (jewelType === "bangle" || type === "bangle") {
      console.log(type, 'file checks');
      getZAngleAndRotate(wrist, midPip, canX, canY);
      getXAngleAndRotate(wrist, midPip, ZRAngle);
      getYAngleAndRotate(firstKnuckle, pinkyKnuckle, ZRAngle);
      console.log(handLabel, "tsm function");
    }
    else if (jewelType === "bangle" && type === "ring") {
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
    }
    else if (jewelType === "ring" || type === "ring") {
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
    // (isPalmFacing);
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

    let scaleAdjustment = calculateScaleAdjustment(foldedHand, isPalmFacing);

    if (jewelType === "bangle" || type === "bangle") {
      //previous code
      console.log(type, "sscale adjustment low");
      if (isMobile || isIOS) {
        resizeMul = window_scale * 3.0 * scaleAdjustment;
        if (
          (handLabel === "Right") ||
          (handLabel === "Left")
        ) {
          resizeMul *= 0.925;
        }
      } else {
        resizeMul = window_scale * 1.5 * scaleAdjustment;
      }

      // if (selectedJewel !== "flowerbangle") resizeMul *= 1.25;
    }
    else if (jewelType === "bangle" && type === "ring") {
      let visibilityFactor =
        (handLabel === "Right" && !isPalmFacing) ||
          (handLabel === "Left" && isPalmFacing)
          ? 1.0
          : 0.9;
      if (isMobile || isIOS) {
        resizeMul = window_scale * 1.2 * scaleAdjustment * visibilityFactor;
        // if (isPalmFacing) resizeMul *= 0.9;
      } else
        resizeMul = window_scale * 0.75 * scaleAdjustment * visibilityFactor;

      if (selectedJewel === "floralring") {
        resizeMul *= 0.9;
      }
    }
    else if (jewelType === "ring" || type === "ring") {
      let visibilityFactor =
        (handLabel === "Right" && !isPalmFacing) ||
          (handLabel === "Left" && isPalmFacing)
          ? 1.0
          : 0.9;
      if (isMobile || isIOS) {
        resizeMul = window_scale * 1.2 * scaleAdjustment * visibilityFactor;
        // if (isPalmFacing) resizeMul *= 0.9;
      } else
        resizeMul = window_scale * 0.75 * scaleAdjustment * visibilityFactor;

      if (selectedJewel === "floralring") {
        resizeMul *= 0.9;
      }
    }

    let smoothenSize = smoothResizing(dist * resizeMul);
    setWristZoom(smoothenSize);
    // scaleMul = smoothenSize * 0.5;

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

    if (resize && isArcball)
      gCamera.position.set(gCamera.position.x, gCamera.position.y, 1 / dist);
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
    calculateWristSize,
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
