import React, { forwardRef, lazy, useEffect, useRef, useState } from "react";
import { Splat, useHelper } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { SpotLightHelper } from "three";

const SplatComponent = lazy(() =>
  import("@react-three/drei").then((module) => ({ default: module.Splat }))
);

const RotatingSplat = ({ url, isHovered, setIsHovered, scale, rotation }) => {
  const [position, setPosition] = useState([0, 0, 0]);
  const spotLightRef = useRef();

  const timeRef = useRef(0); // To track elapsed time

  useEffect(() => {
    timeRef.current = 0; // Reset time on component mount or update
  }, []);

  useFrame(() => {
    if (!isHovered) {
      // Update time
      timeRef.current += 0.02; // Adjust speed of oscillation (lower for slower)

      // Calculate new y position based on sine function
      const newY = Math.sin(timeRef.current) * 0.1; // Adjust amplitude (higher for larger movement)

      // Update position state with new y value
      setPosition([position[0], newY, position[2]]);

      // Update spotlight shadow map size (assuming shadow is enabled)
      if (spotLightRef.current) {
        spotLightRef.current.position.set(position[0], newY + 1, position[2]);
      }
    }
  });

  // useHelper(spotLightRef, SpotLightHelper, "lightblue");

  return (
    <>
      <spotLight
        ref={spotLightRef}
        color={"white"}
        intensity={-1}
        // position={[0, 0, 0]}
        angle={0.25}
        penumbra={1}
        castShadow={true}
      />

      <Splat
        scale={scale}
        position={position}
        onPointerEnter={(e) => {
          e.stopPropagation();
          setIsHovered(true);
        }}
        onPointerLeave={(e) => {
          setIsHovered(false);
        }}
        src={url}
      />
    </>
  );
};

export default RotatingSplat;
