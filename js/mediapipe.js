/**************************************************************************************************************
 * ************************************************************************************************************
 */
import DeviceDetector from "https://cdn.skypack.dev/device-detector-js@2.2.10";

const inputVideoElement = document.getElementsByClassName("input_video")[0];
const outputCanvasElement = document.getElementsByClassName("output_canvas")[0];
const canvasCtx = outputCanvasElement.getContext("2d");
const gsplatCanvas = document.getElementById("gsplatCanvas");

const viewSpaceContainer = document.getElementById("viewspacecontainer");
// const viewElement = document.getElementById("view");
const getStartedBtn = document.getElementById("getstartedbtn");
const showhandscreen = document.getElementById("showhandscreen");
const updateNote = document.getElementById("updatenote");
const switchbtn = document.getElementById("switchbtn");
const desktopViewAR = document.getElementById("desktop-viewar");
const mobileViewAR = document.getElementById("mobile-viewar");

let width = document.documentElement.clientWidth,
 height = document.documentElement.clientHeight;

width = height;
/**************************************************************************************************************
 * ************************************************************************************************************
 */
const frameSets = [];
const smoothFrame = [];

/**
 * smoothLandmarks
 * @param {Object} results This should be coming directly from Mediapipe
 * @param {Function} onResults Optional: If you want to call another function instead of getting return
 * @returns {Object}
 */
let frames = [];

// async function delayfunction(n){
//   return new Promise(resolve => setTimeout(resolve,n)); // delay time
// } // function for delay

const referenceLandmarkIndex = 0; // Adjust this index as needed
//old code
// // Function to calculate velocity between two frames
// const calculateVelocity = (currentFrame, previousFrame) => {
//   if (!previousFrame) return 0;
//   const dx = currentFrame.x - previousFrame.x;
//   const dy = currentFrame.y - previousFrame.y;
//   const dz = currentFrame.z - previousFrame.z;
//   return Math.sqrt(dx * dx + dy * dy + dz * dz);
// };

// //dynamic smoothning logic
// const smoothLandmarks = (results, onResults) => {
//   if (results.multiHandLandmarks[0]) {
//     frameSets.push(results.multiHandLandmarks[0]);
//     frames.push(results);
//   }

//   // Calculate velocity based on the movement of the reference landmark
//   let velocity = 0;
//   if (frameSets.length > 1) {
//     const currentFrame = frameSets[frameSets.length - 1][referenceLandmarkIndex];
//     const previousFrame = frameSets[frameSets.length - 2][referenceLandmarkIndex];
//     velocity = calculateVelocity(currentFrame, previousFrame);
//     console.log(velocity);
//   }

//   // Adjust the smoothing based on velocity
//   let smoothingLength = 8; // Default
//   if (velocity > 0.04) { // High velocity threshold
//     smoothingLength = 4;
//   } else if (velocity > 0.015) { // Moderate velocity threshold
//     smoothingLength = 6;
//   }

//   if (frameSets.length >= smoothingLength) {
//     for (let i = 0; i < 21; i++) {
//       let x = frameSets.map((a) => a[i].x).slice(-smoothingLength);
//       let y = frameSets.map((a) => a[i].y).slice(-smoothingLength);
//       let z = frameSets.map((a) => a[i].z).slice(-smoothingLength);
//       let visibility = frameSets.map((a) => a[i].visibility).slice(-smoothingLength);

//       // // Sorting the array into ascending order
//       // x = x.sort((a, b) => a - b);
//       // y = y.sort((a, b) => a - b);
//       // z = z.sort((a, b) => a - b);
//       // visibility = visibility.sort((a, b) => a - b);

//       // // Dropping 2 min and 2 max coordinates
//       // x = x.slice(2, 6);
//       // y = y.slice(2, 6);
//       // z = z.slice(2, 6);
//       // visibility = visibility.slice(2, 6);

//       // Calculate average without sorting and slicing for dropped values
//       smoothFrame[i] = {
//         x: x.reduce((a, b) => a + b, 0) / x.length,
//         y: y.reduce((a, b) => a + b, 0) / y.length,
//         z: z.reduce((a, b) => a + b, 0) / z.length,
//         visibility: visibility.reduce((a, b) => a + b, 0) / visibility.length,
//       };
//     }

