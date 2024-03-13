let jewelsList = {
  b4_gen3: {
    name: "b4_gen3",
    label: "Flower Bangle",
    type: "bangle",
    baseThetaVR: 0.015, //var1
    basePhiVR: -3.55, //var2
    baseGamaVR: -1.6, //var3
    baseThetaAR: -0.05, //var4
    basePhiAR: -0.6, //var5
    baseGamaAR: -1.55, //var6
    scaleMulObjVR: 1.5,
  },
  laxmi_exp: {
    name: "laxmi_exp",
    label: "Laxmi Bangle",
    type: "bangle",
    baseThetaVR: -0.05,
    basePhiVR: -0.1,
    baseGamaVR: -1.58,
    baseThetaAR: -0.08,
    basePhiAR: -0.6,
    baseGamaAR: -1.55,
    scaleMulObjVR: 1.55,
  },
  // grt_11_single: {
  //   name: "grt_11_single",
  //   label: "Blossom Bangle",
  //   type: "bangle",
  //   baseThetaVR: -0.03,
  //   baseThetaAR: -0.05,
  //   basePhi: 0.5,
  //   baseGama: -1.58,
  // },
  jewel7_lr: {
    name: "jewel7_lr",
    label: "Rose Diamond Bracelet",
    type: "bangle",
    baseThetaVR: -0.02,
    basePhiVR: -1.1,
    baseGamaVR: 0.,
    baseThetaAR: -0.05,
    basePhiAR: 0,
    baseGamaAR: 0.0,
    lightBackground: "radial-gradient(#333,#000)",
  },
  jewel3_lr: {
    name: "jewel3_lr",
    label: "Queen's Ring",
    type: "ring",
    baseThetaVR: -0.08,
    basePhiVR: -1.1,
    baseGamaVR: -0.07,
    baseThetaAR: 0.005,
    basePhiAR: 2.57,
    baseGamaAR: -0.05,
    lightBackground: "radial-gradient(#333,#000)",
  },
  jewel21_lr: {
    name: "jewel21_lr",
    label: "Heart Ring",
    type: "ring",
    baseThetaVR: -0.35,
    basePhiVR: -1.2,
    baseGamaVR: -1.5 + 1.57,
    baseThetaAR: -0.1,
    basePhiAR: 2.6,
    baseGamaAR: -1.5,
    lightBackground: "radial-gradient(#333,#000)",
  },
  jewel25_lr: {
    name: "jewel25_lr",
    label: "Red Eye Ring",
    type: "ring",
    baseThetaVR: -0.25,
    basePhiVR: -1.4,
    baseGamaVR: -1.5 + 1.57,
    baseThetaAR: -0.05,
    basePhiAR: 1.995,
    baseGamaAR: -1.5,
  },
  jewel1_lr: {
    name: "jewel1_lr",
    label: "Sunny Ring",
    type: "ring",
    baseThetaVR: -0.45,
    basePhiVR: -1.2,
    baseGamaVR: -1.5 + 1.57,
    baseThetaAR: 0.05,
    basePhiAR: 2.55,
    baseGamaAR: -1.45,
    lightBackground: "radial-gradient(#333,#000)",
  },
  jewel26_lr: {
    name: "jewel26_lr",
    label: "Flower Ring",
    type: "ring",
    baseThetaVR: -0.45,
    basePhiVR: -1.2,
    baseGamaVR: -1.5 + 1.57,
    baseThetaAR: -0.06,
    basePhiAR: 2.55,
    baseGamaAR: 1.7,
  },
  pots: {
    name: "pots",
    label: "Ancient Pots",
    type: "handicraft",
    baseThetaVR: 0,
    basePhiVR: 0,
    baseGamaVR: 0,
    baseThetaAR: 0,
    basePhiAR: 0,
    baseGamaAR: 0,
    lightBackground: "radial-gradient(#000,#000)"
  },
  swan: {
    name: "swan",
    label: "Lively Swans",
    type: "handicraft",
    baseThetaVR: 0.1,
    basePhiVR: -0.5,
    baseGamaVR: 0.1,
    baseThetaAR: 0,
    basePhiAR: 0,
    baseGamaAR: 0,
    lightBackground: "radial-gradient(#000,#000)"
  },
  natraj: {
    name: "natraj",
    label: "Natraj",
    type: "handicraft",
    baseThetaVR: 0,
    basePhiVR: 0,
    baseGamaVR: 0,
    baseThetaAR: 0,
    basePhiAR: 0,
    baseGamaAR: 0,
    lightBackground: "radial-gradient(#333,#000)"
  },
  table_1: {
    name: "table_1",
    label: "Luxe Table",
    type: "handicraft",
    baseThetaVR: 0,
    basePhiVR: 0,
    baseGamaVR: 0,
    baseThetaAR: 0,
    basePhiAR: 0,
    baseGamaAR: 0,
    lightBackground: "radial-gradient(#333,#000)"
  },
};

