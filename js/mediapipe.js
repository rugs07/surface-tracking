/**************************************************************************************************************
 * ************************************************************************************************************
 */

const inputVideoElement = document.getElementsByClassName("input_video")[0];
const outputCanvasElement = document.getElementsByClassName("output_canvas")[0];
const canvasCtx = outputCanvasElement.getContext("2d");

let trackButton = document.getElementById("trackbutton");
let updateNote = document.getElementById("updatenote");

const viewSpaceContainer = document.getElementById("viewspacecontainer");
let showhandscreen = document.getElementById("showhandscreen");
let modeButtons = Array.from(document.getElementsByClassName("modebutton"));

isMobile = mobileAndTabletCheck();
if (isMobile) {
  trackButton = document.getElementById("trackbutton-mobile");
}
// console.log("isMobile", isMobile);
// let cameraWidth = isMobile ? 360 : 1280;
// let cameraHeight = isMobile ? 640 : 720;

let width = 1280,
  height = 720;

if (isMobile) {
  width = 400;
  height = 400;
}
// const aspect = 720 / 1280;
// if (window.innerWidth > window.innerHeight) {
//   height = window.innerHeight;
//   width = height / aspect;
// } else {
//   width = window.innerWidth;
//   height = width * aspect;
// }
outputCanvasElement.width = width;
outputCanvasElement.height = height;

let isVideo = false;
let timer = 0;
let isResults = false;
// let lastHand = null;
// let lastDetectedTime = null;
let handPresent = false;

function setMeshVisibility() {
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

function onResults(results) {
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
    const handDetected = results.multiHandLandmarks && results.multiHandLandmarks.length > 0;
    const handLabel = results.multiHandedness.length ? results.multiHandedness[0].label : null;

    if (handDetected) {
      const indexFingerKnuckle = results.multiHandLandmarks[0][5];
      const littleFingerKnuckle = results.multiHandLandmarks[0][17];
      const isPalmFacing = indexFingerKnuckle.x < littleFingerKnuckle.x;
      
      if (!handPresent) {
        handPresent = true;
        if (handLabel === "Right") {
          baseThetha = isPalmFacing ? THREE.MathUtils.degToRad(-60) : THREE.MathUtils.degToRad(120);
        } else {
          baseThetha = isPalmFacing ? THREE.MathUtils.degToRad(-60) : THREE.MathUtils.degToRad(120);
        }
        cameraControls.azimuthAngle = baseThetha;
      }

      isResults = true;
      timer = 0;
      showhandscreen.style.display = "none";
      viewSpaceContainer.style.display = "inline-block";
      translateRotateMesh(results.multiHandLandmarks[0]);
    } else {
      handPresent = false;
      if (timer === 0) setMeshVisibility();
    }
  }

  canvasCtx.restore();
}

      // if (isPalmFacing && !wasPalmFacing) {
      //   baseThetha += THREE.MathUtils.degToRad(180);
      //   cameraControls.azimuthAngle = baseThetha;
      // } else if (!isPalmFacing && wasPalmFacing) {
      //   baseThetha -= THREE.MathUtils.degToRad(180);
      //   cameraControls.azimuthAngle = baseThetha;
      // }

const hands = new Hands({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
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

const camera = new Camera(inputVideoElement, {
  onFrame: async () => {
    await hands.send({ image: inputVideoElement });
  },
  width: width,
  height: height,
});

camera.width = width;
camera.height = height;