//     // Adjust frameSets length based on the current velocity smoothing requirement
//     while (frameSets.length > smoothingLength) {
//       frameSets.shift();
//       frames.shift();
//     }
//   }

//   if (smoothFrame.length > 0) {
//     results.multiHandLandmarks[0] = smoothFrame;
//   }

//   return onResults ? onResults(frames[frames.length - 1]) : frames[frames.length - 1];
// };
//old code



//new code
//pushing for testing
let prevFrame = null; // Store the previous frame for velocity calculation

// Adjust this function to calculate the overall velocity of the hand movement
const calculateVelocity = (currentFrame, previousFrame) => {
  if (!previousFrame) return 0;
  let totalVelocity = 0;
  for (let i = 0; i < currentFrame.length; i++) {
    const dx = currentFrame[i].x - previousFrame[i].x;
    const dy = currentFrame[i].y - previousFrame[i].y;
    const dz = currentFrame[i].z - previousFrame[i].z;
    totalVelocity += Math.sqrt(dx * dx + dy * dy + dz * dz);
  }
  return totalVelocity / currentFrame.length; // Average velocity across all points
};

// Update your existing smoothLandmarks function
const smoothLandmarks = (results, onResults) => {
  if (results.multiHandLandmarks[0]) {
    frameSets.push(results.multiHandLandmarks[0]);
    frames.push(results);
  }

  let velocity = 0;
  if (frameSets.length > 1 && prevFrame) {
    velocity = calculateVelocity(frameSets[frameSets.length - 1], prevFrame);
    console.log('Velocity:', velocity);
  }

  // Adjust the smoothing based on velocity
  let effectiveLength = frameSets.length;
  if(isMobile){
    if(jewelType === "bangle"){
    if (velocity > 0.04) { // High velocity
      effectiveLength = Math.min(effectiveLength, 4);
    } else if (velocity > 0.015) { // Moderate velocity
      effectiveLength = Math.min(effectiveLength, 6);
    }
    else if(velocity <= 0.015){
      effectiveLength = Math.min(effectiveLength, 8);
      }
    }
    else{// for other than bangles
      if (velocity > 0.015) { // Moderate velocity
        effectiveLength = Math.min(effectiveLength, 4);
      }
      else if(velocity <= 0.015){
        effectiveLength = 6;
      }
    }
  }
  else{
  if (velocity > 0.04) { // High velocity
    effectiveLength = Math.min(effectiveLength, 4);
  } else if (velocity > 0.015) { // Moderate velocity
    effectiveLength = Math.min(effectiveLength, 6);
  }
  else if(velocity <= 0.015){
    effectiveLength = 8;
  }
}

  if (effectiveLength >= 4) { // Ensure there's enough data for smoothing
    const smoothedLandmarks = frameSets.slice(-effectiveLength).reduce((acc, frame, _, src) => {
      return frame.map((point, index) => {
        acc[index] = acc[index] || { x: 0, y: 0, z: 0, visibility: 0 };
        acc[index].x += point.x / src.length;
        acc[index].y += point.y / src.length;
        acc[index].z += point.z / src.length;
        acc[index].visibility += point.visibility / src.length;
        return acc[index];
      });
    }, []);

    // Apply the smoothed landmarks to the most recent result
    results.multiHandLandmarks[0] = smoothedLandmarks;
    prevFrame = frameSets[frameSets.length - 1]; // Update prevFrame for the next iteration
  }

  // Keep the buffer size managed
  if (frameSets.length >= 8) {
    frameSets.shift();
    frames.shift();
  }

  return onResults ? onResults(frames[frames.length - 1]) : frames[frames.length - 1];
};
// new code
/**************************************************************************************************************
 * ************************************************************************************************************
 */

let timer = 0;
let isResults = false;
// let lastHand = null;
// let lastDetectedTime = null;
let handPresent = false;

function setMeshVisibility() {
  if (isLoading) return;
  if (isIOS) {
    showhandscreen.style.display = "flex";
    viewSpaceContainer.style.display = "none";
  } else {
    // setTimeout(() => {
    //   if (isResults) {
    //     if (timer === 4) {
    //       showhandscreen.style.display = "flex";
    //       viewSpaceContainer.style.display = "none";
    //     }
    //   }
    //   timer++;
    // }, 500);
    showhandscreen.style.display = "flex";
    viewSpaceContainer.style.display = "none";
  }
}