// function updateJewelParam(jewelId, param, value) {
//   // Check if the specified jewel exists in the jewelsList
//   if (jewelsList[jewelId]) {
//       // Update the specified parameter for the jewel
//       jewelsList[jewelId][param] = parseFloat(value);

//       // Update the output display to reflect the new value
//       document.getElementById(param + 'Output').textContent = value;
//   }
// }

let showhandscreen = document.getElementById("showhandscreen");
let outputCanvasElement = document.getElementsByClassName("output_canvas")[0];
let usermanual = document.getElementById("usermanual");
let arToogleContainer = document.getElementById("ar-toggle-container");
let desktopViewAR = document.getElementById("desktop-viewar");
let mobileViewAR = document.getElementById("mobile-viewar");

function setJewellery(value) {
  facingMode = sessionStorage.getItem("facingMode") || "user";
  sessionStorage.setItem("facingMode", facingMode);
  sessionStorage.setItem("selectedJewel", value || "b4_gen3");

  location.href = "/tryon.html";
}

function changeJewellery(newJewel) {
  const lastJewel = sessionStorage.getItem("selectedJewel");
  if (lastJewel === newJewel) return;

  // const params = new URL(window.location.href).searchParams;
  sessionStorage.setItem("selectedJewel", newJewel);
  selectedJewel = newJewel || "b4_gen3";
  showLoading();
  setJewelParams();
  loadGsplat();
  resetMeshForAR();
}

function gotoHome() {
  location.href = `https://www.jar4u.com/`;
}

function applyRingTrans() {
  gRayMarchScene.children[0].material.uniforms.ringTrans.value = ringTrans;
  gRenderer.render(gRayMarchScene, gBlitCamera);
}

function applyTransVar() {  
  gRayMarchScene.children[0].material.uniforms.transVar.value = transVar;
  gRenderer.render(gRayMarchScene, gBlitCamera);
}

function resetTransVar() {
  gRayMarchScene.children[0].material.uniforms.transVar.value = 1;
  gRenderer.render(gRayMarchScene, gBlitCamera);
}

function resetRingTrans() {
  gRayMarchScene.children[0].material.uniforms.ringTrans.value = 1.5;
  gRenderer.render(gRayMarchScene, gBlitCamera);
}

function hideJewel() {
  showingJewel = 0;
  gRayMarchScene.children[0].material.uniforms.showingJewel.value = 0;
  gRenderer.render(gRayMarchScene, gBlitCamera);
}
function showJewel() {
  showingJewel = 1;
  gRayMarchScene.children[0].material.uniforms.showingJewel.value = 1;
  gRenderer.render(gRayMarchScene, gBlitCamera);
}

function hideHandScreen() {
  showhandscreen.style.display = "none";
}

function setJewelParams() {
  selectedJewel = sessionStorage.getItem("selectedJewel") || "jewel7_lr";
  const selectedJewelDetails = jewelsList[selectedJewel];

  jewelType = selectedJewelDetails.type || "ring";
  baseThetaVR = selectedJewelDetails.baseThetaVR || 0.15;
  baseThetaAR = selectedJewelDetails.baseThetaAR || -0.05;
  basePhiVR = selectedJewelDetails.basePhiVR || 0;
  basePhiAR = selectedJewelDetails.basePhiAR || 0;
  baseGamaVR = selectedJewelDetails.baseGamaVR || -0;
  baseGamaAR = selectedJewelDetails.baseGamaAR || -0;
  scaleMulObjVR = selectedJewelDetails.scaleMulObjVR || 1;

  let updateNote = document.getElementById("updatenote");
  updateNote.innerText = selectedJewelDetails.label;
}

