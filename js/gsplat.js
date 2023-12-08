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

  await SPLAT.Loader.LoadAsync(
    url,
    scene,
    (progress) => (progressIndicator.value = progress * 100)
  );
  progressDialog.close();

  const handleResize = () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
  };

  const frame = () => {
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
