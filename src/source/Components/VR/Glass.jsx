import { useThree } from "@react-three/fiber";
import { forwardRef, useEffect } from "react";
import * as THREE from "three";

const Glass = ({ size = 1.25, position, name, children, opacity = 0.4 }) => {
  const vertices = new Float32Array([
    // Front
    -size,
    -size,
    -size,
    size,
    -size,
    -size,
    -size,
    size,
    -size,
    size,
    size,
    -size,
    // Back
    -size,
    -size,
    size,
    -size,
    size,
    size,
    size,
    -size,
    size,
    size,
    size,
    size,
    // Left
    -size,
    -size,
    -size,
    -size,
    size,
    -size,
    -size,
    -size,
    size,
    -size,
    size,
    size,
    // Right
    size,
    -size,
    -size,
    size,
    -size,
    size,
    size,
    size,
    -size,
    size,
    size,
    size,
  ]);

  // Define indices for the box without the top face
  const indices = new Uint16Array([
    0,
    1,
    2,
    2,
    1,
    3, // Front
    4,
    5,
    6,
    6,
    5,
    7, // Back
    8,
    9,
    10,
    10,
    9,
    11, // Left
    12,
    13,
    14,
    14,
    13,
    15, // Right
  ]);

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
  geometry.setIndex(new THREE.BufferAttribute(indices, 1));

  // Calculate Normals for lighting
  geometry.computeVertexNormals();

  return (
    <>
      <mesh name={name} position={position} geometry={geometry}>
        {children}

        <meshPhysicalMaterial
          color={"white"}
          opacity={opacity} //0.2 for white bg and 0.4 for black bg
          transparent={true}
          roughness={0.2}
          metalness={1}
          transmission={0.1}
          reflectivity={0.1}
          ior={1.5}
        />
      </mesh>
    </>
  );
};

export default Glass;
