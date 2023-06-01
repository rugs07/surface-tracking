/**
 * The a global dictionary containing scene parameters.
 * @type {?Object}
 */
let gSceneParams = null;
let varX = 2;
let varY = 2;
let varZ = 2;
let transVar = 1;
let ringTrans = 1.5;
let YRMul = 1; // multiplier for rotation with respect to y-axis
let translation = true;
let horizontalRotation = true;
let verticalRotation = false;
let XYRotation = true;
let resize = true;
let XRAngle = 0.0; // in radians
let YRAngle = 0.0; // in radians
let ZRAngle = 0.0; // in degrees
let isMobile = true;
let isIOS = false;
let jewelType = "";
let rawBaseTheta = 0;
let baseTheta = 0;
let selectedJewel = "";
let handLabel = "";

let glamCanvas = null;

/**
 * The timestamp of the last frame to be rendered, used to track performance.
 * @type {number}
 */
let gLastFrame = window.performance.now();

/**
 * The near plane used for rendering. Increasing this value somewhat speeds up
 * rendering, but this is most useful to show cross sections of the scene.
 * @type {number}
 */
let gNearPlane = 0.33;

/**
 * This scene renders the baked NeRF reconstruction using ray marching.
 * @type {?THREE.Scene}
 */
let gRayMarchScene = null;

/**
 * Progress counters for loading RGBA textures.
 * @type {number}
 */
let gLoadedRGBATextures = 0;

/**
 * Progress counters for loading feature textures.
 * @type {number}
 */
let gLoadedFeatureTextures = 0;

let cameraControls = null;
let arcballControls = null;
let clock = null;
// let baseTheta = THREE.MathUtils.degToRad(-40); //18.799324332763266 + 225;
let basePhi = 1.555185868967246;
let currThetha = 0;
let currPhi = 0;

/**
 * Different display modes for debugging rendering.
 * @enum {number}
 */
const DisplayModeType = {
  /** Runs the full model with view dependence. */
  DISPLAY_NORMAL: 0,
  /** Disables the view-dependence network. */
  DISPLAY_DIFFUSE: 1,
  /** Only shows the latent features. */
  DISPLAY_FEATURES: 2,
  /** Only shows the view dependent component. */
  DISPLAY_VIEW_DEPENDENT: 3,
  /** Only shows the coarse block grid. */
  DISPLAY_COARSE_GRID: 4,
  /** Only shows the block atlas structure. */
  DISPLAY_3D_ATLAS: 5,
};

/**  @type {!DisplayModeType}  */
let gDisplayMode = DisplayModeType.DISPLAY_DIFFUSE;

/**
 * Number of textures to load.
 * @type {number}
 */
let gNumTextures = 0;

/**
 * The THREE.js renderer object we use.
 * @type {?THREE.WebGLRenderer}
 */
let gRenderer = null;

/**
 * The perspective camera we use to view the scene.
 * @type {?THREE.PerspectiveCamera}
 */
let gCamera = null;

/**
 * We control the perspective camera above using OrbitControls.
 * @type {?THREE.OrbitControls}
 */
// let gOrbitControls = null;

/**
 * An orthographic camera used to kick off ray marching with a
 * full-screen render pass.
 * @type {?THREE.OrthographicCamera}
 */
let gBlitCamera = null;

let isVideo = false;
let camera = null;
let facingMode = "user";

let isArcball = false;
let loadFeatures = false;
let enableSmoothing = true;
let enableRingTransparency = false;

let lastMidRef = null;
let lastPinkyRef = null;
let lastIndexRef = null;
let totalTransX = 0;
let totalTransY = 0;
