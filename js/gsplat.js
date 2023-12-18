import * as SPLAT from "https://cdn.jsdelivr.net/npm/gsplat@latest";

const canvas = document.getElementById("gsplatCanvas");
const progressDialog = document.getElementById("progress-dialog");
const progressIndicator = document.getElementById("progress-indicator");

const renderer = new SPLAT.WebGLRenderer(canvas);
const scene = new SPLAT.Scene();
const camera = new SPLAT.Camera();
const controls = new SPLAT.OrbitControls(camera, canvas);

async function main() {
  // const query = new URLSearchParams(window.location.search);
  // const model = query.get("id") ?? "jewel7";
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

  const splat = await SPLAT.Loader.LoadAsync(
    url,
    scene,
    (progress) => (progressIndicator.value = progress * 100)
  );
  progressDialog.close();

  const handleResize = () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
  };

  const baseXRot = 0.25;
  const baseYRot = 2.5;
  const baseZRot = -0.05;

  // const rotation = new SPLAT.Vector3(baseXRot, baseYRot, baseZRot);
  // splat.rotation = SPLAT.Quaternion.FromEuler(rotation);

  // const translation = new SPLAT.Vector3(0, 0, 0);
  // splat.position = translation;

  // const scaling = new SPLAT.Vector3(baseScale, baseScale, baseScale);
  // splat.scale = scaling;

  // splat.applyPosition();
  // splat.applyRotation();
  // splat.applyScale();

  const frame = () => {
    // adding radians of x-rotation, y-rotation, z-rotation
    const rotation = new SPLAT.Vector3(
      baseXRot + XRDelta,
      baseYRot + YRDelta,
      baseZRot + ZRDelta
    );
    splat.rotation = SPLAT.Quaternion.FromEuler(rotation);

    // adding units of translation in x,y,z, direction

    // const translation = new SPLAT.Vector3(XTrans / 200, YTrans / 200, 0);
    // splat.position = translation;

    // scaleFactor to be applied inn all directions
    const scaling = new SPLAT.Vector3(scaleMul, scaleMul, scaleMul);
    splat.scale = scaling;

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
main();
