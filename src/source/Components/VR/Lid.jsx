import * as THREE from "three";
import React, { forwardRef } from "react";

const Lid = ({
  size,
  position,
  name,
  children,
  topColor = "black",
  bottomColor = "black",
  topTransmission,
  bottomTransmission,
  topRoughness,
  bottomRoughness,
  topMetalness,
  bottomMetalness,
  texture,
}) => {
  const geometry = new THREE.BoxGeometry(size[0], size[1], size[2], 1, 1, 1);

  // Define material for the top face
  const materials = [
    new THREE.MeshPhysicalMaterial({ color: "black", opacity: 1 }),
    new THREE.MeshPhysicalMaterial({ color: "black", opacity: 1 }),
    new THREE.MeshPhysicalMaterial({
      color: topColor,
      map: texture,
      roughness: topRoughness,
      opacity: 0,
      transmission: topTransmission,
      metalness: topMetalness,
    }),
    new THREE.MeshPhysicalMaterial({
      color: bottomColor,
      map: texture,
      roughness: bottomRoughness,
      opacity: 0,
      transmission: bottomTransmission,
      metalness: bottomMetalness,
    }),
    new THREE.MeshPhysicalMaterial({
      color: "black",
      opacity: 1,
    }),
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
