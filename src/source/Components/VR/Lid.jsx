import * as THREE from "three";
import React, { forwardRef } from "react";

const Lid = (
  { size, position, name, children, topColor = "black", bottomColor = "black" },
  ref
) => {
  const geometry = new THREE.BoxGeometry(size[0], size[1], size[2], 1, 1, 1);

  // Define material for the top face
  const materials = [
    new THREE.MeshPhysicalMaterial({ color: "black", opacity: 1 }),
    new THREE.MeshPhysicalMaterial({ color: "black", opacity: 1 }),
    new THREE.MeshPhysicalMaterial({
      color: topColor,
      roughness: 0.8,
      opacity: 0.2,
      transmission: 0,
      metalness: 0.998,
    }),
    new THREE.MeshPhysicalMaterial({
      color: bottomColor,
      roughness: 0.8,
      opacity: 0.2,
      transmission: 0,
      metalness: 0.84,
    }),
    new THREE.MeshPhysicalMaterial({ color: "black", opacity: 1 }),
    new THREE.MeshPhysicalMaterial({ color: "black", opacity: 1 }),
  ];

  return (
    <>
      <mesh
        name={name}
        position={position}
        geometry={geometry}
        material={materials}
      >
        {children}
      </mesh>
    </>
  );
};

export default Lid;
