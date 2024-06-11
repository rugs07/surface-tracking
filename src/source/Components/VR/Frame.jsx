import React, { useRef } from "react";
import { Cylinder, useHelper } from "@react-three/drei";
import { RectAreaLightHelper } from "three/addons/helpers/RectAreaLightHelper.js";

const Frame = ({ position, size }) => {
  const rectAreaLight = useRef();
  useHelper(rectAreaLight, RectAreaLightHelper);
  return (
    <>
      {/* Tube Geometry */}
      <Cylinder
        rotation={[0, Math.PI / 2, 0]}
        position={position}
        args={[size / 100, size / 100, size * 2.37, size * 100]}
      >
        <meshStandardMaterial
          opacity={1}
          roughness={0}
          metalness={0.999}
          emissive="grey"
          emissiveIntensity={1}
        />
      </Cylinder>
    </>
  );
};

export default Frame;