// Method to enable or disable fullscreen view
const fullscreen = (mode = true, el = "body") =>
  mode
    ? document.querySelector(el).requestFullscreen()
    : document.exitFullscreen();

function resetMeshForAR() {
  console.log("resetting mesh for AR");
  baseTheta = baseThetaAR;
  basePhi = basePhiAR;
  baseGama = baseGamaAR;
  autorotate = false;
  scaleMul = 0.5;
  XRDelta = 0;
  YRDelta = 0;
  ZRAngle = 0;
  // cameraFar = -1.5;
  // cameraNear = 0.1;
  gsplatCanvas.style.transform = "none";
  console.log(controls);
  renderer.setSize(window.innerWidth*2, window.innerHeight);
}

function resetMeshForVR() {
  console.log(controls);
  // console.log(controls.desiredAlpha);
  setJewelParams();
  baseTheta = baseThetaVR;
  basePhi = basePhiVR;
  baseGama = baseGamaVR;
  autorotate = true;
  scaleMul = 0.5 * scaleMulObjVR;
  XRDelta = 0;
  YRDelta = 0;
  ZRAngle = 0;
  cameraFar = 100;
  cameraNear = 0.1;
  renderer.setSize(window.innerWidth, window.innerHeight);
  resetGlamCanvas();
}

function resetGlamCanvas() {
  let deviceWidth = document.documentElement.clientWidth;
  let deviceHeight = document.documentElement.clientHeight;
  let canvasWidth = Math.max(deviceWidth, deviceHeight);

  // const XDiff = (canvasWidth - deviceWidth) / 2;
  const XDiff = 0;
  const gsplatCanvas = document.getElementById("gsplatCanvas");

  // flipping canvas
  if (jewelType === "ring" && !isDirectionalRing) {
    if (isMobile || isIOS) {
      gsplatCanvas.style.transform =
        "translate3d(" +
        -XDiff +
        "px, " +
        -50 +
        "px, " +
        0 +
        "px) rotateZ(" +
        0 +
        "deg)";
    } else {
      gsplatCanvas.style.transform = "rotateZ(" + 0 + "deg)";
    }
  } else {
    if (isMobile || isIOS) {
      gsplatCanvas.style.transform =
        "translate3d(" + -XDiff + "px, " + -50 + "px, " + 0 + "px)";
    } else {
      gsplatCanvas.style.transform = "none";
    }
  }
}

function resetMesh() {
  scaleMul = 0.5;
  const gsplatCanvas = document.getElementById("gsplatCanvas");
  ZRAngle = 0;
  gsplatCanvas.style.transform = "none";
  hideJewel();
}

function mapRange(value, oldMin, oldMax, newMin, newMax) {
  const oldRange = oldMax - oldMin;
  const newRange = newMax - newMin;
  const newValue = ((value - oldMin) * newRange) / oldRange + newMin;
  return newValue;
}

// Define a function to calculate the angle at the middle point of three 3D landmarks
function calculateAngleAtMiddle(landmark1, landmark2, landmark3) {
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
    vector1[0] * vector2[0] + vector1[1] * vector2[1] + vector1[2] * vector2[2];

  // Calculate magnitudes of the vectors
  const magnitude1 = Math.sqrt(
    vector1[0] * vector1[0] + vector1[1] * vector1[1] + vector1[2] * vector1[2]
  );
  const magnitude2 = Math.sqrt(
    vector2[0] * vector2[0] + vector2[1] * vector2[1] + vector2[2] * vector2[2]
  );

  // Calculate the cosine of the angle using dot product and magnitudes
  const cosAngle = dotProduct / (magnitude1 * magnitude2);

  // Calculate the angle in radians
  const angleInRadians = Math.acos(cosAngle);

  // Convert the angle to degrees
  const angleInDegrees = (angleInRadians * 180) / Math.PI;

  return Math.trunc(angleInDegrees / 10);
}

function startSession() {
  usermanual.style.display = "none";
}

function showManual() {
  let step1img = document.getElementById("step1img");
  let step2img = document.getElementById("step2img");
  let step3img = document.getElementById("step3img");

  step1img.src = `assets/${jewelType}step1.jpg`;
  step2img.src = `assets/${jewelType}step2.jpg`;
  step3img.src = `assets/${jewelType}step3.gif`;

  retrycamscreen.style.display = "none";
  usermanual.style.display = "flex";

  toggleVideo();
}

