import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, extend, useFrame } from "@react-three/fiber";
import { Splat } from "@react-three/drei";

const ARComponent = () => {
  const [session, setSession] = useState(null);
  const canvasRef = useRef();
  const sceneRef = useRef(new THREE.Scene());
  const cameraRef = useRef(new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000));

  useEffect(() => {
    const startARSession = async () => {
      if (!navigator.xr) {
        alert("WebXR not supported on this device/browser.");
        return;
      }

      try {
        const session = await navigator.xr.requestSession("immersive-ar", {
          requiredFeatures: ["local-floor"],
        });

        const canvas = canvasRef.current;
        const gl = canvas.getContext("webgl", { xrCompatible: true });
        const renderer = new THREE.WebGLRenderer({ canvas, context: gl });
        renderer.xr.enabled = true;

        const xrGLLayer = new XRWebGLLayer(session, gl);
        session.updateRenderState({ baseLayer: xrGLLayer });

        const referenceSpace = await session.requestReferenceSpace("local-floor");
        setSession(session);

        // Initialize the AR scene and camera
        const scene = sceneRef.current;
        const camera = cameraRef.current;

        // Add Splat to the scene
        const splat = new THREE.Object3D();
        scene.add(splat);

        const SplatElement = () => (
          <Splat
            src="https://gaussian-splatting-production.s3.ap-south-1.amazonaws.com/natraj/natraj.splat"
            scale={[0.5, 0.5, 0.5]}
            rotation={[0, 0, 0]}
            visible={true}
          />
        );

        session.requestAnimationFrame(() => {
          renderer.setAnimationLoop(() => {
            renderer.render(scene, camera);
          });
        });

        session.addEventListener("end", () => {
          setSession(null);
        });

      } catch (error) {
        alert(`Error starting AR session: ${error.message}`);
      }
    };

    if (!session) {
      startARSession();
    }

  }, [session]);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />
      {session && (
        <Canvas>
          <SplatElement />
        </Canvas>
      )}
    </div>
  );
};

export default ARComponent;