const mpHands = window;
const drawingUtils = window;
const controls = window;
const noSleep = new NoSleep();

let viewARButton = isMobile || isIOS ? mobileViewAR : desktopViewAR;
console.log(viewARButton)
viewARButton.addEventListener(
  "click",
  function enableNoSleep() {
    document.removeEventListener("click", enableNoSleep, false);
    noSleep.enable();
  },
  false
);

// Usage: testSupport({client?: string, os?: string}[])
// Client and os are regular expressions.
// See: https://cdn.jsdelivr.net/npm/device-detector-js@2.2.10/README.md for
// legal values for client and os
testSupport([{ client: "Chrome" }]);

function testSupport(supportedDevices) {
  const deviceDetector = new DeviceDetector();
  const detectedDevice = deviceDetector.parse(navigator.userAgent);

  let isSupported = false;
  for (const device of supportedDevices) {
    // console.log("device : ", device);
    if (device.client !== undefined) {
      const re = new RegExp(`^${device.client}$`);
      if (!re.test(detectedDevice.client.name)) {
        continue;
      }
    }
    if (device.os !== undefined) {
      const re = new RegExp(`^${device.os}$`);
      if (!re.test(detectedDevice.os.name)) {
        continue;
      }
    }
    isSupported = true;
    break;
  }
  if (!isSupported) {
    console.log(
      `This demo, running on ${detectedDevice.client.name}/${detectedDevice.os.name}, ` +
        `is not well supported at this time, continue at your own risk.`
    );
  }
}

// Our input frames will come from here.
const videoElement = document.getElementsByClassName("input_video")[0];
const controlsElement = document.getElementsByClassName("control-panel")[0];

// We'll add this to our control panel later, but we'll save it here so we can
// call tick() each time the graph runs.
let fpsControl;
if (isIOS) {
  fpsControl = new controls.FPS();
}
console.log(fpsControl);
let frameCount = 0;
function cropAndDrawImage(
  results,
  canvasAspectRatio,
  canvasWidth,
  canvasHeight
) {
  // if (canvasAspectRatio > imageAspectRatio) {
  //   // Image is taller than the canvas so we crop the top and bottom.
  //    Full Image height [0 to h]
  //    Crop_len = (h - (w/canvasAspectRatio)) /2
  //    Cropped image height [0+crop_len, h-crop_len]
  // Else
  //   // Image is wider than the canvas so we crop left and right.
  //    Full Image width [0 to w]
  //    Crop_len = (w - (h*canvasAspectRatio)) /2
  //    Cropped image width [0+crop_len, w-crop_len]

  const sourceImage = results.image;
  const sourceWidth = sourceImage.width;
  const sourceHeight = sourceImage.height;
  const sourceAspectRatio = sourceWidth / sourceHeight;

  let leftCrop = 0;
  let rightCrop = 0;
  let topCrop = 0;
  let bottomCrop = 0;

  if (canvasAspectRatio > sourceAspectRatio) {
    // console.log("taller")
    // Image is taller than the canvas, so we crop the top and bottom.
    topCrop = (sourceHeight - sourceWidth / canvasAspectRatio) / 2;
    bottomCrop = topCrop;
    // crop = bottomCrop;
  } else {
    // console.log("wider")

    // Image is wider than the canvas, so we crop left and right.
    leftCrop = (sourceWidth - sourceHeight * canvasAspectRatio) / 2;
    rightCrop = leftCrop;
    // crop = rightCrop;
  }

  // Calculate the dimensions of the cropped image.
  const croppedWidth = sourceWidth - leftCrop - rightCrop;
  const croppedHeight = sourceHeight - topCrop - bottomCrop;

  // Draw the cropped portion of the image onto the canvas.
  // Ref: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
  // if (frameCount < 4) {
  //   frameCount++; // Increment the frame count
  //   return; // Skip rendering for the first 4 frames
  // }

  canvasCtx.drawImage(
    sourceImage,
    leftCrop,
    topCrop,
    croppedWidth,
    croppedHeight,
    0,
    0,
    canvasWidth,
    canvasHeight
  );
  // if (frameCount === 4) {
  //   frameCount = 0;
  // }
}

