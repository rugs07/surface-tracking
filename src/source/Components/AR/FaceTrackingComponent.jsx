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
  const [isDebugMode, setIsDebugMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const startARSession = async () => {
    if (!navigator.xr) {
      setIsDebugMode(true);
      setErrorMessage("WebXR not supported on this device/browser.");
      console.error(errorMessage);
      return;
    }

    try {
      console.log("Requesting AR session...");
      const session = await navigator.xr.requestSession("immersive-ar", {
        requiredFeatures: ["local-floor"],
      });
      console.log("AR session started successfully.");

      const canvas = canvasRef.current;
      console.log("Canvas element:", canvas);

      const gl = canvas.getContext("webgl", { xrCompatible: true });
      console.log("WebGL context:", gl);

      const renderer = new THREE.WebGLRenderer({ canvas, context: gl });
      console.log("Three.js renderer:", renderer);
      renderer.xr.enabled = true;

      const xrGLLayer = new XRWebGLLayer(session, gl);
      console.log("XRWebGLLayer:", xrGLLayer);
      session.updateRenderState({ baseLayer: xrGLLayer });

      const referenceSpace = await session.requestReferenceSpace("local-floor");
      console.log("Reference space:", referenceSpace);
      setSession(session);

      session.requestAnimationFrame(() => {
        console.log("Requesting animation frame...");
        renderer.setAnimationLoop(() => {
          console.log("Rendering frame...");
          renderer.render(renderer.xr.getSession().renderState.baseLayer, referenceSpace);
        });
      });

      session.addEventListener("end", () => {
        console.log("AR session ended.");
        setSession(null);
      });

    } catch (error) {
      setIsDebugMode(true);
      setErrorMessage(`Error starting AR session: ${error.message}`);
      console.error(errorMessage);
    }
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <button onClick={startARSession}>Start AR Session</button>
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />
      {isDebugMode && (
        <div style={{ position: "absolute", top: 0, left: 0, color: "white" }}>
          <p>{errorMessage}</p>
        </div>
      )}
      {session && (
        <Canvas>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <SplatElement />
        </Canvas>
      )}
    </div>
  );
};

export default ARComponent;
