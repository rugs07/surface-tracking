/**
 * Loads the initial RIV scene parameters..
 * @param {string} dirUrl
 * @param {number} width
 * @param {number} height
 * @returns {!Promise} A promise for when the initial scene params have loaded.
 */
function loadScene(dirUrl, width, height) {
  // Reset the texture loading window.
  gLoadedRGBATextures = gLoadedFeatureTextures = gNumTextures = 0;
  updateLoadingProgress();

  // Loads scene parameters (voxel grid size, NDC/no-NDC, view-dependence MLP).
  let sceneParamsUrl = dirUrl + "/" + "scene_params.json";
  let sceneParamsPromise = fetch(sceneParamsUrl, {
    method: "GET",
    mode: "same-origin",
  }).then((response) => {
    return response.json();
  });
  sceneParamsPromise.catch((error) => {
    console.error(
      "Could not load scene params from: " +
        sceneParamsUrl +
        ", error: " +
        error
    );
    return;
  });

  // Load the indirection grid.
  const imageLoader = new THREE.ImageLoader();
  let atlasIndexUrl = dirUrl + "/" + "atlas_indices.png";
  const atlasIndexPromise = new Promise(function (resolve, reject) {
    imageLoader.load(
      atlasIndexUrl,
      (atlasIndexImage) => {
        resolve(atlasIndexImage);
      },
      undefined,
      () => reject(atlasIndexUrl)
    );
  });

  let initializedPromise = Promise.all([sceneParamsPromise, atlasIndexPromise]);
  initializedPromise.then((values) => {
    let parsed = values[0];
    let atlasIndexImage = values[1];

    // Start rendering ASAP, forcing THREE.js to upload the textures.
    requestAnimationFrame(render);

    gSceneParams = parsed;
    gSceneParams["dirUrl"] = dirUrl;
    gSceneParams["loadingTextures"] = false;
    gSceneParams["diffuse"] = true;
    // If we have a view-dependence network in the json file, turn on view
    // dependence.
    if ("0_bias" in gSceneParams) {
      gSceneParams["diffuse"] = false;
    }
    gNumTextures = gSceneParams["num_slices"];

    // Create empty 3D textures for the loaders to incrementally fill with data.
    let rgbVolumeTexture = new THREE.DataTexture3D(
      null,
      gSceneParams["atlas_width"],
      gSceneParams["atlas_height"],
      gSceneParams["atlas_depth"]
    );
    rgbVolumeTexture.format = THREE.RGBFormat;
    rgbVolumeTexture.generateMipmaps = false;
    rgbVolumeTexture.magFilter = rgbVolumeTexture.minFilter =
      THREE.LinearFilter;
    rgbVolumeTexture.wrapS =
      rgbVolumeTexture.wrapT =
      rgbVolumeTexture.wrapR =
        THREE.ClampToEdgeWrapping;
    rgbVolumeTexture.type = THREE.UnsignedByteType;

    let alphaVolumeTexture = new THREE.DataTexture3D(
      null,
      gSceneParams["atlas_width"],
      gSceneParams["atlas_height"],
      gSceneParams["atlas_depth"]
    );
    alphaVolumeTexture.format = THREE.RedFormat;
    alphaVolumeTexture.generateMipmaps = true;
    alphaVolumeTexture.magFilter = THREE.LinearFilter;
    alphaVolumeTexture.minFilter = THREE.LinearMipmapNearestFilter;
    alphaVolumeTexture.wrapS =
      alphaVolumeTexture.wrapT =
      alphaVolumeTexture.wrapR =
        THREE.ClampToEdgeWrapping;
    alphaVolumeTexture.type = THREE.UnsignedByteType;

    let featureVolumeTexture = null;
    if (!gSceneParams["diffuse"]) {
      featureVolumeTexture = new THREE.DataTexture3D(
        null,
        gSceneParams["atlas_width"],
        gSceneParams["atlas_height"],
        gSceneParams["atlas_depth"]
      );
      featureVolumeTexture.format = THREE.RGBAFormat;
      featureVolumeTexture.generateMipmaps = false;
      featureVolumeTexture.magFilter = featureVolumeTexture.minFilter =
        THREE.LinearFilter;
      featureVolumeTexture.wrapS =
        featureVolumeTexture.wrapT =
        featureVolumeTexture.wrapR =
          THREE.ClampToEdgeWrapping;
      featureVolumeTexture.type = THREE.UnsignedByteType;
    }

    let atlasIndexTexture = new THREE.DataTexture3D(
      atlasIndexImage,
      Math.ceil(gSceneParams["grid_width"] / gSceneParams["block_size"]),
      Math.ceil(gSceneParams["grid_height"] / gSceneParams["block_size"]),
      Math.ceil(gSceneParams["grid_depth"] / gSceneParams["block_size"])
    );
    atlasIndexTexture.format = THREE.RGBAFormat;
    atlasIndexTexture.generateMipmaps = false;
    atlasIndexTexture.magFilter = atlasIndexTexture.minFilter =
      THREE.NearestFilter;
    atlasIndexTexture.wrapS =
      atlasIndexTexture.wrapT =
      atlasIndexTexture.wrapR =
        THREE.ClampToEdgeWrapping;
    atlasIndexTexture.type = THREE.UnsignedByteType;

    let fullScreenPlane = new THREE.PlaneBufferGeometry(width, height);
    let rayMarchMaterial = createRayMarchMaterial(
      gSceneParams,
      alphaVolumeTexture,
      rgbVolumeTexture,
      featureVolumeTexture,
      atlasIndexTexture,
      gSceneParams["brightness"],
      gSceneParams["contrast"],
      gSceneParams["gamma"],
      new THREE.Vector3(
        gSceneParams["min_x"],
        gSceneParams["min_y"],
        gSceneParams["min_z"]
      ),
      gSceneParams["grid_width"],
      gSceneParams["grid_height"],
      gSceneParams["grid_depth"],
      gSceneParams["block_size"],
      gSceneParams["voxel_size"],
      gSceneParams["atlas_width"],
      gSceneParams["atlas_height"],
      gSceneParams["atlas_depth"]
    );

    let fullScreenPlaneMesh = new THREE.Mesh(fullScreenPlane, rayMarchMaterial);
    fullScreenPlaneMesh.position.z = -100;
    fullScreenPlaneMesh.frustumCulled = false;

    gRayMarchScene = new THREE.Scene();
    gRayMarchScene.add(fullScreenPlaneMesh);
    gRayMarchScene.autoUpdate = false;

    // // Create the axes objects
    // const x_axis_material = new THREE.LineBasicMaterial({ color: 0xff0000 });
    // const y_axis_material = new THREE.LineBasicMaterial({ color: 0x00ff00 });
    // const z_axis_material = new THREE.LineBasicMaterial({ color: 0x0000ff });

    // const x_axis_geometry = new THREE.BufferGeometry().setFromPoints([
    //   new THREE.Vector3(-300, 0, 0),
    //   new THREE.Vector3(300, 0, 0),
    // ]);

    // const y_axis_geometry = new THREE.BufferGeometry().setFromPoints([
    //   new THREE.Vector3(0, -300, 0),
    //   new THREE.Vector3(0, 300, 0),
    // ]);

    // const z_axis_geometry = new THREE.BufferGeometry().setFromPoints([
    //   new THREE.Vector3(0, 0, -300),
    //   new THREE.Vector3(0, 0, 300),
    // ]);

    // const x_axis = new THREE.Line(x_axis_geometry, x_axis_material);
    // const y_axis = new THREE.Line(y_axis_geometry, y_axis_material);
    // const z_axis = new THREE.Line(z_axis_geometry, z_axis_material);

    // // Set the scaling factor for the axes objects
    // const scale_factor = 3;
    // x_axis.scale.set(scale_factor, scale_factor, scale_factor);
    // y_axis.scale.set(scale_factor, scale_factor, scale_factor);
    // z_axis.scale.set(scale_factor, scale_factor, scale_factor);

    // // Set the rendering order of the axes objects
    // x_axis.renderOrder = 999;
    // y_axis.renderOrder = 999;
    // z_axis.renderOrder = 999;

    // // Add the axes objects to the scene
    // gRayMarchScene.add(x_axis);
    // gRayMarchScene.add(y_axis);
    // gRayMarchScene.add(z_axis);

    gBlitCamera = new THREE.OrthographicCamera(
      width / -2,
      width / 2,
      height / 2,
      height / -2,
      -10000,
      10000
    );
    gBlitCamera.position.z = 100;
  });

  initializedPromise.catch((errors) => {
    console.error(
      "Could not load scene from: " +
        dirUrl +
        ", errors:\n\t" +
        errors[0] +
        "\n\t" +
        errors[1] +
        "\n\t" +
        errors[2] +
        "\n\t" +
        errors[3]
    );
  });

  return initializedPromise;
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

/**
 * Initializes the application based on the URL parameters.
 */
function initFromParameters() {
  const params = new URL(window.location.href).searchParams;
  selectedJewel = params.get("dir") || "flowerbangle";
  const dirUrl = "results/" + selectedJewel;
  // console.log(dirUrl);
  const size = params.get("s");

  const usageString =
    "To view a RIV scene, specify the following parameters in the URL:\n" +
    "(Required) The URL to a RIV scene directory.\n" +
    "s: (Optional) The dimensions as width,height. E.g. 640,360.\n" +
    "vfovy:  (Optional) The vertical field of view of the viewer.";

  if (!dirUrl) {
    error("dir is a required parameter.\n\n" + usageString);
    return;
  }

  isMobile = mobileAndTabletCheck();
  // console.log("isMobile", isMobile);

  let width = 1280,
    height = 720;

  if (isMobile) {
    width = (window.innerWidth * 99) / 100;
    height = (window.innerHeight * 110) / 100;
  }
  // const aspect = 720 / 1280;
  // if (window.innerWidth > window.innerHeight) {
  //   height = window.innerHeight;
  //   width = height / aspect;
  // } else {
  //   width = window.innerWidth;
  //   height = width * aspect;
  // }

  if (size) {
    const match = size.match(/([\d]+),([\d]+)/);
    width = parseInt(match[1], 10);
    height = parseInt(match[2], 10);
  }

  gNearPlane = parseFloat(params.get("near") || 0.33);
  const vfovy = parseFloat(params.get("vfovy") || 35);

  loadScene(dirUrl, width, height);

  const view = create("div", "view");
  //   view.style.width = "100vw";
  //   view.style.height = "100vh";
  setDims(view, width, height);
  view.textContent = "";
  view.id = "view";

  const showhandscreen = document.getElementById("showhandscreen");
  setDims(showhandscreen, width, height);

  const usermanual = document.getElementById("usermanual");
  setDims(usermanual, width, height);

  const viewSpaceContainer = document.getElementById("viewspacecontainer");
  viewSpaceContainer.style.display = "inline-block";

  const viewSpace = document.querySelector(".viewspace");
  viewSpace.textContent = "";
  viewSpace.appendChild(view);

  let canvas = document.createElement("canvas");
  canvas.id = "glamCanvas";
  var desiredWidthInCSSPixels = width;
  var desiredHeightInCSSPixels = height;

  // set the display size of the canvas.
  canvas.style.width = desiredWidthInCSSPixels + "px";
  canvas.style.height = desiredHeightInCSSPixels + "px";

  // set the size of the drawingBuffer
  var devicePixelRatio = window.devicePixelRatio || 1;
  canvas.width = desiredWidthInCSSPixels * devicePixelRatio;
  canvas.height = desiredHeightInCSSPixels * devicePixelRatio;

  canvas.addEventListener(
    "webglcontextlost",
    function (event) {
      event.preventDefault();
    },
    false
  );

  canvas.addEventListener(
    "webglcontextrestored",
    function (event) {
      event.preventDefault();
      start();
    },
    false
  );

  view.appendChild(canvas);

  // Set up a high performance WebGL context, making sure that anti-aliasing is
  // truned off.
  let gl = canvas.getContext("webgl2");
  gRenderer = new THREE.WebGLRenderer({
    canvas: canvas,
    context: gl,
    powerPreference: "high-performance",
    alpha: false,
    stencil: false,
    precision: "highp",
    depth: false,
    antialias: false,
    desynchronized: true,
  });

  gCamera = new THREE.PerspectiveCamera(
    72,
    canvas.offsetWidth / canvas.offsetHeight,
    gNearPlane,
    100.0
  );
  gCamera.aspect = view.offsetWidth / view.offsetHeight;
  gCamera.fov = vfovy;
  gRenderer.autoClear = false;
  gRenderer.setSize(view.offsetWidth, view.offsetHeight);

  glamCanvas = canvas;

  // gOrbitControls = new THREE.OrbitControls(gCamera, view);
  // gOrbitControls.screenSpacePanning = true;
  // gOrbitControls.zoomSpeed = 0.5;

  // let controlType = document.getElementById("controlType");
  if (isArcball) {
    arcballControls = new THREE.ArcballControls(
      gCamera,
      gRenderer.domElement,
      gRayMarchScene
    );
    arcballControls.rotateSpeed = 1.0;
    // controlType.innerText = "Arcball";
  } else {
    CameraControls.install({ THREE: THREE });
    cameraControls = new CameraControls(gCamera, gRenderer.domElement);
    cameraControls.azimuthAngle = baseTheta;
    cameraControls.polarAngle = basePhi;
    cameraControls.enabled = false;
    // handleEvents();
    clock = new THREE.Clock();
    // controlType.innerText = "CameraCon";
  }
}

// To handle Camera-Controls events

function handleEvents() {
  const keyState = {
    shiftRight: false,
    shiftLeft: false,
    controlRight: false,
    controlLeft: false,
    arrowUp: false,
    arrowDown: false,
    arrowLeft: false,
    arrowRight: false,
    keyW: false,
    keyA: false,
    keyS: false,
    keyD: false,
  };

  document.addEventListener("keydown", (event) => {
    if (event.code === "ShiftRight") keyState.shiftRight = true;
    if (event.code === "ShiftLeft") keyState.shiftLeft = true;
    if (event.code === "ControlRight") keyState.controlRight = true;
    if (event.code === "ControlLeft") keyState.controlLeft = true;
    if (event.code === "ArrowUp") keyState.arrowUp = true;
    if (event.code === "ArrowDown") keyState.arrowDown = true;
    if (event.code === "ArrowLeft") keyState.arrowLeft = true;
    if (event.code === "ArrowRight") keyState.arrowRight = true;
    if (event.code === "KeyW") keyState.keyW = true;
    if (event.code === "KeyA") keyState.keyA = true;
    if (event.code === "KeyS") keyState.keyS = true;
    if (event.code === "KeyD") keyState.keyD = true;

    if (keyState.shiftRight || keyState.shiftLeft) {
      cameraControls.mouseButtons.left = CameraControls.ACTION.TRUCK;
    } else if (keyState.controlRight || keyState.controlLeft) {
      cameraControls.mouseButtons.left = CameraControls.ACTION.DOLLY;
    } else {
      cameraControls.mouseButtons.left = CameraControls.ACTION.ROTATE;
    }

    if (keyState.arrowUp) {
      cameraControls.zoom(0.1, false);
    } else if (keyState.arrowDown) {
      cameraControls.zoom(-0.1, false);
    }
    // else if (keyState.arrowLeft) {
    //   cameraControls.truck(0.1, 0, false);
    // } else if (keyState.arrowRight) {
    //   cameraControls.truck(-0.1, 0, false);
    // }
    else if (keyState.keyW) {
      cameraControls.rotate(0, 1.5 * THREE.MathUtils.DEG2RAD, true);
    } else if (keyState.keyA) {
      cameraControls.rotate(1.5 * THREE.MathUtils.DEG2RAD, 0, true);
    } else if (keyState.keyS) {
      cameraControls.rotate(0, -1.5 * THREE.MathUtils.DEG2RAD, true);
    } else if (keyState.keyD) {
      cameraControls.rotate(-1.5 * THREE.MathUtils.DEG2RAD, 0, true);
    }
  });

  document.addEventListener("keyup", (event) => {
    if (event.code === "ShiftRight") keyState.shiftRight = false;
    if (event.code === "ShiftLeft") keyState.shiftLeft = false;
    if (event.code === "ControlRight") keyState.controlRight = false;
    if (event.code === "ControlLeft") keyState.controlLeft = false;
    if (event.code === "ArrowUp") keyState.arrowUp = false;
    if (event.code === "ArrowDown") keyState.arrowDown = false;
    if (event.code === "ArrowLeft") keyState.arrowLeft = false;
    if (event.code === "ArrowRight") keyState.arrowRight = false;
    if (event.code === "KeyW") keyState.keyW = false;
    if (event.code === "KeyA") keyState.keyA = false;
    if (event.code === "KeyS") keyState.keyS = false;
    if (event.code === "KeyD") keyState.keyD = false;

    if (keyState.shiftRight || keyState.shiftLeft) {
      cameraControls.mouseButtons.left = CameraControls.ACTION.TRUCK;
    } else if (keyState.controlRight || keyState.controlLeft) {
      cameraControls.mouseButtons.left = CameraControls.ACTION.DOLLY;
    } else {
      cameraControls.mouseButtons.left = CameraControls.ACTION.ROTATE;
    }

    if (keyState.arrowUp) {
      cameraControls.zoom(0.1, false);
    } else if (keyState.arrowDown) {
      cameraControls.zoom(-0.1, false);
    }
    // else if (keyState.arrowLeft) {
    //   cameraControls.truck(0.1, 0, false);
    // } else if (keyState.arrowRight) {
    //   cameraControls.truck(-0.1, 0, false);
    // }
    else if (keyState.keyW) {
      cameraControls.rotate(0, 1.5 * THREE.MathUtils.DEG2RAD, true);
    } else if (keyState.keyA) {
      cameraControls.rotate(1.5 * THREE.MathUtils.DEG2RAD, 0, true);
    } else if (keyState.keyS) {
      cameraControls.rotate(0, -1.5 * THREE.MathUtils.DEG2RAD, true);
    } else if (keyState.keyD) {
      cameraControls.rotate(-1.5 * THREE.MathUtils.DEG2RAD, 0, true);
    }
  });

  let lastTapTime = performance.now();
  const doubleTapTimeout = 250;
  const customPointerEvent = new THREE.EventDispatcher();

  document.addEventListener("mousedown", () => {
    const now = performance.now();
    const isDoubleTap = now - lastTapTime < doubleTapTimeout;
    customPointerEvent.dispatchEvent({
      type: isDoubleTap ? "doubletap" : "tap",
    });
    lastTapTime = now;
  });

  customPointerEvent.addEventListener("doubletap", function () {
    cameraControls.mouseButtons.left = CameraControls.ACTION.TRUCK;
    cameraControls.touches.one = CameraControls.ACTION.TRUCK;
  });
  customPointerEvent.addEventListener("tap", function () {
    cameraControls.mouseButtons.left = CameraControls.ACTION.ROTATE;
    cameraControls.touches.one = CameraControls.ACTION.TOUCH_ROTATE;
  });
}

/**
 * Set up code that needs to run once after the  scene parameters have loaded.
 */
function loadOnFirstFrame() {
  // Early out if we've already run this function.
  if (gSceneParams["loadingTextures"]) {
    return;
  }

  // Also early out if the renderer is not supported.
  if (isRendererUnsupported()) {
    gSceneParams["loadingTextures"] = true;
    let loadingContainer = document.getElementById("loading-container");
    loadingContainer.style.display = "none";
    return;
  }

  // Set up the camera controls for the scene type.
  // gOrbitControls.target.x = 0.0;
  // gOrbitControls.target.y = 0.0;
  // gOrbitControls.target.z = 0.0;

  if (isArcball) arcballControls.setTarget(0.0, 0.0, 0.0);
  else cameraControls.setTarget(0.0, 0.0, 0.0, true);

  jewelType = gSceneParams["jeweltype"];
  rawBaseTheta = gSceneParams["baseTheta"];
  transVar = gSceneParams["transVar"];

  if (gSceneParams["ndc"]) {
    gCamera.position.x = 0.0;
    gCamera.position.y = 0.0;
    gCamera.position.z = -0.25;
    // gOrbitControls.panSpeed = 5.0;
    // gOrbitControls.minDistance = 0.05;
    // gOrbitControls.maxDistance = 0.3;
    // gOrbitControls.mouseButtons.LEFT = THREE.MOUSE.PAN;
  } else {
    gCamera.position.x = 0.0;
    gCamera.position.y = 0.0;
    gCamera.position.z = -2.0;

    if (!isArcball) {
      cameraControls.truckSpeed = 5.0;
      cameraControls.dollySpeed = 5.0;
      cameraControls.minDistance = 0.05;
      cameraControls.maxDistance = 0.3;
    }
  }

  // gOrbitControls.position = gCamera.position;
  // gOrbitControls.position0 = gCamera.position;

  if (!isArcball) {
    cameraControls.setPosition(
      gCamera.position.x,
      gCamera.position.y,
      gCamera.position.z,
      true
    );
  }

  gCamera.updateProjectionMatrix();
  // gOrbitControls.update();

  if (isArcball) {
    arcballControls.update();
  } else {
    resetMeshForVR();
    cameraControls.setFocalOffset(0.0, 0.0, 0.0);
  }

  // Now that the 3D textures have been allocated, we can start slowly filling
  // them with data.
  const alphaVolumeTexture =
    gRayMarchScene.children[0].material.uniforms["mapAlpha"]["value"];
  const rgbVolumeTexture =
    gRayMarchScene.children[0].material.uniforms["mapColor"]["value"];
  let rgbVolumeTexturePromise = loadSplitVolumeTexturePNG(
    alphaVolumeTexture,
    rgbVolumeTexture,
    gSceneParams["dirUrl"] + "/rgba",
    gNumTextures,
    gSceneParams["atlas_width"],
    gSceneParams["atlas_height"],
    gSceneParams["atlas_depth"],
    function () {
      gLoadedRGBATextures++;
      updateLoadingProgress();
    }
  );

  let featureVolumeTexturePromise = null;
  if (loadFeatures && !gSceneParams["diffuse"]) {
    const featureVolumeTexture =
      gRayMarchScene.children[0].material.uniforms["mapFeatures"]["value"];
    featureVolumeTexturePromise = loadVolumeTexturePNG(
      featureVolumeTexture,
      gSceneParams["dirUrl"] + "/feature",
      gNumTextures,
      gSceneParams["atlas_width"],
      gSceneParams["atlas_height"],
      gSceneParams["atlas_depth"],
      function () {
        gLoadedFeatureTextures++;
        updateLoadingProgress();
      }
    );
  }

  let promises = [rgbVolumeTexturePromise];
  if (loadFeatures) {
    promises.push(rgbVolumeTexturePromise);
  }

  let allTexturesPromise = Promise.all(promises);
  allTexturesPromise.catch((errors) => {
    console.error(
      "Could not load scene from: " +
        gSceneParams["dirUrl"] +
        ", errors:\n\t" +
        errors[0] +
        "\n\t" +
        errors[1] +
        "\n\t" +
        errors[2] +
        "\n\t" +
        errors[3]
    );
  });

  // After all the textures have been loaded, we build mip maps for alpha
  // to enable accelerated ray marching inside each macroblock.
  allTexturesPromise.then((texture) => {
    const alphaTextureProperties =
      gRenderer["properties"].get(alphaVolumeTexture);
    let gl = gRenderer.getContext();
    let oldTexture = gl.getParameter(gl.TEXTURE_BINDING_3D);
    gl.bindTexture(gl.TEXTURE_3D, alphaTextureProperties["__webglTexture"]);
    gl.generateMipmap(gl.TEXTURE_3D);
    gl.bindTexture(gl.TEXTURE_3D, oldTexture);

    hideLoading();
    console.log("Successfully loaded scene from: " + gSceneParams["dirUrl"]);
    var d = new Date();
    var n = d.toLocaleTimeString();
    console.log("mesh load ended at", n);
  });

  // Now set the loading textures flag so this function runs only once.
  gSceneParams["loadingTextures"] = true;
}

/**
 * Updates the frame rate counter using exponential fall-off smoothing.
 */
function updateFPSCounter() {
  let currentFrame = window.performance.now();
  let milliseconds = currentFrame - gLastFrame;
  let oldMilliseconds =
    1000 / (parseFloat(document.getElementById("fpsdisplay").innerHTML) || 1.0);

  // Prevent the FPS from getting stuck by ignoring frame times over 2 seconds.
  if (oldMilliseconds > 2000 || oldMilliseconds < 0) {
    oldMilliseconds = milliseconds;
  }
  let smoothMilliseconds = oldMilliseconds * 0.75 + milliseconds * 0.25;
  let smoothFps = 1000 / smoothMilliseconds;
  gLastFrame = currentFrame;
  document.getElementById("fpsdisplay").innerHTML = smoothFps.toFixed(1);
}

/**
 * The main render function that gets called every frame.
 * @param {number} t
 */
function render(t) {
  loadOnFirstFrame();

  gCamera.updateMatrix();
  gRenderer.setRenderTarget(null);
  gRenderer.clear();

  let world_T_camera = gCamera.matrixWorld;
  let camera_T_clip = new THREE.Matrix4();
  // camera_T_clip.getInverse(gCamera.projectionMatrix);
  camera_T_clip.copy(gCamera.projectionMatrix).invert();

  let world_T_clip = new THREE.Matrix4();
  world_T_clip.multiplyMatrices(world_T_camera, camera_T_clip);

  gRayMarchScene.children[0].material.uniforms["world_T_clip"]["value"] =
    world_T_clip;
  gRayMarchScene.children[0].material.uniforms["displayMode"]["value"] =
    gDisplayMode - 0;
  gRayMarchScene.children[0].material.uniforms["ndc"]["value"] =
    gSceneParams["ndc"] - 0;
  gRayMarchScene.children[0].material.uniforms["nearPlane"]["value"] =
    gNearPlane;

  if (isArcball) {
    arcballControls.update();
  } else {
    const delta = clock.getDelta();
    cameraControls.update(delta);
  }

  gRenderer.render(gRayMarchScene, gBlitCamera);

  // updateFPSCounter();
  requestAnimationFrame(render);
}

/**
 * Starts the volumetric object viewer application.
 */
function start() {
  var d = new Date();
  var n = d.toLocaleTimeString();
  console.log("mesh load started at", n);

  document.querySelectorAll(".loadbtns").forEach((e) => (e.disabled = true));
  document.getElementById("viewspacecontainer").display = true;

  initFromParameters();
  addHandlers();
}

window.THREE.Cache.clear();
start();
