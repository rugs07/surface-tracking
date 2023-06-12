/**************************************************************************************************************
 * ************************************************************************************************************
 */

const inputVideoElement = document.getElementsByClassName("input_video")[0];
const outputCanvasElement = document.getElementsByClassName("output_canvas")[0];
const canvasCtx = outputCanvasElement.getContext("2d");

const viewSpaceContainer = document.getElementById("viewspacecontainer");
// const viewElement = document.getElementById("view");
const showhandscreen = document.getElementById("showhandscreen");
const updateNote = document.getElementById("updatenote");
const switchbtn = document.getElementById("switchbtn");
const desktopViewAR = document.getElementById("desktop-viewar");
const mobileViewAR = document.getElementById("mobile-viewar");

isMobile = mobileAndTabletCheck();
console.log("isMobile", isMobile);
isIOS = iOSCheck();
console.log("isIOS", isIOS);

if (!isMobile) facingMode = "user";

function iOSCheck() {
  return (
    [
      "iPad Simulator",
      "iPhone Simulator",
      "iPod Simulator",
      "iPad",
      "iPhone",
      "iPod",
    ].includes(navigator.platform) ||
    // iPad on iOS 13 detection
    (navigator.userAgent.includes("Mac") && "ontouchend" in document)
  );
}

let width = 1280,
  height = 720,
  offset = 0,
  smwidth = 0;

if (isMobile) {
  width = (window.innerHeight * 110) / 100;
  smwidth = (window.innerWidth * 99) / 100;
  height = (window.innerHeight * 110) / 100;
  offset = (width - window.innerWidth) / 2;
}
// const aspect = 720 / 1280;
// if (window.innerWidth > window.innerHeight) {
//   height = window.innerHeight;
//   width = height / aspect;
// } else {
//   width = window.innerWidth;
//   height = width * aspect;
// }
if (!isIOS) {
  outputCanvasElement.width = width;
  outputCanvasElement.height = height;
}
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
    viewSpaceContainer.style.display = "block";
  } else {
    setTimeout(() => {
      if (isResults) {
        if (timer === 4) {
          viewSpaceContainer.style.display = "none";
          showhandscreen.style.display = "flex";
          resetMesh();
          viewSpaceContainer.style.display = "block";
        }
      }
      timer++;
    }, 500);
  }
}

// if (isPalmFacing && !wasPalmFacing) {
//   baseTheta += THREE.MathUtils.degToRad(180);
//   cameraControls.azimuthAngle = baseTheta;
// } else if (!isPalmFacing && wasPalmFacing) {
//   baseTheta -= THREE.MathUtils.degToRad(180);
//   cameraControls.azimuthAngle = baseTheta;
// }

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

function onResults(results) {
  // Update the frame rate.
  if (isIOS) fpsControl.tick();

  // Draw the overlays.
  canvasCtx.save();
  canvasCtx.clearRect(
    0,
    0,
    outputCanvasElement.width,
    outputCanvasElement.height
  );
  canvasCtx.drawImage(
    results.image,
    0,
    0,
    outputCanvasElement.width,
    outputCanvasElement.height
  );

  // const currentTime = window.performance.now();
  if (isVideo) {
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
      console.log("baseTheta", rawBaseTheta);
      if (jewelType === "ring" && handLabel === "Left") {
        baseTheta = THREE.MathUtils.degToRad(rawBaseTheta + 180);
      }

      if (facingMode === "environment" && jewelType === "ring") {
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
      translateRotateMesh(
        results.multiHandLandmarks[0],
        handLabel,
        isPalmFacing
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

hands.setOptions({
  selfieMode: true,
  maxNumHands: 1,
  modelComplexity: 0,
  minDetectionConfidence: 0.7,
  minTrackingConfidence: 0.7,
});

hands.onResults(onResults);

if (!isIOS) {
  camera = new Camera(inputVideoElement, {
    onFrame: async () => {
      await hands.send({ image: inputVideoElement });
    },
    facingMode,
    width: width,
    height: height,
  });
}

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
  if (facingMode === "environment") facingMode = "user";
  else facingMode = "environment";

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
};

const handleMediaCamera = () => {
  const aspect = 960 / 720;
  let width, height;

  height = (window.innerHeight * 110) / 100;
  width = height / aspect;

  outputCanvasElement.width = width;
  outputCanvasElement.height = height;
};

// Method to toggle a video
async function toggleVideo() {
  if (!isVideo) {
    updateNote.innerText = "Starting video...";

    outputCanvasElement.style.display = "block";
    if (!isIOS) camera.start();
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
    // trackButton.innerText = "Stop AR";
    applyTransVar();

    const arToogleContainer = document.getElementById("ar-toggle-container");
    arToogleContainer.style.display = "none";

    if (isMobile || isIOS) {
      const arBottomContainer = document.getElementById("ar-bottom-container");
      arBottomContainer.style.display = "none";

      if (isMobile && !isIOS) {
        setDims(viewSpaceContainer, smwidth, height);
        // setDims(view, width, height);
        outputCanvasElement.style.setProperty("left", `-${offset}px`);
      }

      fullscreen();
    }
    // modeButtons.forEach((btn) => {
    //   btn.style.display = "block";
    // });
  } else {
    updateNote.innerText = "Stopping video...";

    if (!isIOS) camera.stop();
    isVideo = false;
    resetTransVar();
    resetRingTrans();
    viewSpaceContainer.style.display = "inline-block";
    outputCanvasElement.style.display = "none";
    showhandscreen.style.display = "none";
    usermanual.style.display = "none";
    noSleep.disable();

    updateNote.innerText = "Welcome to jAR4U";

    // trackButton.innerText = "View AR";

    const arToogleContainer = document.getElementById("ar-toggle-container");
    arToogleContainer.style.display = "flex";
    if (isMobile || isIOS) {
      const arBottomContainer = document.getElementById("ar-bottom-container");
      arBottomContainer.style.display = "flex";

      if (isMobile && !isIOS) {
        setDims(viewSpaceContainer, smwidth, height);
        // setDims(view, smwidth, height);
        outputCanvasElement.style.setProperty("left", `0px`);
      }

      fullscreen(false);
    }

    // modeButtons.forEach((btn) => {
    //   btn.style.display = "none";
    // });
  }

  if (isArcball) {
    arcballControls.setTarget(0.0, 0.0, 0.0);
  } else {
    resetMesh();
  }
}

window.addEventListener("resize", function handleResize(event) {
  if (window.innerHeight !== screen.height) {
    if (isVideo) toggleVideo();
  }
});

window.toggleVideo = toggleVideo;
window.switchFacingMode = switchFacingMode;
