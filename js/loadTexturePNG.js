/**
 * Loads PNG image from rgbaURL and decodes it to an Uint8Array.
 * @param {string} rgbaUrl The URL of the PNG image.
 * @return {!Promise<!Uint8Array>}
 */
function loadPNG(rgbaUrl) {
  console.log(rgbaUrl);
  const rgbaPromise = fetch(rgbaUrl, {
    method: "GET",
    mode: "same-origin",
  })
    .then((response) => {
      return response.arrayBuffer();
    })
    .then((buffer) => {
      let data = new Uint8Array(buffer);
      let pngDecoder = new PNG(data);
      let pixels = pngDecoder.decodePixels();
      return pixels;
    });
  rgbaPromise.catch((error) => {
    console.error("Could not PNG image from: " + rgbaUrl + ", error: " + error);
    return;
  });
  return rgbaPromise;
}

async function unzipImages(zipFilePath) {
  const response = await fetch(zipFilePath);
  const arrayBuffer = await response.arrayBuffer();
  const zip = new JSZip();
  const unzippedPromises = [];
  const zippedFiles = await zip.loadAsync(arrayBuffer);
  for (const filename in zippedFiles.files) {
    const file = zippedFiles.files[filename];
    if (!file.dir) {
      const unzippedPromise = file.async("arraybuffer").then((arrayBuffer) => {
        const blob = new Blob([arrayBuffer], { type: "image/png" });
        const url = URL.createObjectURL(blob);
        return { filename, url };
      });
      unzippedPromises.push(unzippedPromise);
    }
  }

  const unzippedImages = await Promise.all(unzippedPromises);

  return unzippedImages;
}

/**
 * Fills an existing 3D RGB texture and an existing 3D alpha texture
 * from {url}_%03d.png.
 *
 * @param {!THREE.DataTexture3D} texture_alpha The alpha texture to gradually
 *     fill with data.
 * @param {!THREE.DataTexture3D} texture_rgb The rgb texture to gradually fill
 *     with data.
 * @param {string} url The URL prefix for the texture to be loaded from.
 * @param {number} num_slices The number of images the volume is stored in.
 * @param {number} volume_width The width of the final volume texture.
 * @param {number} volume_height The height of the final volume texture.
 * @param {number} volume_depth The depth of the final volume texture.
 * @param {?function()} on_update A function to be called whenever an image has
 *     been loaded.
 *
 * @return {!Promise} A promise that completes when all RGBA images have been
 *     uploaded.
 */