const initialX = 0; // Initial estimated value (could be the first detected x-coordinate)
let kalmanX = initialX; // Estimated x-coordinate
let kalmanP = 1; // Estimated error in the x-coordinate
const processNoise = 0.1; // Process noise (adjust as needed)
const measurementNoise = 1; // Measurement noise (adjust as needed)

function kalmanFilter(newX) {
  // Prediction step
  const predictionX = kalmanX;
  const predictionP = kalmanP + processNoise;

  // Update step
  const kalmanGain = predictionP / (predictionP + measurementNoise);
  kalmanX = predictionX + kalmanGain * (newX - predictionX);
  kalmanP = (1 - kalmanGain) * predictionP;

  return kalmanX;
}
// let frameCount = 0; // Add this variable to keep track of the frames

function onResults(results) {
  // if (frameCount < 4) {
  //   frameCount++; // Increment the frame count
  //   return; // Skip rendering for the first 4 frames
  // }
  // Update the frame rate.
  if (isIOS && fpsControl) fpsControl.tick();
  // Get the dimensions of the available space for the canvas.
  let canvasWidth = document.documentElement.clientWidth;
  let canvasHeight = document.documentElement.clientHeight;
  // console.log(canvasWidth,canvasHeight)
  // Calculate the aspect ratios of the canvas and the image.
  const canvasAspectRatio = canvasWidth / canvasHeight;
  // Set the canvas size to match the available space.
  outputCanvasElement.width = canvasWidth;
  outputCanvasElement.height = canvasHeight;

  // console.log(outputCanvasElement.width)
  // console.log(outputCanvasElement.height)
  // console.log(canvasWidth);
  // console.log(canvasHeight);
  // console.log(canvasCtx);
  // Save & clear the canvas.
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasWidth, canvasHeight);

  // Draw the cropped/scaled image as per the current canvas aspect ratio
  aspectRatio = canvasAspectRatio;
  if (results.multiHandLandmarks[0]) {
    // console.log("amenitytech_log_002", results.multiHandLandmarks[0][0]);

    results = smoothLandmarks(results);
    // console.log("amenitytech_log_003 after", results.multiHandLandmarks[0][0]);
  }
  
  cropAndDrawImage(results, canvasAspectRatio, canvasWidth, canvasHeight);
  if (getStartedBtn.disabled) {
    getStartedBtn.disabled = false;
    getStartedBtn.onclick = startSession;
    getStartedBtn.classList.remove("disabledbtn");
    getStartedBtn.innerText = "Get Started";
  }
  
  // await delayfunction(0.1);
  if (isVideo) {
    // const currentTime = window.performance.now();
    const handDetected =
      results.multiHandLandmarks && results.multiHandLandmarks.length > 0;
    handLabel = results.multiHandedness.length
      ? results.multiHandedness[0].label
      : null;
    // console.log("amenity_test_001", results);
    if (handDetected) {
      const indexFingerKnuckle = results.multiHandLandmarks[0][5];
      // const middleFingerKnuckle = results.multiHandLandmarks[0][5];
      const littleFingerKnuckle = results.multiHandLandmarks[0][17];
      const isPalmFacing = indexFingerKnuckle.x < littleFingerKnuckle.x;
      // consider the isPalmFacing with respect to right hand and reverse values will be given for left hand

      // Setting baseTheta for different jewel types
      // TODO: load this from sceneParams file
      // console.log("baseTheta", rawBaseTheta);

      // if (
      //   jewelType === "ring" &&
      //   (!isDirectionalRing || handLabel === "Left")
      // ) {
      //   baseTheta = THREE.MathUtils.degToRad(
      //     THREE.MathUtils.radToDeg(rawBaseTheta) + 180
      //   );
      // }

      // if (
      //   facingMode === "environment" &&
      //   jewelType === "ring" &&
      //   isDirectionalRing
      // ) {
      //   // Back Camera
      //   baseTheta += THREE.MathUtils.degToRad(180);
      // }

      //   // Reversing values to keep the context same because back camera gives reverse values
      //   let isFacingPalm = !isPalmFacing;
      //   handLabel = handLabel === "Right" ? "Left" : "Right";

      //   if (handDetected){
      //     if (jewelType === "bangle") {
      //       // Back Camera
      //       baseTheta += THREE.MathUtils.degToRad(180);
      //     } else {
      //       // rings
      //       let showingPalm =
      //         (handLabel === "Right" && isFacingPalm) ||
      //         (handLabel === "Left" && !isFacingPalm);
      //     }
      //   }
      // }

      if (!handPresent) {
        handPresent = true;
        // cameraControls.azimuthAngle = baseTheta;
      }

      isResults = true;
      timer = 0;
      showhandscreen.style.display = "none";
      viewSpaceContainer.style.display = "inline-block";
      if (!showingJewel) {
          showJewel();
      }
      translateRotateMesh(
        results.multiHandLandmarks[0],
        handLabel,
        isPalmFacing,
        results.image
      );
    } else {
      handPresent = false;
      setMeshVisibility();
    }
    // if (frameCount === 4) {
    //   frameCount = 0;
    // }
  }
  // await delayfunction(100)


  // if (results.multiHandLandmarks && results.multiHandedness) {
  //   for (let index = 0; index < results.multiHandLandmarks.length; index++) {
  //     const classification = results.multiHandedness[index];
  //     const isRightHand = classification.label === "Right";
  //     const landmarks = results.multiHandLandmarks[index];
  //     drawingUtils.drawConnectors(
  //       canvasCtx,
  //       landmarks,
  //       mpHands.HAND_CONNECTIONS,
  //       { color: isRightHand ? "#00FF00" : "#FF0000" }
  //     );
  //     drawingUtils.drawLandmarks(canvasCtx, landmarks, {
  //       color: isRightHand ? "#00FF00" : "#FF0000",
  //       fillColor: isRightHand ? "#FF0000" : "#00FF00",
  //       radius: (data) => {
  //         return drawingUtils.lerp(data?.from?.z, -0.15, 0.1, 10, 1);
  //       },
  //     });
  //   }
  // }
  canvasCtx.restore();
}

