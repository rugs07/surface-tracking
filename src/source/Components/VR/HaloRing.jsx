import * as THREE from "three";

const HaloRing = () => {
  return (
    <>
      <mesh position={[0, -0.1, 0]} rotation={[4.7, 0, 0]}>
        <ringGeometry args={[0.55, 0.7, 32]} />
        <meshBasicMaterial
          shadowSide={1}
          color={0xffffff}
          side={THREE.DoubleSide}
        />
      </mesh>
    </>
  );
};

export default HaloRing;