async function loadSplitVolumeTexturePNG(
  texture_alpha,
  texture_rgb,
  url,
  num_slices,
  volume_width,
  volume_height,
  volume_depth,
  on_update
) {
  const slice_depth = 4;
  let uploadPromises = [];

  // const unzippedImages = await unzipImages("bangleresults/images.zip");

  for (let i = 0; i < num_slices; i++) {
    let rgbaUrl = url + "_" + digits(i, 3) + ".png";
    let rgbaPromise = loadPNG(rgbaUrl);

    // let rgbaPromise = loadPNG(unzippedImages[i + 4].url);

    rgbaPromise = rgbaPromise.then((data) => {
      on_update();
      // console.log(data);
      return data;
    });

    uploadPromises[i] = new Promise(function (resolve, reject) {
      Promise.all([rgbaPromise, i])
        .then((values) => {
          let rgbaPixels = values[0];
          let i = values[1];

          let rgbPixels = new Uint8Array(
            volume_width * volume_height * slice_depth * 3
          );
          let alphaPixels = new Uint8Array(
            volume_width * volume_height * slice_depth * 1
          );

          for (let j = 0; j < volume_width * volume_height * slice_depth; j++) {
            rgbPixels[j * 3 + 0] = rgbaPixels[j * 4 + 0];
            rgbPixels[j * 3 + 1] = rgbaPixels[j * 4 + 1];
            rgbPixels[j * 3 + 2] = rgbaPixels[j * 4 + 2];
            alphaPixels[j] = rgbaPixels[j * 4 + 3];
          }

          // We unfortunately have to touch THREE.js internals to get access
          // to the texture handle and gl.texSubImage3D. Using dictionary
          // notation to make this code robust to minifcation.
          const rgbTextureProperties = gRenderer["properties"].get(texture_rgb);
          const alphaTextureProperties =
            gRenderer["properties"].get(texture_alpha);
          let gl = gRenderer.getContext();

          let oldTexture = gl.getParameter(gl.TEXTURE_BINDING_3D);
          gl.bindTexture(gl.TEXTURE_3D, rgbTextureProperties["__webglTexture"]);
          // Upload row-by-row to work around bug with Intel + Mac OSX.
          // See https://crbug.com/654258.
          for (let z = 0; z < slice_depth; ++z) {
            for (let y = 0; y < volume_height; ++y) {
              gl.texSubImage3D(
                gl.TEXTURE_3D,
                0,
                0,
                y,
                z + i * slice_depth,
                volume_width,
                1,
                1,
                gl.RGB,
                gl.UNSIGNED_BYTE,
                rgbPixels,
                3 * volume_width * (y + volume_height * z)
              );
            }
          }

          gl.bindTexture(
            gl.TEXTURE_3D,
            alphaTextureProperties["__webglTexture"]
          );
          // Upload row-by-row to work around bug with Intel + Mac OSX.
          // See https://crbug.com/654258.
          for (let z = 0; z < slice_depth; ++z) {
            for (let y = 0; y < volume_height; ++y) {
              gl.texSubImage3D(
                gl.TEXTURE_3D,
                0,
                0,
                y,
                z + i * slice_depth,
                volume_width,
                1,
                1,
                gl.RED,
                gl.UNSIGNED_BYTE,
                alphaPixels,
                volume_width * (y + volume_height * z)
              );
            }
          }
          gl.bindTexture(gl.TEXTURE_3D, oldTexture);

          resolve(texture_rgb);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  return new Promise(function (resolve, reject) {
    Promise.all(uploadPromises).then((values) => {
      resolve(values[0]);
    });
  });
}

/**
 * Fills an existing 3D RGBA texture from {url}_%03d.png.
 *
 * @param {!THREE.DataTexture3D} texture The texture to gradually fill with
 *     data.
 * @param {string} url The URL prefix for the texture to be loaded from.
 * @param {number} num_slices The number of images the volume is stored in.
 * @param {number} volume_width The width of the final volume texture.
 * @param {number} volume_height The height of the final volume texture.
 * @param {number} volume_depth The depth of the final volume texture.
 * @param {?function()} on_update A function to be called whenever an image has
 *     been loaded.
 *
 * @return {!Promise} A promise that completes when all RGBA images have been
 *     uploaded.
 */
async function loadVolumeTexturePNG(
  texture,
  url,
  num_slices,
  volume_width,
  volume_height,
  volume_depth,
  on_update
) {
  const slice_depth = 4;
  let uploadPromises = [];

  // const unzippedImages = await unzipImages("bangleresults/images.zip");

  for (let i = 0; i < num_slices; i++) {
    let rgbaUrl = url + "_" + digits(i, 3) + ".png";
    let rgbaPromise = loadPNG(rgbaUrl);

    // let rgbaPromise = loadPNG(unzippedImages[i].url);

    rgbaPromise = rgbaPromise.then((data) => {
      on_update();
      // console.log(data);
      return data;
    });

    uploadPromises[i] = new Promise(function (resolve, reject) {
      Promise.all([rgbaPromise, i])
        .then((values) => {
          let rgbaImage = values[0];
          let i = values[1];

          // We unfortunately have to touch THREE.js internals to get access
          // to the texture handle and gl.texSubImage3D. Using dictionary
          // notation to make this code robust to minifcation.
          const textureProperties = gRenderer["properties"].get(texture);
          let gl = gRenderer.getContext();

          let oldTexture = gl.getParameter(gl.TEXTURE_BINDING_3D);
          let textureHandle = textureProperties["__webglTexture"];
          gl.bindTexture(gl.TEXTURE_3D, textureHandle);
          // Upload row-by-row to work around bug with Intel + Mac OSX.
          // See https://crbug.com/654258.
          for (let z = 0; z < slice_depth; ++z) {
            for (let y = 0; y < volume_height; ++y) {
              gl.texSubImage3D(
                gl.TEXTURE_3D,
                0,
                0,
                y,
                z + i * slice_depth,
                volume_width,
                1,
                1,
                gl.RGBA,
                gl.UNSIGNED_BYTE,
                rgbaImage,
                4 * volume_width * (y + volume_height * z)
              );
            }
          }
          gl.bindTexture(gl.TEXTURE_3D, oldTexture);

          resolve(texture);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  return new Promise(function (resolve, reject) {
    Promise.all(uploadPromises).then((values) => {
      resolve(values[0]);
    });
  });
}
