import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Splat } from "@react-three/drei";

const SplatElement = () => {
  return (
    <Splat
      url="https://gaussian-splatting-production.s3.ap-south-1.amazonaws.com/natraj/natraj.splat"
      scale={[0.5, 0.5, 0.5]}
      rotation={[0, 0, 0]}
      visible={true}
    />
  );
};

const ARComponent = () => {
  const [session, setSession] = useState(null);
  const canvasRef = useRef();

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

      session.requestAnimationFrame(() => {
        renderer.setAnimationLoop(() => {
          renderer.render(renderer.xr.getSession().renderState.baseLayer, referenceSpace);
        });
      });

      session.addEventListener("end", () => {
        setSession(null);
      });

    } catch (error) {
      alert(`Error starting AR session: ${error.message}`);
    }
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <button onClick={startARSession}>Start AR Session</button>
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />
      {session && (
        <Canvas>
          <ambientLight intensity={0.5} /> {/* Add ambient light */}
          <pointLight position={[10, 10, 10]} /> {/* Add a point light */}
          <SplatElement />
        </Canvas>
      )}
    </div>
  );
};

export default ARComponent;
