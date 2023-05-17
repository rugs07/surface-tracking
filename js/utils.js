function updateX(value) {
  console.log("x :", value);
  varX = value;
}

function updateY(value) {
  console.log("y :", value);
  varY = value;
}

function updateZ(value) {
  console.log("z:", value);
  varZ = value;
}

function updateYRMul(value) {
  YRMul = value;
}

function updateTransVar(value) {
  console.log("transVar :", value);
  transVar = value;

  gRayMarchScene.children[0].material.uniforms.transVar.value = transVar;
  gRenderer.render(gRayMarchScene, gBlitCamera);
}

function hideHandScreen() {
  let showhandscreen = document.getElementById("showhandscreen");
  showhandscreen.style.display = "none";
}

function resetMesh() {
  cameraControls.moveTo(0.0, 0.0, 0.0, true);
  cameraControls.zoomTo(1, true);
  cameraControls.azimuthAngle = THREE.MathUtils.degToRad(-40);
  cameraControls.polarAngle = basePhi;
  cameraControls.setFocalOffset(0.0, 0.0, 0.0);
  ZRAngle = 0;
  glamCanvas.style.transform = "none";
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
  let loading = document.getElementById("Loading");
  loading.style.display = "none";

  let loadingContainer = document.getElementById("loading-container");
  loadingContainer.style.display = "none";

  let updateNote = document.getElementById("updatenote");
  updateNote.innerText = "Welcome to jAR4U";
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
    "Polishing your gems: ",
    "Stringing your pearls: ",
    "Forging your treasures: ",
    "Creating your sparkle: ",
    "Designing your masterpiece: ",
    "Unearthing precious stones: ",
    "Weaving a golden thread: ",
    "Crafting your royal jewels: ",
    "Assembling a necklace of stars: ",
    "Unlocking the jewelry box: ",
  ];

  const funFactsAndTips = [
    "Did you know? The Hope Diamond is one of the most famous gemstones, weighing 45.52 carats!",
    "Tip: To get the best AR experience, make sure you're in a well-lit room.",
    "Fact: Pearls are the only gemstones created by living creatures, like oysters and mussels.",
    "Tip: Make sure your device's camera lens is clean for the best AR jewelry viewing experience.",
    "Fact: The word 'jewelry' is derived from the Latin word 'jocale,' meaning 'plaything.'",
    "Tip: For a more accurate jewelry fit in the AR experience, hold your device steady and parallel to the surface.",
    "Fact: The largest diamond ever discovered, the Cullinan Diamond, weighed 3,106 carats!",
    "Tip: You can take screenshots of your favorite AR jewelry pieces to share with friends or for future reference.",
    "Fact: Rubies, sapphires, and emeralds are considered 'precious' gemstones, while all others are categorized as 'semi-precious.'",
    "Tip: For best AR experience, make sure that no major light source is behind you.",
  ];

  currentMessage = getRandomItem(loadingMessages);
  currentFunFact = getRandomItem(funFactsAndTips);

  lastUpdate = Date.now();
}

function updateLoadingProgress() {
  let progress = document.getElementById("loadingprogress");
  let funOrFact = document.getElementById("funorfact");

  const loadPercentage =
    gNumTextures > 0 ? (100 * gLoadedRGBATextures) / gNumTextures : "0";

  const timeSinceLastUpdate = Date.now() - lastUpdate;
  const updateInterval = 5000; // 5 seconds

  if (
    !currentMessage ||
    !currentFunFact ||
    timeSinceLastUpdate > updateInterval
  ) {
    updateMessageAndFunFact();
  }

  progress.innerHTML = currentMessage + loadPercentage + "%";
  funOrFact.innerHTML = currentFunFact;
}

/**
 * Checks whether the WebGL context is valid and the underlying hardware is
 * powerful enough. Otherwise displays a warning.
 * @return {boolean}
 */
function isRendererUnsupported() {
  let loading = document.getElementById("Loading");

  let gl = document.getElementsByTagName("canvas")[1].getContext("webgl2");
  if (!gl) {
    loading.innerHTML =
      "Error: WebGL2 context not found. Is your machine" +
      " equipped with a discrete GPU?";
    return true;
  }

  let debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
  if (!debugInfo) {
    loading.innerHTML =
      "Error: Could not fetch renderer info. Is your" +
      " machine equipped with a discrete GPU?";
    return true;
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
