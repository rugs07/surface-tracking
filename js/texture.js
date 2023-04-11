/**
 * Creates a float32 texture from a Float32Array of data.
 * @param {number} width
 * @param {number} height
 * @param {!Float32Array} data
 * @return {!THREE.DataTexture}
 */

function createFloatTextureFromData(width, height, data) {
  let texture = new THREE.DataTexture(data, width, height, THREE.RedFormat);
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  texture.type = THREE.FloatType;
  return texture;
}

/**
 * Creates a data texture containing MLP weights.
 *
 * @param {!Object} network_weights
 * @return {!THREE.DataTexture}
 */
function createNetworkWeightTexture(network_weights) {
  if (!network_weights) {
    let weightsData = new Float32Array([0]);
    return createFloatTextureFromData(1, 1, weightsData);
  }
  let width = network_weights.length;
  let height = network_weights[0].length;

  let weightsData = new Float32Array(width * height);
  for (let co = 0; co < height; co++) {
    for (let ci = 0; ci < width; ci++) {
      let index = co * width + ci;
      let weight = network_weights[ci][co];
      weightsData[index] = weight;
    }
  }
  return createFloatTextureFromData(width, height, weightsData);
}
