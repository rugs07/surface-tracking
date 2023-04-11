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
// console.log("isMobile", isMobile);
// let cameraWidth = isMobile ? 360 : 1280;
// let cameraHeight = isMobile ? 640 : 720;

let width = 1280,
  height = 720;

if (isMobile) {
  width = 360;
  height = 480;
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

function setMeshVisibility() {
  setTimeout(() => {
    if (isResults) {
      if (timer === 8) {
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

  if (isVideo) {
    if (
      results.multiHandLandmarks.length && // checking if any hand is tracked
      results.multiHandLandmarks[0].length // checking if any point in first hand is tracked
    ) {
      viewSpaceContainer.style.display = "inline-block";
      translateRotateMesh(results.multiHandLandmarks[0]);
      // for (const landmarks of results.multiHandLandmarks) {
      // drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
      //   color: "#00FF00",
      //   lineWidth: 2,
      // });
      // drawLandmarks(canvasCtx, landmarks, { color: "#FF0000", lineWidth: 1 });
      // }
      isResults = true;
      timer = 0;
      showhandscreen.style.display = "none";
    } else {
      if (timer === 0) setMeshVisibility();
    }
  }

  canvasCtx.restore();
}

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