/**
 * Reports an error to the user by populating the error div with text.
 * @param {string} text
 */
function error(text) {
  const e = document.getElementById("error");
  e.textContent = text;
  e.style.display = "block";
}

/**
 * Creates a DOM element that belongs to the given CSS class.
 * @param {string} what
 * @param {string} classname
 * @return {!HTMLElement}
 */
function create(what, classname) {
  const e = /** @type {!HTMLElement} */ (document.createElement(what));
  if (classname) {
    e.className = classname;
  }
  return e;
}

/**
 * Formats the integer i as a string with "min" leading zeroes.
 * @param {number} i
 * @param {number} min
 * @return {string}
 */
function digits(i, min) {
  const s = "" + i;
  if (s.length >= min) {
    return s;
  } else {
    return ("00000" + s).substr(-min);
  }
}

/**
 * Resizes a DOM element to the given dimensions.
 * @param {!Element} element
 * @param {number} width
 * @param {number} height
 */
function setDims(element, width, height) {
  element.style.width = width.toFixed(2) + "px";
  element.style.height = height.toFixed(2) + "px";
}

/**
 * Adds event listeners to UI.
 */
function addHandlers() {
  const view = document.querySelector(".view");
  view.addEventListener("keypress", function (e) {
    if (e.keyCode === 32 || e.key === " " || e.key === "Spacebar") {
      if (gDisplayMode == DisplayModeType.DISPLAY_NORMAL) {
        gDisplayMode = DisplayModeType.DISPLAY_DIFFUSE;
      } else if (gDisplayMode == DisplayModeType.DISPLAY_DIFFUSE) {
        gDisplayMode = DisplayModeType.DISPLAY_FEATURES;
      } else if (gDisplayMode == DisplayModeType.DISPLAY_FEATURES) {
        gDisplayMode = DisplayModeType.DISPLAY_VIEW_DEPENDENT;
      } else if (gDisplayMode == DisplayModeType.DISPLAY_VIEW_DEPENDENT) {
        gDisplayMode = DisplayModeType.DISPLAY_COARSE_GRID;
      } else if (gDisplayMode == DisplayModeType.DISPLAY_COARSE_GRID) {
        gDisplayMode = DisplayModeType.DISPLAY_3D_ATLAS;
      } /* gDisplayModeType == DisplayModeType.DISPLAY_3D_ATLAS */ else {
        gDisplayMode = DisplayModeType.DISPLAY_NORMAL;
      }
      e.preventDefault();
    }
  });
}

/**
 * Hides the Loading prompt.
 */
function hideLoading() {
  const gsplatCanvas = document.getElementById("gsplatCanvas");
  let loading = document.getElementById("Loading");
  loading.style.display = "none";

  let loadingContainer = document.getElementById("loading-container");
  loadingContainer.style.display = "none";
  viewSpaceContainer.style.backgroundColor = "transparent";
  let viewARButton = isMobile || isIOS ? mobileViewAR : desktopViewAR;

  gsplatCanvas.style.display = "block";
  if (isVideo) {
    showhandscreen.style.display = "flex";
    outputCanvasElement.style.display = "block";
    viewARButton.style.display = "block";
    arToogleContainer.style.display = "none";
  }

  viewARButton.disabled = false;
  viewARButton.onclick = showManual;
  viewARButton.classList.remove("disabledbtn");
  isLoading = false;
}

function showLoading() {
  isLoading = true;
  const gsplatCanvas = document.getElementById("gsplatCanvas");
  let loading = document.getElementById("Loading");
  loading.style.display = "block";

  let loadingContainer = document.getElementById("loading-container");
  loadingContainer.style.display = "flex";

  viewSpaceContainer.style.display = "block";
  viewSpaceContainer.style.backgroundColor = "#eee";
  let viewARButton = isMobile || isIOS ? mobileViewAR : desktopViewAR;

  showhandscreen.style.display = "none";
  arToogleContainer.style.display = "flex";
  viewARButton.style.display = "none";
  outputCanvasElement.style.display = "none";
  gsplatCanvas.style.display = "none";

  let activeElement = document.getElementsByClassName("active-ar-jewel")[0];
  if (activeElement) activeElement.classList.remove("active-ar-jewel");

  let activeJewel = document.getElementById(`${selectedJewel}`);
  if (activeJewel) activeJewel.classList.add("active-ar-jewel");
}

