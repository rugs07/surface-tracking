import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import React, { Suspense, lazy, useRef, forwardRef, useEffect } from "react";
import Lid from "./Lid";
import Glass from "./Glass";
import Frame from "./Frame";
import Bulb from "./Bulb";
import blackGradientTexture from "./blackGradient.jpg";

// const Glass = lazy(() => import("./Glass"));
// const Lid = lazy(() => import("./Lid"));
// const Bulb = lazy(() => import("./Bulb"));
// const Frame = lazy(() => import("./Frame"));

const textureLoader = new THREE.TextureLoader();

// Load textures for top and bottom
const texture = textureLoader.load(blackGradientTexture);
texture.minFilter = THREE.LinearMipMapLinearFilter;
texture.magFilter = THREE.LinearFilter;

const Box = ({ size }) => {
  const camera = useThree(({ camera }) => {
    return camera;
  });
  const directionalLightRef = useRef();
  const directionalLightRef2 = useRef();

  //useBoxOpen(isClicked);

  // correct working
  useFrame((state) => {
    const lookDirection = new THREE.Vector3();
    camera.getWorldDirection(lookDirection);
    lookDirection.normalize();

    const euler = new THREE.Euler(0, 0.1, 0);

    // Create a perpendicular vector using the camera's up vector (usually Y-axis)
    const perpendicularVector = new THREE.Vector3();
    perpendicularVector
      .copy(camera.up)
      .cross(lookDirection)
      .add(new THREE.Vector3(0, 0, 0));
    perpendicularVector.normalize().applyEuler(euler);

    directionalLightRef?.current?.position.copy(camera.position);
    directionalLightRef?.current?.position
      .add(perpendicularVector)
      .multiply(new THREE.Vector3(-1, -0.6, -1));

    directionalLightRef2?.current?.position.copy(camera.position);
    directionalLightRef2?.current?.position
      .sub(perpendicularVector)
      .multiply(new THREE.Vector3(-1, -0.6, -1));
  });

  return (
    <>
      <Suspense fallback={null}>
        {/* <ambientLight intensity={1} /> */}
        <Lid
          name={"lid"}
          // isClicked={isClicked}
          size={[size * 2, size * 0.2, size * 2]}
          position={[0, size * 1.096, 0]}
          bottomColor={"white"}
          topTransmission={1}
          bottomTransmission={0.4}
          topRougness={0}
          bottomRoughness={1}
          topMetalness={1}
          bottomMetalness={0.4}
          texture={texture}
        >
          <Bulb size={size * 0.12} position={[0, -(size * 0.05), size * 0.5]} />
          <Bulb
            size={size * 0.12}
            position={[0, -(size * 0.05), -(size * 0.5)]}
          />

          <Bulb
            size={size * 0.12}
            position={[-(size * 0.5), -(size * 0.05), 0]}
          />
          <Bulb size={size * 0.12} position={[size * 0.5, -(size * 0.05), 0]} />
        </Lid>
        <Lid
          name={"lid"}
          // isClicked={isClicked}
          size={[size * 2, size * 0.2, size * 2]}
          position={[0, -size * 1.096, 0]}
          topColor={"white"}
          topTransmission={0.5}
          bottomTransmission={1}
          topRougness={1}
          bottomRoughness={1}
          topMetalness={0.5}
          bottomMetalness={0}
          texture={texture}
        />

        {/* Glass */}
        <Glass
          name={"glass"}
          size={size}
          position={[0, 0, 0]}
          color={"white"}
          opacity={0.3}
        >
          <Frame size={size} position={[-size, 0, size]} />
          <Frame size={size} position={[size, 0, size]} />
          <Frame size={size} position={[size, 0, -size]} />
          <Frame size={size} position={[-size, 0, -size]} />
        </Glass>

        {/* Implementation of Enabling auto rotate feature */}

        <directionalLight
          ref={directionalLightRef}
          intensity={0.5}
          castShadow={false}
          color="white"
          scale={1}
        />
        <directionalLight
          ref={directionalLightRef2}
          intensity={0.5}
          color="white"
          castShadow={false}
          scale={1}
        />
      </Suspense>
    </>
  );
};

export default Box;
