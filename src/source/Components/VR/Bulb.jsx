// Bulb.js
import React, { useRef } from "react";
import { Cylinder } from "@react-three/drei";

const Bulb = ({ position, size }) => {
  const spotLightRef = useRef();

  return (
    <>
      <spotLight
        ref={spotLightRef}
        angle={Math.PI * 1.2}
        position={position}
        intensity={0.2}
      />
      <Cylinder args={[size, size, size + 0.02, 8]} position={position}>
        {/* Array of materials: [side, top, bottom] */}
        <meshStandardMaterial attach="material-0" color="white" />
        <meshStandardMaterial attach="material-2" color="white" />
      </Cylinder>
    </>
  );
};

export default Bulb;
