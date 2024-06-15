import * as THREE from "three";

const Lid = ({
  size,
  position,
  name,
  children,
  topColor = "black",
  bottomColor = "black",
}) => {
  const geometry = new THREE.BoxGeometry(size[0], size[1], size[2], 1, 1, 1);

  // Define material for the top face
  const materials = [
    new THREE.MeshPhysicalMaterial({
      color: "black",
      opacity: 1,
      // transparent: true,
    }), // Left
    new THREE.MeshPhysicalMaterial({
      color: "black",
      opacity: 1,
    }), // Right
    new THREE.MeshPhysicalMaterial({
      color: topColor,
      roughness: 0.8,
      opacity: 0.2,
      transmission: 0,
      metalness: 0.998,
    }), // Top
    new THREE.MeshPhysicalMaterial({
      color: bottomColor,
      roughness: 1,
      opacity: 0.2,
      transmission: 0,
      metalness: 0.999,
    }), // Bottom
    new THREE.MeshPhysicalMaterial({
      color: "black",
      opacity: 1,
    }), // Front
    new THREE.MeshPhysicalMaterial({
      color: "black",
      opacity: 1,
    }), // Back
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
