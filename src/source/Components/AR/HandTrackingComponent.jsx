import React, { useEffect, useRef, useState, useMemo } from "react";
import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";
import { Canvas } from "@react-three/fiber";
import { Splat } from "@react-three/drei";
import FPSStats from "react-fps-stats";
import { ARFunctions } from "../../context/ARContext";
import { useNavigate } from "react-router-dom";
import Showhandscreen from "./Showhandscreen";
import { useVariables } from "../../context/variableContext";
import ErrorBoundary from "../Errorboundary/ErrorBoundary";
import { useJewels } from "../../context/JewelsContext";

const HandTrackingComponent = () => {
  const videoRef = useRef(null);
  const prevFrameRef = useRef(null);
  const isMobile = window.innerWidth <= 768;
  const { jewelsList } = useJewels();
  const { translateRotateMesh } = ARFunctions();
  const {
    jewelType,
    YRDelta,
    XRDelta,
    ZRDelta,
    wristZoom,
    setHandLabels,
  } = useVariables();
  const canvasRef = useRef(null);
  const [handPresence, setHandPresence] = useState(false);
  const navigate = useNavigate();

  const selectedJewel = useMemo(() => JSON.parse(
    sessionStorage.getItem("selectedJewel") || "{}"
  ), []);

  const url = useMemo(() => `https://gaussian-splatting-production.s3.ap-south-1.amazonaws.com/${selectedJewel.name}/${selectedJewel.name}.splat`, [selectedJewel]);

  const handleStopAR = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
    navigate("/VR");
  };

  useEffect(() => {
    let handLandmarker;
    let animationFrameId;
    let lastProcessTime = 0;

    const initializeHandDetection = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );
        handLandmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
            delegate: "GPU",
          },
          numHands: 1,
          runningMode: "VIDEO",
        });
        detectHands();
      } catch (error) {
        console.error("Error initializing hand detection:", error);
      }
    };

    const smoothLandmarks = (landmarks) => {
      const baseSmoothingFactor = isMobile ? 0.8 : 0.9;
      const jitterThreshold = 0.001; // Adjust this value to control jitter sensitivity

      if (!prevFrameRef.current) {
        prevFrameRef.current = landmarks;
        return landmarks;
      }

      const smoothedLandmarks = landmarks.map((point, index) => {
        const prev = prevFrameRef.current[index];
        const delta = {
          x: point.x - prev.x,
          y: point.y - prev.y,
          z: point.z - prev.z
        };

        const distanceSquared = delta.x ** 2 + delta.y ** 2 + delta.z ** 2;

        let smoothingFactor;
        if (distanceSquared < jitterThreshold) {
          // If movement is very small, apply strong smoothing
          smoothingFactor = 0.85;
        } else {
          // For larger movements, use the base smoothing factor
          smoothingFactor = baseSmoothingFactor;
        }

        const smoothed = {
          x: smoothingFactor * prev.x + (1 - smoothingFactor) * point.x,
          y: smoothingFactor * prev.y + (1 - smoothingFactor) * point.y,
          z: smoothingFactor * prev.z + (1 - smoothingFactor) * point.z
        };

        return smoothed;
      });

      prevFrameRef.current = smoothedLandmarks;
      return smoothedLandmarks;
    };

    const detectHands = async () => {
      if (videoRef.current?.readyState >= 2) {
        const currentTime = performance.now();
        if (currentTime - lastProcessTime >= 30) { // Aim for ~30 FPS
          lastProcessTime = currentTime;
          const detections = handLandmarker.detectForVideo(videoRef.current, currentTime);
          setHandPresence(detections.handednesses.length > 0);

          if (detections.landmarks?.[0]) {
            const smoothedLandmarks = smoothLandmarks(detections.landmarks[0]);
            console.log(smoothedLandmarks, detections.landmarks[0], "warrr");
            translateRotateMesh(smoothedLandmarks, detections.handednesses[0][0].displayName, false, canvasRef.current);
            setHandLabels(detections.handednesses[0][0].displayName);
          }
        }
      }
      animationFrameId = requestAnimationFrame(detectHands);
    };

    const startWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } }
        });
        videoRef.current.srcObject = stream;
        await initializeHandDetection();
      } catch (error) {
        console.error("Error accessing webcam:", error);
        alert('Error accessing web cam');
      }
    };

    startWebcam();

    return () => {
      videoRef.current?.srcObject?.getTracks().forEach(track => track.stop());
      handLandmarker?.close();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}>
      {!handPresence && <Showhandscreen />}
      {!handPresence && (
        <button className="stopArBtn" onClick={handleStopAR}>
          STOP AR
        </button>
      )}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{
          position: "absolute",
          transform: "rotateY(180deg)",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: "100%",
          height: "100%",
          zIndex: "-1000",
          objectFit: "cover",
        }}
      />
      <FPSStats />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transform: isMobile ? "none" : "rotateY(180deg)"
        }}
      >
        <ErrorBoundary>
          <Canvas
            id="gsplatCanvas"
            ref={canvasRef}
            shadows
            gl={{ localClippingEnabled: true }}
            camera={{
              fov: 46,
              position: [0, 1.5, 4.5],
              near: 0.093,
              far: 4.75,
            }}
            style={{ width: "100vw", height: "100vh" }}
          >
            <Splat
              src={url}
              rotation={[XRDelta, YRDelta, ZRDelta]}
              scale={[wristZoom, wristZoom, wristZoom]}
            // scale={0.5}
            // position={[0, 0, 0]}
            />
          </Canvas>
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default HandTrackingComponent;