const hands = new mpHands.Hands({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands@${mpHands.VERSION}/${file}`;
  },
});

facingMode = sessionStorage.getItem("facingMode") || "user";

hands.setOptions({
  selfieMode: facingMode === "user",
  maxNumHands: 1,
  modelComplexity: 1,
  minDetectionConfidence: 0.7,
  minTrackingConfidence: 0.7,
});

hands.onResults(onResults);

const startCamera = () => {
  // Dynamically construct the array of controls based on conditions
  let controlOptions = [
      // Conditionally add fpsControl if it's initialized
      ...(fpsControl ? [fpsControl] : []),
      new controls.SourcePicker({
          onFrame: async (input, size) => {
              await hands.send({ image: input });
          },
      }),
      // Add other controls here as needed
  ];
  // new controls.Slider({
    //   title: "Max Number of Hands",
    //   field: "maxNumHands",
    //   range: [1, 4],
    //   step: 1,
    // }),
    // new controls.Slider({
    //   title: "Model Complexity",
    //   field: "modelComplexity",
    //   discrete: ["Lite", "Full"],
    // }),
    // new controls.Slider({
    //   title: "Min Detection Confidence",
    //   field: "minDetectionConfidence",
    //   range: [0, 1],
    //   step: 0.01,
    // }),
    // new controls.Slider({
    //   title: "Min Tracking Confidence",
    //   field: "minTrackingConfidence",
    //   range: [0, 1],
    //   step: 0.01,
    // }),

  // Present a control panel through which the user can manipulate the solution options
  new controls.ControlPanel(controlsElement).add(controlOptions);
};


const switchFacingMode = () => {
  if (facingMode === "environment") {
    sessionStorage.setItem("facingMode", "user");
    facingMode = "user";
  } else {
    sessionStorage.setItem("facingMode", "environment");
    facingMode = "environment";
  }

  camera.stop();

  hands.setOptions({
    selfieMode: facingMode === "user",
    maxNumHands: 1,
    modelComplexity: 0,
    minDetectionConfidence: 0.7,
    minTrackingConfidence: 0.7,
  });

  if (!isIOS) {
    camera.h.facingMode = facingMode;
    camera.start();
  }
  resetMeshForAR();
};

const handleMediaCamera = () => {
  let deviceWidth = document.documentElement.clientWidth;
  let deviceHeight = document.documentElement.clientHeight;

  let canvasHeight = deviceHeight;
  let canvasWidth = Math.max(deviceWidth, deviceHeight);

  outputCanvasElement.width = canvasWidth;
  outputCanvasElement.height = canvasHeight;
};

const setupCamera = () => {
  camera = new Camera(inputVideoElement, {
    onFrame: async () => {
      await hands.send({ image: inputVideoElement });
    },
    facingMode,
    width: width,
    height: height,
  });
  
  // clearing previous mediastream if exist before new start
  camera?.g?.getTracks().forEach((track) => {
    track.stop();
  });
};

// Method to toggle a video
async function toggleVideo() {
  if (!isVideo) {
    updateNote.innerText = "Starting video...";
    outputCanvasElement.style.display = "block";
    console.log("Setting up camera");

    setupCamera();
    console.log(controlsElement); // This should show the element, not null

    if (!isIOS) camera?.start();
    else {
      switchbtn.style.display = "none";
      handleMediaCamera();
      startCamera();
    }
    if (!isMobile) {
      switchbtn.style.display = "none";
    }

    isVideo = true;
    showhandscreen.style.display = "flex";
    updateNote.innerText = "Show your hand 👋";
    // applyTransVar();
    resetMeshForAR();

    viewSpaceContainer.style.display = "none";
    // gsplatCanvas.style.background = "transparent";
    viewSpaceContainer.style.background = "transparent";

    let activeElement = document.getElementsByClassName("active-ar-jewel")[0];
    if (activeElement) activeElement.classList.remove("active-ar-jewel");

    let activeJewel = document.getElementById(`${selectedJewel}`);
    if (activeJewel) activeJewel.classList.add("active-ar-jewel");

    const arToogleContainer = document.getElementById("ar-toggle-container");
    arToogleContainer.style.display = "none";

    if (isMobile || isIOS) {
      const arBottomContainer = document.getElementById("ar-bottom-container");
      arBottomContainer.style.display = "none";

      fullscreen();
    }
    // modeButtons.forEach((btn) => {
    //   btn.style.display = "block";
    // });
  } else {
    updateNote.innerText = "Stopping video...";

    if (!isIOS) {
      camera?.stop();
      camera = null;
    } else {
      // stop camera for iOS devices
      camera?.g?.getTracks().forEach((track) => {
        track.stop();
      });
      camera = null;
    }

    isVideo = false;
    // resetTransVar();
    // resetRingTrans();
    resetMeshForVR();
    viewSpaceContainer.style.display = "inline-block";
    // reset bg to jewels default
    let model = sessionStorage.getItem("selectedJewel");
    viewSpaceContainer.style.background = jewelsList[model].lightBackground || defaultLightBg;

    outputCanvasElement.style.display = "none";
    showhandscreen.style.display = "none";
    usermanual.style.display = "none";
    noSleep.disable();

    // gsplatCanvas.style.background = "#eee";
    // viewSpaceContainer.style.background = "#eee";

    const arToogleContainer = document.getElementById("ar-toggle-container");
    arToogleContainer.style.display = "flex";
    if (isMobile || isIOS) {
      const arBottomContainer = document.getElementById("ar-bottom-container");
      arBottomContainer.style.display = "flex";

      fullscreen(false);
    }

    // modeButtons.forEach((btn) => {
    //   btn.style.display = "none";
    // });
  }
}

window.addEventListener("resize", function handleResize(event) {
  if (isMobile || isIOS) {
    let newWidth = document.documentElement.clientWidth;
    let newHeight = document.documentElement.clientHeight;
    if (isVideo && window.innerHeight === screen.height) {
      // Going full-screen
      console.log("Going full-screen");
    } else {
      // Exiting from full-screen
      console.log("Exiting from full-screen");
    }
    setDims(viewSpaceContainer, newWidth, newHeight);
    setDims(glamCanvas, newWidth, newHeight);
  }
});

window.toggleVideo = toggleVideo;
window.switchFacingMode = switchFacingMode;
