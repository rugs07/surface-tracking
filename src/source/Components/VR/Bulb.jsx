// Bulb.js
import React, { useRef } from "react";
import { Cylinder, useHelper } from "@react-three/drei";
import { SpotLightHelper } from "three";

const Bulb = ({ position, size }) => {
  const spotLightRef = useRef();
  // useHelper(spotLightRef, SpotLightHelper);

  return (
    <>
      <spotLight
        ref={spotLightRef}
        //castShadow={true}
        angle={Math.PI * 1.2}
        position={position}
        intensity={0.4}
        // penumbra={1}
      />
      <Cylinder args={[size, size, size + 0.02, 32]} position={position}>
        {/* Array of materials: [side, top, bottom] */}
        <meshStandardMaterial attach="material-0" color="white" /> {/* side */}
        <meshStandardMaterial attach="material-1" color="black" /> {/* top */}
        <meshStandardMaterial attach="material-2" color="white" />
        {/* bottom */}
      </Cylinder>
    </>
  );
};

export default Bulb;
