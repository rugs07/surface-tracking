import { useHelper, useTexture } from "@react-three/drei";
import { DoubleSide } from "three";

// import glass from "./glass.jpg";
import { useRef } from "react";

const Lid = ({
  size,
  position,
  color = "black",
  roughness = 1,
  name,
  children,
  opacity = 1,
  transmission,
}) => {
  // const texture = useTexture(glass);

  return (
    <>
      <mesh name={name} position={position}>
        {children}
        <boxGeometry args={size} />
        <meshPhysicalMaterial
          // map={texture}
          transmission={transmission}
          reflectivity={1}
          color={color}
          opacity={opacity}
          roughness={roughness}
        />
      </mesh>
    </>
  );
};

export default Lid;
