import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { Splat } from "@react-three/drei";
import { XRManager } from '../XRManager'; // Import your XRManager
import { HitTestManager } from '../HitTestmanager'; // Import your HitTestManager

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
  const [hitPosition, setHitPosition] = useState(null); // State to hold the hit position
  const canvasRef = useRef();
  const videoRef = useRef();
  const [errorMessage, setErrorMessage] = useState(""); // State for error messages
  const clock = new THREE.Clock();
  let hitTestManager;
  let hitTestActive = true;

  const startARSession = async () => {
    if (!navigator.xr) {
      setErrorMessage("WebXR not supported on this device/browser.");
      return;
    }

    try {
      console.log("Requesting AR session...");
      const session = await navigator.xr.requestSession("immersive-ar", {
        requiredFeatures: ["local-floor", "hit-test"],
      });
      console.log("AR session started successfully.");
      setSession(session);

      const canvas = canvasRef.current;
      const gl = canvas.getContext("webgl", { xrCompatible: true });
      const renderer = new THREE.WebGLRenderer({ canvas, context: gl });
      renderer.xr.enabled = true;

      const xrGLLayer = new XRWebGLLayer(session, gl);
      session.updateRenderState({ baseLayer: xrGLLayer });

      // Set up the reference space
      const referenceSpace = await session.requestReferenceSpace("local-floor");

      // Access the camera feed
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
        },
      });
      videoRef.current.srcObject = stream;
      videoRef.current.play();

      // Initialize HitTestManager
      hitTestManager = HitTestManager({ xrSession: session });

      // Start the animation loop
      session.requestAnimationFrame(() => {
        renderer.setAnimationLoop((timestamp, frame) => {
          // Handle hit testing
          if (frame && hitTestActive) {
            if (!hitTestManager.hitTestSourceRequested) {
              hitTestManager.requestHitTestSource();
            }
            const hitPoseTransformMatrix = hitTestManager.hitTestSource ? hitTestManager.getHitTestResults(frame) : [];
            if (hitPoseTransformMatrix.length > 0) {
              const hit = hitPoseTransformMatrix[0];
              const position = new THREE.Vector3().fromArray(hit.getPose(referenceSpace).transform.position);
              setHitPosition(position);
            } else {
              setHitPosition(null); // No hit detected
            }
          }

          // Render the scene
          renderer.render(renderer.xr.getSession().renderState.baseLayer, referenceSpace);
        });
      });

      session.addEventListener("end", () => {
        setSession(null);
      });

    } catch (error) {
      setErrorMessage(`Error starting AR session: ${error.message}`);
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
      {errorMessage && (
        <div style={{
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          color: "white",
          padding: "20px",
          borderRadius: "10px",
          zIndex: 1000,
        }}>
          <p>{errorMessage}</p>
          <button onClick={() => setErrorMessage("")} style={{ marginTop: "10px", padding: "5px 10px", background: "white", color: "black", border: "none", borderRadius: "5px" }}>
            Close
          </button>
        </div>
      )}
      <canvas ref={canvasRef} style={{ display: "none" }} /> {/* Hidden canvas for WebGL context */}
      {session && hitPosition && (
        <Canvas style={{ width: "100vw", height: "100vh", position: "absolute" }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <SplatElement position={hitPosition} /> {/* Render the model at the hit position */}
        </Canvas>
      )}
    </div>
  );
};

export default ARComponent;