/**
 * Updates the loading progress HTML elements.
 */

let currentMessage = null;
let currentFunFact = null;
let lastUpdate = Date.now();

function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function updateMessageAndFunFact() {
  const loadingMessages = [
    "Polishing precious jewels",
    "Stringing precious pearls",
    "Forging jewellery treasures",
    "Creating jewellery sparkle",
    "Designing the masterpiece",
    "Unearthing golden stones",
    "Weaving the golden thread",
    "Crafting artwork of stars",
    "Unlocking the jewellery box",
  ];

  const funFactsAndTips = [
    "Did you know? The Hope Diamond is one of the most famous gemstones, weighing 45.52 carats!",
    "Tip: To get the best AR experience, make sure you're in a well-lit room.",
    "Fact: Pearls are the only gemstones created by living creatures, like oysters and mussels.",
    "Tip: Make sure your device's camera lens is clean for the best AR jewellery viewing experience.",
    "Fact: The word 'jewellery' is derived from the Latin word 'jocale,' meaning 'plaything.'",
    "Tip: For a more accurate jewellery fit in the AR experience, hold your device steady and parallel to the surface.",
    "Fact: The largest diamond ever discovered, the Cullinan Diamond, weighed 3,106 carats!",
    "Tip: You can take screenshots of your favorite AR jewellery pieces to share with friends or for future reference.",
    "Fact: Rubies, sapphires, and emeralds are considered 'precious' gemstones, while all others are categorized as 'semi-precious.'",
    "Tip: For best AR experience, make sure that no major light source is behind you.",
  ];

  currentMessage = getRandomItem(loadingMessages);
  currentFunFact = getRandomItem(funFactsAndTips);

  lastUpdate = Date.now();
}

function updateLoadingProgress(percentage) {
  let funOrFact = document.getElementById("funorfact");

  // let loadPercentage =
  //   gNumTextures > 0 ? (100 * gLoadedRGBATextures) / gNumTextures : "0";

  let loadPercentage = `${percentage}`;

  const num = parseFloat(loadPercentage);
  loadPercentage = num.toFixed().toString();

  if (loadPercentage.endsWith(".00")) {
    loadPercentage = parseInt(num).toString();
  }

  const timeSinceLastUpdate = Date.now() - lastUpdate;
  const updateInterval = 5000; // 5 seconds

  if (
    !currentMessage 
    ||
    // !currentFunFact ||
    timeSinceLastUpdate > updateInterval
  ) {
    updateMessageAndFunFact();
  }

  // funOrFact.innerHTML = currentFunFact;

  const loadingContainer = document.getElementById("loading-container");
  loadingContainer.innerHTML = `
  <div role="progressbar" aria-valuenow="${loadPercentage}" aria-valuemin="0" aria-valuemax="100" style="--value: ${loadPercentage}"></div>            
  <p class="progresstext">${currentMessage}</p>
  `;

  if (loadPercentage === "100") {
    setTimeout(hideLoading, 100);
    loadPercentage = 0;
  }
}

function mobileAndTabletCheck() {
  let check = false;
  (function (a) {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
        a
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substr(0, 4)
      )
    )
      check = true;
  })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
}

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

function getBrowserName() {
  if (
    typeof window === "undefined" ||
    typeof window.navigator === "undefined"
  ) {
    return "Unknown";
  }

  if (window.navigator.userAgent.includes("Edge")) {
    return "Edge";
  } else if (
    window.navigator.userAgent.includes("Trident") ||
    window.navigator.userAgent.includes("MSIE")
  ) {
    return "IE";
  } else if (window.navigator.userAgent.includes("Firefox")) {
    return "Firefox";
  } else if (window.navigator.userAgent.includes("OPR")) {
    return "Opera";
  } else if (window.navigator.userAgent.includes("UCBrowser")) {
    return "UC Browser";
  } else if (window.navigator.userAgent.includes("SamsungBrowser")) {
    return "Samsung Browser";
  } else if (
    window.navigator.userAgent.includes("Chrome") ||
    window.navigator.userAgent.includes("Chromium") ||
    window.navigator.userAgent.includes("CriOS")
  ) {
    return "Chrome";
  } else if (window.navigator.userAgent.includes("Safari")) {
    return "Safari";
  } else {
    return "Other";
  }
}

