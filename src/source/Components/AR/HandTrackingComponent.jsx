import React, { useEffect, useRef, useState } from "react";
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
  const [prevFrame, setPrevFrame] = useState();
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
  const selectedJewel = JSON.parse(
    sessionStorage.getItem("selectedJewel") || "{}"
  );

  const url = `https://gaussian-splatting-production.s3.ap-south-1.amazonaws.com/${selectedJewel.name}/${selectedJewel.name}.splat`;
  const navigate = useNavigate();

  const handleStopAR = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
    navigate("/VR");
  };

  useEffect(() => {
    let handLandmarker;
    let animationFrameId;

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
          runningMode: "video",
        });
        detectHands();
      } catch (error) {
        console.error("Error initializing hand detection:", error);
      }
    };

    const smoothLandmarks = (landmarks) => {
      const smoothingFactor = isMobile ? 0.6 : 0.5;
      if (!prevFrame) {
        setPrevFrame(landmarks);
        return landmarks;
      }
      const smoothedLandmarks = landmarks.map((point, index) => ({
        x: smoothingFactor * point.x + (1 - smoothingFactor) * prevFrame[index].x,
        y: smoothingFactor * point.y + (1 - smoothingFactor) * prevFrame[index].y,
        z: smoothingFactor * point.z + (1 - smoothingFactor) * prevFrame[index].z,
        visibility: smoothingFactor * point.visibility + (1 - smoothingFactor) * prevFrame[index].visibility
      }));
      setPrevFrame(smoothedLandmarks);
      return smoothedLandmarks;
    };

    const debounce = (func, delay) => {
      let timeoutId;
      return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
      };
    };

    const debouncedUpdate = debounce((landmarks, handedness) => {
      translateRotateMesh(landmarks, handedness, false, canvasRef.current);
      setHandLabels(handedness);
    }, isMobile ? 32 : 16);

    let frameCount = 0;
    const detectHands = () => {
      frameCount++;
      if (videoRef.current && videoRef.current.readyState >= 2) {
        if (frameCount % (isMobile ? 3 : 2) === 0) {
          const detections = handLandmarker.detectForVideo(videoRef.current, performance.now());
          setHandPresence(detections.handednesses.length > 0);

          if (detections.landmarks && detections.landmarks[0]) {
            const smoothedLandmarks = smoothLandmarks(detections.landmarks[0]);
            debouncedUpdate(smoothedLandmarks, detections.handednesses[0][0].displayName);
          }
        }
      }
      animationFrameId = requestAnimationFrame(detectHands);
    };

    const startWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
        await initializeHandDetection();
      } catch (error) {
        console.error("Error accessing webcam:", error);
        alert('Error accessing web cam');
      }
    };

    startWebcam();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
      if (handLandmarker) {
        handLandmarker.close();
      }
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
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
              position={[0, 0, 0]}
            />
          </Canvas>
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default HandTrackingComponent;