import * as SPLAT from "https://cdn.jsdelivr.net/npm/gsplat@latest";

const canvas = document.getElementById("gsplatCanvas");
const progressDialog = document.getElementById("progress-dialog");
const progressIndicator = document.getElementById("progress-indicator");

const renderer = new SPLAT.WebGLRenderer(canvas);
const scene = new SPLAT.Scene();
const camera = new SPLAT.Camera();
const controls = new SPLAT.OrbitControls(camera, canvas);

async function loadGsplat() {
  // const query = new URLSearchParams(window.location.search);
  // const model = query.get("id") ?? "jewel7_lr";
  const model = sessionStorage.getItem("selectedJewel");

  const url =
    "https://gaussian-splatting-production.s3.ap-south-1.amazonaws.com/" +
    model +
    "/" +
    model +
    ".splat";

  // const object = await fetch("https://gaussian-splatting-production.s3.ap-south-1.amazonaws.com/"+model+"/"+model+".json")
  // const objectMatrix = await object.json()
  // viewMatrix = objectMatrix.defualt_view_matrix

  scene.reset();

  const splat = await SPLAT.Loader.LoadAsync(
    url,
    scene,
    // (progress) => (progressIndicator.value = progress * 100)
    (progress) => {
      updateLoadingProgress(progress * 100);
    }
  );
  // progressDialog.close();

  // scene.removeObject(splat);
  // scene.addObject(splat);

  const handleResize = () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
  };

  // baseTheta = 0.25;
  rawBaseTheta = baseTheta;
  // basePhi = 2.5;
  // baseGama = -0.05;

  // splat.applyPosition();
  // splat.applyRotation();
  // splat.applyScale();

  const frame = () => {
    // adding radians of x-rotation, y-rotation, z-rotation
    const rotation = new SPLAT.Vector3(
      baseTheta + XRDelta,
      basePhi + YRDelta,
      baseGama
    );
    splat.rotation = SPLAT.Quaternion.FromEuler(rotation);

    // adding units of translation in x,y,z, direction

    // const translation = new SPLAT.Vector3(XTrans / 200, YTrans / 200, 0);
    // splat.position = translation;

    // scaleFactor to be applied inn all directions
    const scaling = new SPLAT.Vector3(scaleMul, scaleMul, scaleMul);
    splat.scale = scaling;
    // To cut the back part of jewel
    camera._data._near = cameraNear;
    camera._data._far = cameraFar;
    camera._data._updateProjectionMatrix();

    controls.update();
    renderer.render(scene, camera);

    requestAnimationFrame(frame);
  };

  handleResize();
  window.addEventListener("resize", handleResize);

  requestAnimationFrame(frame);
}

window.THREE.Cache.clear();
checkDevice();
loadGsplat();
resetMeshForVR();

window.loadGsplat = loadGsplat;