function checkDevice() {
  isMobile = mobileAndTabletCheck();
  console.log("isMobile", isMobile);
  isIOS = iOSCheck();
  console.log("isIOS", isIOS);
  browserName = getBrowserName();
  console.log(browserName);
}

function copyText(text) {
  navigator.clipboard.writeText("chrome://flags/#use-angle");
}

function addError(errorObj, index, arr) {
  const { error, msg1, msg2, instructions, imgsrc, tryagain } = errorObj;
  console.log(error);
  const sideErrors = document.getElementById("side-errors");

  let errorBox = document.createElement("div");
  errorBox.classList.add("error-box");
  if (index !== arr.length - 1) errorBox.classList.add("seperation");
  sideErrors.appendChild(errorBox);

  let errormsg1 = ` <p class="error-msg ${
    (!imgsrc || !error) && "color-msg"
  }" id="error-head${index}">${msg1}</p>`;
  if (msg1) errorBox.innerHTML += errormsg1;

  let errormsg2 = `<p class="error-msg ${
    (!imgsrc || !error) && "color-msg"
  }" id="error-sub${index}">${msg2}</p>`;
  if (msg2) errorBox.innerHTML += errormsg2;

  let trybutton = `<button class="centerbtn" type="button" id="reloadbtn">Try again</button>`;

  let imgcontainer = `<div class="errorsteps">
                        <div class="errorstep">
                          <img
                            src="assets/${imgsrc}"
                            class="errorimg ${
                              imgsrc.includes("opengl") ? "opengl-image" : ""
                            }"
                          />
                        </div>
                        ${tryagain ? trybutton : ""}
                      </div>`;

  if (instructions && instructions.length > 0) {
    instructions.forEach((inst, ind) => {
      errorBox.innerHTML += `<p class="flag-instruction">${ind + 1}. ${inst}
      ${ind === 1 ? `<span class="highlight">OpenGL</span>` : ""}
      ${
        ind === 0
          ? `<button class="centerbtn" type="button" id="copybtn">Copy URL</button>`
          : ""
      }
      </p>`;
      errorBox.innerHTML += ind === 1 ? imgcontainer : "";
    });
  }

  let qrcontainer = `<div class="errorsteps">
                        <div class="errorstep">
                          <div class="qr-code-container">
                            <div class="qr-code" style></div>
                          </div>
                        </div>
                        ${tryagain ? trybutton : ""}
                      </div>`;

  if (imgsrc && imgsrc.length) {
    if (!imgsrc.includes("opengl")) errorBox.innerHTML += imgcontainer;
  } else {
    errorBox.innerHTML += qrcontainer;
    generateQR({
      value: window.location.href,
    });
  }

  if (tryagain) {
    const reloadbtn = document.getElementById("reloadbtn");
    reloadbtn.onclick = function () {
      location.reload();
    };
  }

  if (instructions) {
    const copybtn = document.getElementById("copybtn");
    copybtn.onclick = function () {
      copyText("chrome://flags/#use-angle");
    };
  }
}

function showErrors(errors) {
  const j4container = document.getElementById("j4container");
  const titleContainer = document.getElementById("tryon-title");
  const arToggleContainer = document.getElementById("ar-toggle-container");
  const viewerContainer = document.getElementById("viewer-container");
  const arBottomContainer = document.getElementById("ar-bottom-container");
  const sideErrors = document.getElementById("side-errors");

  if (titleContainer) titleContainer.style.display = "flex";
  if (j4container) j4container.style.display = "none";
  if (arToggleContainer) arToggleContainer.style.display = "none";
  if (viewerContainer) viewerContainer.style.display = "none";
  if (arBottomContainer) arBottomContainer.style.display = "none";

  errors.forEach(addError);

  sideErrors.style.display = "flex";
}

