/* eslint-disable react/no-unknown-property */
import React, { useRef } from "react";
import Frame from "./Frame";
import Lid from "./Lid";
import Bulb from "./Bulb";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import Glass from "./Glass";

const Box = ({ size = 1.25 }) => {
  const camera = useThree(({ camera }) => {
    return camera;
  });

  const rectAreaLightRef1 = useRef();
  const rectAreaLightRef2 = useRef();
  const rectAreaLightRef3 = useRef();
  const rectAreaLightRef4 = useRef();
  const directionalLightRef = useRef();
  const directionalLightRef2 = useRef();

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

    directionalLightRef.current.position.copy(camera.position);
    directionalLightRef.current.position
      .add(perpendicularVector)
      .multiply(new THREE.Vector3(-1, -0.1, -1));

    directionalLightRef2.current.position.copy(camera.position);
    directionalLightRef2.current.position
      .sub(perpendicularVector)
      .multiply(new THREE.Vector3(-1, -0.1, -1));
  });
  return (
    <>
      {/* Glass showcase glass Implementation */}
      {/* lid */}
      <ambientLight />
      <rectAreaLight
        ref={rectAreaLightRef1}
        width={0.16}
        height={size * 1.8}
        intensity={1000}
        position={[size, 0, -size]}
        color={"#F8F8FF"}
        rotation={[0, Math.PI / 1.5, 0]}
      />
      <rectAreaLight
        ref={rectAreaLightRef2}
        width={0.16}
        height={size * 1.8}
        intensity={1000}
        position={[-size, 0, -size]}
        color={"#F8F8FF"}
        rotation={[0, Math.PI / -1.5, 0]}
      />
      <rectAreaLight
        ref={rectAreaLightRef3}
        width={0.16}
        height={size * 1.8}
        intensity={1000}
        position={[size, 0, size]}
        color={"#F8F8FF"}
        rotation={[0, Math.PI / 3.5, 0]}
      />
      <rectAreaLight
        ref={rectAreaLightRef4}
        width={0.16}
        height={size * 1.8}
        intensity={1000}
        position={[-size, 0, size]}
        color={"#F8F8FF"}
        rotation={[0, Math.PI / -3, 0]}
      />
      <Lid
        name={"lid"}
        size={[size * 2, size * 0.2, size * 2]}
        position={[0, size * 1.096, 0]}
        color={"#090A0B"}
        opacity={1}
        transmission={0.7}
        roughness={0.7}
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

      {/* Glass */}
      <Glass
        name={"glass"}
        size={size}
        position={[0, 0, 0]}
        color={"white"}
        opacity={0.4}
      >
        <Lid
          name={"lid"}
          size={[size * 2, size * 0.2, size * 2]}
          position={[0, -size * 1.096, 0]}
          color={"#090A0B"}
          opacity={1}
          transmission={0}
        />
        <Frame size={size} position={[-size, 0, size]} />
        <Frame size={size} position={[size, 0, size]} />
        <Frame size={size} position={[size, 0, -size]} />
        <Frame size={size} position={[-size, 0, -size]} />
      </Glass>
      <group position={[0, 0.5, 0]}>
        <directionalLight
          ref={directionalLightRef}
          intensity={2.5}
          castShadow={false}
          color="white"
          scale={1}
        />
        <directionalLight
          ref={directionalLightRef2}
          intensity={2.5}
          color="white"
          castShadow={false}
          scale={1}
        />
      </group>
    </>
  );
};

export default Box;
