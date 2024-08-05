import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Splat } from "@react-three/drei";

const SplatElement = ({ position }) => {
  return (
    <Splat
      url="https://gaussian-splatting-production.s3.ap-south-1.amazonaws.com/natraj/natraj.splat"
      scale={[0.5, 0.5, 0.5]}
      rotation={[0, 0, 0]}
      position={position}
      visible={true}
    />
  );
};

const ARComponent = () => {
  const [session, setSession] = useState(null);
  const canvasRef = useRef();
  const videoRef = useRef();
  const [isDebugMode, setIsDebugMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [hitPosition, setHitPosition] = useState(null); // State to hold the hit position

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
        requiredFeatures: ["local-floor", "hit-test"],
      });
      console.log("AR session started successfully.");

      const canvas = canvasRef.current;
      if (!canvas) {
        throw new Error("Canvas reference is not defined.");
      }

      const gl = canvas.getContext("webgl", { xrCompatible: true });
      if (!gl) {
        throw new Error("WebGL context is not available.");
      }

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

      // Access the camera feed
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
        },
      });
      videoRef.current.srcObject = stream;
      videoRef.current.play();

      // Start hit testing
      const hitTestSource = await session.requestHitTestSource({ space: referenceSpace });
      const hitTestSourceSet = new Set();
      hitTestSourceSet.add(hitTestSource);

      const hitTest = () => {
        if (session) {
          session.requestHitTestSourceForTransientInput(hitTestSource).then((results) => {
            if (results.length > 0) {
              const hit = results[0];
              const position = new THREE.Vector3().fromArray(hit.getPose(referenceSpace).transform.position);
              setHitPosition(position);
            }
          });
        }
      };

      // Update hit testing in the animation loop
      session.requestAnimationFrame(() => {
        hitTest();
      });

    } catch (error) {
      setIsDebugMode(true);
      setErrorMessage(`Error starting AR session: ${error.message}`);
      console.error(errorMessage);
    }
  };

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <button onClick={startARSession}>Start AR Session</button>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -1000, // Ensure it is behind other elements
          objectFit: "cover",
        }}
      />
      {isDebugMode && (
        <div style={{ position: "absolute", top: 0, left: 0, color: "white" }}>
          <p>{errorMessage}</p>
        </div>
      )}
      <canvas ref={canvasRef} style={{ display: 'none' }} /> {/* Hidden canvas for WebGL context */}
      {session && hitPosition && (
        <Canvas>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <SplatElement position={hitPosition} /> {/* Render the model at the hit position */}
        </Canvas>
      )}
    </div>
  );
};

export default ARComponent;