function generateQR(user_input) {
  let qr_container = document.querySelector(".qr-code-container");
  qr_container.style.display = "flex";

  let qr_code_element = document.querySelector(".qr-code");
  qr_code_element.style = "";

  var qrcode = new QRCode(qr_code_element, {
    text: `${user_input.value}`,
    width: 180, //128
    height: 180,
    colorDark: "#333333",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H,
  });

  // To Download QR Code

  // let download = document.createElement("button");
  // qr_code_element.appendChild(download);

  let download_link = document.createElement("a");
  // download_link.setAttribute("download", "qr_code.png");
  // download_link.innerHTML = `Download <i class="fa-solid fa-download"></i>`;

  // download.appendChild(download_link);

  let qr_code_img = document.querySelector(".qr-code img");
  let qr_code_canvas = document.querySelector("canvas");

  if (qr_code_img.getAttribute("src") == null) {
    setTimeout(() => {
      download_link.setAttribute("href", `${qr_code_canvas.toDataURL()}`);
    }, 300);
  } else {
    setTimeout(() => {
      download_link.setAttribute("href", `${qr_code_img.getAttribute("src")}`);
    }, 300);
  }
}

/**
 * Checks whether the WebGL context is valid and the underlying hardware is
 * powerful enough. Otherwise displays a warning.
 * @return {boolean}
 */
function isRendererUnsupported() {
  let gl = document.getElementsByTagName("canvas")[1].getContext("webgl2");
  // console.log("renderer-webgl-context", gl);

  if (!gl) {
    showErrors([
      {
        error: "",
        msg1: "",
        msg2: "To try this advanced AR experience smoothly on desktop !",
        instructions: [
          "Open chrome://flags/#use-angle in new tab",
          "In the dropdown of 'Choose ANGLE graphics backend', select",
          "On the bottom right, press Relaunch chrome for the changes to take effect",
        ],
        imgsrc: "opengl-flag.png",
        tryagain: false,
      },
      {
        error: "jar4u Error: Could not fetch renderer info.",
        msg1: "To try out the jewellery piece on your phone !",
        msg2: "Please scan the QR code below or navigate to this link.",
        imgsrc: "",
        tryagain: false,
      },
    ]);
    return true;
  }

  let debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
  if (!debugInfo) {
    showErrors([
      {
        error: "",
        msg1: "",
        msg2: "To try this advanced AR experience smoothly on desktop !",
        instructions: [
          "Open chrome://flags/#use-angle in new tab",
          "In the dropdown of 'Choose ANGLE graphics backend', select",
          "On the bottom right, press Relaunch chrome for the changes to take effect",
        ],
        imgsrc: "opengl-flag.png",
        tryagain: false,
      },
      {
        error: "jar4u Error: Could not fetch renderer info.",
        msg1: "To try out the jewellery piece on your phone !",
        msg2: "Please scan the QR code below or navigate to this link.",
        imgsrc: "",
        tryagain: false,
      },
    ]);
    return true;
  } else {
    let unMaskedInfo = {
      renderer: "",
      vendor: "",
    };

    unMaskedInfo.renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
    unMaskedInfo.vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);

    console.log(unMaskedInfo);

    if (
      !(isMobile || isIOS) &&
      browserName === "Chrome" &&
      unMaskedInfo.renderer.indexOf("OpenGL") === -1 &&
      unMaskedInfo.renderer.indexOf("SwiftShader") === -1
    ) {
      showErrors([
        {
          error: "",
          msg1: "To ensure a smooth AR experience on your desktop,",
          msg2: "Please follow these steps !",
          instructions: [
            "Open a new tab and type chrome://flags/#use-angle in the address bar",
            'In the dropdown menu next to "Choose ANGLE graphics backend", select',
            'Click "Relaunch Chrome" at the bottom right to apply the changes.',
          ],
          imgsrc: "opengl-flag.png",
          tryagain: false,
        },
        {
          error: "",
          msg1: "Scan this QR code to",
          msg2: "Try on the jewelry now!",
          imgsrc: "",
          tryagain: false,
        },
      ]);
      return true;
    }
  }

  // let renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
  // if (!renderer || renderer.search("SwiftShader") >= 0 ||
  //     (renderer.search("ANGLE") >= 0 &&
  //      renderer.search("Intel") >= 0 &&
  //      (renderer.search("HD Graphics") >= 0 ||
  //       renderer.search("UHD Graphics") >= 0))) {
  // loading.innerHTML = "Error: Unsupported renderer: " + renderer +
  //   ". Are you running with hardware acceleration enabled?";
  //   return true;
  // }

  return false;
}

window.showErrors = showErrors;
