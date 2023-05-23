/**
 * Creates a material (i.e. shaders and texture bindings) for a RIV scene.
 *
 * First, this shader ray marches through an RGBA + FEATURE grid, stored as a
 * block-sparse matrix, skipping large macro-blocks of empty space wherever
 * possible. Then, once the ray opacity has saturated, the shader introduces
 * view dependence by running a small-MLP per ray. The MLP takes as input the
 * accumulated color, feature vectors as well as a positionally encoded
 * view-direction vector.
 *
 * @param {!Object} scene_params
 * @param {!THREE.Texture} alphaVolumeTexture
 * @param {!THREE.Texture} rgbVolumeTexture
 * @param {!THREE.Texture} featureVolumeTexture
 * @param {!THREE.Texture} atlasIndexTexture
 * @param {!THREE.Vector3} minPosition
 * @param {number} gridWidth
 * @param {number} gridHeight
 * @param {number} gridDepth
 * @param {number} blockSize
 * @param {number} voxelSize
 * @param {number} atlasWidth
 * @param {number} atlasHeight
 * @param {number} atlasDepth
 * @return {!THREE.Material}
 */

function createRayMarchMaterial(
  scene_params,
  alphaVolumeTexture,
  rgbVolumeTexture,
  featureVolumeTexture,
  atlasIndexTexture,
  minPosition,
  gridWidth,
  gridHeight,
  gridDepth,
  blockSize,
  voxelSize,
  atlasWidth,
  atlasHeight,
  atlasDepth
) {
  let weightsTexZero = null;
  let weightsTexOne = null;
  let weightsTexTwo = null;
  let fragmentShaderSource = rayMarchFragmentShaderHeader;
  if (scene_params["diffuse"]) {
    fragmentShaderSource += dummyViewDependenceShaderFunctions;
    weightsTexZero = createNetworkWeightTexture(null);
    weightsTexOne = createNetworkWeightTexture(null);
    weightsTexTwo = createNetworkWeightTexture(null);
  } else {
    fragmentShaderSource += createViewDependenceFunctions(scene_params);
    weightsTexZero = createNetworkWeightTexture(scene_params["0_weights"]);
    weightsTexOne = createNetworkWeightTexture(scene_params["1_weights"]);
    weightsTexTwo = createNetworkWeightTexture(scene_params["2_weights"]);
  }
  fragmentShaderSource += rayMarchFragmentShaderBody;

  // Now pass all the 3D textures as uniforms to the shader.
  let worldspace_R_opengl = new THREE.Matrix3();
  let M_dict = scene_params["worldspace_T_opengl"];
  worldspace_R_opengl["set"](
    M_dict[0][0],
    M_dict[0][1],
    M_dict[0][2],
    M_dict[1][0],
    M_dict[1][1],
    M_dict[1][2],
    M_dict[2][0],
    M_dict[2][1],
    M_dict[2][2]
  );

  let ndc_f = 755.644059435;
  let ndc_w = 1006.0;
  let ndc_h = 756.0;
  if ("input_focal" in scene_params) {
    ndc_f = parseFloat(scene_params["input_focal"]);
    ndc_w = parseFloat(scene_params["input_width"]);
    ndc_h = parseFloat(scene_params["input_height"]);
  }

  const material = new THREE.ShaderMaterial({
    uniforms: {
      transVar: { value: transVar },
      ringTrans: { value: ringTrans },
      mapAlpha: { value: alphaVolumeTexture },
      mapColor: { value: rgbVolumeTexture },
      mapFeatures: { value: featureVolumeTexture },
      mapIndex: { value: atlasIndexTexture },
      displayMode: { value: gDisplayMode - 0 },
      ndc: { value: 0 },
      nearPlane: { value: 0.33 },
      blockSize: { value: blockSize },
      voxelSize: { value: voxelSize },
      minPosition: { value: minPosition },
      ndc_f: { value: ndc_f },
      ndc_w: { value: ndc_w },
      ndc_h: { value: ndc_h },
      weightsZero: { value: weightsTexZero },
      weightsOne: { value: weightsTexOne },
      weightsTwo: { value: weightsTexTwo },
      world_T_clip: { value: new THREE.Matrix4() },
      worldspace_R_opengl: { value: worldspace_R_opengl },
      gridSize: { value: new THREE.Vector3(gridWidth, gridHeight, gridDepth) },
      atlasSize: {
        value: new THREE.Vector3(atlasWidth, atlasHeight, atlasDepth),
      },
    },
    vertexShader: rayMarchVertexShader,
    fragmentShader: fragmentShaderSource,
    vertexColors: true,
  });

  material.side = THREE.DoubleSide;
  material.depthTest = false;
  return material;
}
