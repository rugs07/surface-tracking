import React, { forwardRef, useRef } from "react";
import { Cylinder, Detailed, useHelper } from "@react-three/drei";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper";

const Frame = ({ position, size }) => {
  const rectAreaLight = useRef();
  useHelper(rectAreaLight, RectAreaLightHelper);

  return (
    <>
      {/* Tube Geometry */}
      <Detailed distances={[2, 3]}>
        <Cylinder
          rotation={[0, Math.PI / 2, 0]}
          position={position}
          args={[size / 100, size / 100, size * 2.37, size * 5]}
        >
          <meshStandardMaterial
            opacity={1}
            roughness={0}
            metalness={1}
            emissive="grey"
            emissiveIntensity={1}
          />
        </Cylinder>
        <Cylinder
          rotation={[0, Math.PI / 2, 0]}
          position={position}
          args={[size / 100, size / 100, size * 2.37, size * 100]}
        >
          <meshStandardMaterial
            opacity={1}
            roughness={0}
            metalness={1}
            emissive="grey"
            emissiveIntensity={1}
          />
        </Cylinder>
      </Detailed>
    </>
  );
};

export default Frame;
