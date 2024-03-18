// importScripts(
//   "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.2.0/jszip.min.js"
// );

// Executing this file by having src in index.html and opening that with live server

async function zipAndLoadImages(imagePaths) {
  const zip = new JSZip();
  const promises = [];

  // Zip the images asynchronously
  for (const path of imagePaths) {
    const response = await fetch(path);
    const arrayBuffer = await response.arrayBuffer();
    const filename = path.split("/").pop();
    zip.file(filename, arrayBuffer);
  }

  // Generate a blob from the zipped data
  const zippedBlob = await zip.generateAsync({ type: "blob" });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(zippedBlob);
  link.download = "images.zip";

  // Trigger a click on the anchor tag to download the file
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  console.log(zippedBlob);
}

const params = new URL(window.location.href).searchParams;
const dirUrl = params.get("dir") || "bangleresults/336";
console.log(dirUrl);

zipAndLoadImages([
  // "bangleresults/336/atlas_indices.png",
  `${dirUrl}/feature_000.png`,
  `${dirUrl}/feature_001.png`,
  `${dirUrl}/feature_002.png`,
  `${dirUrl}/feature_003.png`,
  `${dirUrl}/feature_004.png`,
  `${dirUrl}/feature_005.png`,
  `${dirUrl}/feature_006.png`,
  `${dirUrl}/feature_007.png`,
  `${dirUrl}/rgba_000.png`,
  `${dirUrl}/rgba_001.png`,
  `${dirUrl}/rgba_002.png`,
  `${dirUrl}/rgba_003.png`,
  `${dirUrl}/rgba_004.png`,
  `${dirUrl}/rgba_005.png`,
  `${dirUrl}/rgba_006.png`,
  `${dirUrl}/rgba_007.png`,
]);
