/**************************************************************************************************************
 * ************************************************************************************************************
 */

const inputVideoElement = document.getElementsByClassName("input_video")[0];
const outputCanvasElement = document.getElementsByClassName("output_canvas")[0];
const canvasCtx = outputCanvasElement.getContext("2d");

const viewSpaceContainer = document.getElementById("viewspacecontainer");
const viewElement = document.getElementById("view");
const getStartedBtn = document.getElementById("getstartedbtn");
const showhandscreen = document.getElementById("showhandscreen");
const updateNote = document.getElementById("updatenote");
const switchbtn = document.getElementById("switchbtn");
const desktopViewAR = document.getElementById("desktop-viewar");
const mobileViewAR = document.getElementById("mobile-viewar");

let width = document.documentElement.clientWidth,
  height = document.documentElement.clientHeight;

width = height;

let timer = 0;
let isResults = false;
// let lastHand = null;
// let lastDetectedTime = null;
let handPresent = false;

function setMeshVisibility() {
  if (isIOS) {
    viewSpaceContainer.style.display = "none";
    showhandscreen.style.display = "flex";
    resetMesh();
    viewSpaceContainer.style.display = "inline-block";
  } else {
    setTimeout(() => {
      if (isResults) {
        if (timer === 4) {
          viewSpaceContainer.style.display = "none";
          showhandscreen.style.display = "flex";
          resetMesh();
          viewSpaceContainer.style.display = "inline-block";
        }
      }
      timer++;
    }, 500);
  }
}

import DeviceDetector from "https://cdn.skypack.dev/device-detector-js@2.2.10";
const mpHands = window;
const drawingUtils = window;
const controls = window;
const noSleep = new NoSleep();

let viewARButton = isMobile || isIOS ? mobileViewAR : desktopViewAR;

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
let fpsControl = null;
if (isIOS) {
  fpsControl = new controls.FPS();
}

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
    // Image is taller than the canvas, so we crop the top and bottom.
    topCrop = (sourceHeight - sourceWidth / canvasAspectRatio) / 2;
    bottomCrop = topCrop;
    // crop = bottomCrop;
  } else {
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
}

function onResults(results) {
  // Update the frame rate.
  if (isIOS) fpsControl.tick();
  // Get the dimensions of the available space for the canvas.
  let canvasWidth = document.documentElement.clientWidth;
  let canvasHeight = document.documentElement.clientHeight;

  // Calculate the aspect ratios of the canvas and the image.
  const canvasAspectRatio = canvasWidth / canvasHeight;

  // Set the canvas size to match the available space.
  outputCanvasElement.width = canvasWidth;
  outputCanvasElement.height = canvasHeight;

  // Save & clear the canvas.
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasWidth, canvasHeight);

  // Draw the cropped/scaled image as per the current canvas aspect ratio
  aspectRatio = canvasAspectRatio;
  cropAndDrawImage(results, canvasAspectRatio, canvasWidth, canvasHeight);

  if (getStartedBtn.disabled) {
    getStartedBtn.disabled = false;
    getStartedBtn.onclick = startSession;
    getStartedBtn.classList.remove("disabledbtn");
    getStartedBtn.innerText = "Get Started";
  }

  if (isVideo) {
    // const currentTime = window.performance.now();
    const handDetected =
      results.multiHandLandmarks && results.multiHandLandmarks.length > 0;
    handLabel = results.multiHandedness.length
      ? results.multiHandedness[0].label
      : null;

    if (handDetected) {
      const indexFingerKnuckle = results.multiHandLandmarks[0][5];
      // const middleFingerKnuckle = results.multiHandLandmarks[0][5];
      const littleFingerKnuckle = results.multiHandLandmarks[0][17];
      const isPalmFacing = indexFingerKnuckle.x < littleFingerKnuckle.x;
      // consider the isPalmFacing with respect to right hand and reverse values will be given for left hand

      // Setting baseTheta for different jewel types
      // TODO: load this from sceneParams file
      baseTheta = THREE.MathUtils.degToRad(rawBaseTheta);
      // console.log("baseTheta", rawBaseTheta);
      if (
        jewelType === "ring" &&
        (!isDirectionalRing || handLabel === "Left")
      ) {
        baseTheta = THREE.MathUtils.degToRad(rawBaseTheta + 180);
      }

      if (
        facingMode === "environment" &&
        jewelType === "ring" &&
        isDirectionalRing
      ) {
        // Back Camera
        baseTheta += THREE.MathUtils.degToRad(180);
      }

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
        cameraControls.azimuthAngle = baseTheta;
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
  }

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
  modelComplexity: 0,
  minDetectionConfidence: 0.7,
  minTrackingConfidence: 0.7,
});

hands.onResults(onResults);

const startCamera = () => {
  // Present a control panel through which the user can manipulate the solution
  // options.
  new controls.ControlPanel(controlsElement).add([
    // new controls.StaticText({ title: "MediaPipe Hands" }),
    fpsControl,
    // new controls.Toggle({ title: "Selfie Mode", field: "selfieMode" }),
    new controls.SourcePicker({
      onFrame: async (input, size) => {
        await hands.send({ image: input });
      },
    }),
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
  ]);
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
  resetMesh();
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

    setupCamera();

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
    applyTransVar();
    resetMesh();

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
    resetTransVar();
    resetRingTrans();
    resetMeshForVR();
    viewSpaceContainer.style.display = "inline-block";
    outputCanvasElement.style.display = "none";
    showhandscreen.style.display = "none";
    usermanual.style.display = "none";
    noSleep.disable();
    updateJewelname();

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
    } else {
      // Exiting from full-screen
    }
    setDims(viewElement, newWidth, newHeight);
  }
});

window.toggleVideo = toggleVideo;
window.switchFacingMode = switchFacingMode;
