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
import "../../css/style.css"; // Ensure this line is included for modal styles

const HandsModal = ({ isOpen, onClose, isLoaded }) => {
  const { jewelsList } = useJewels();
  const [imagePaths, setImagePaths] = useState({
    step1: "",
    step2: "",
    step3: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchImages() {
      const selectedJewelKey =
        sessionStorage.getItem("selectedJewel") || "b4_gen3";

      const jewelDetails =
        jewelsList[JSON.parse(selectedJewelKey).name] || jewelsList["b4_gen3"];

      const type = jewelDetails.type || "bangle"; // Default to bangle if undefined

      try {
        const images = await Promise.all([
          import(`../../assets/${type}step1.jpg`),
          import(`../../assets/${type}step2.jpg`),
          import(`../../assets/${type}step3.gif`),
        ]);

        setImagePaths({
          step1: images[0].default,
          step2: images[1].default,
          step3: images[2].default,
        });
      } catch (error) {
        console.error("Failed to load images", error);
      }
    }

    fetchImages();
  }, [jewelsList]); // Dependency on jewelsList to update on its change

  const handleClick = () => {
    navigate("/AR");
  };

  if (!isOpen) return null;
  console.log(isLoaded, "is loaded ");

  return (
    <div className="modals-overlay" onClick={onClose}>
      <div className="modals-content" onClick={(e) => e.stopPropagation()}>
        <h2>Try on with 3 simple steps!</h2>
        <div className="steps-Container">
          <div className="steps">
            <img src={imagePaths.step1} alt="Step 1" />
            <p>Place your hand vertically in front of the camera</p>
          </div>
          <div className="steps">
            <img src={imagePaths.step2} alt="Step 2" />
            <p>Set the jewellery on your hand correctly</p>
          </div>
          <div className="steps">
            <img src={imagePaths.step3} alt="Step 3" />
            <p>Try it on freely to view all its details</p>
          </div>
        </div>
        {!isLoaded ? (
          <button className="modal-Button" onClick={onClose}>
            Getting started...
          </button>
        ) : (<button className="modal-Button" onClick={onClose}>
          get Started
        </button>)}
      </div>
    </div>
  );
};

const HandTrackingComponent = () => {
  const videoRef = useRef(null);
  const prevFrameRef = useRef(null);
  const isMobile = window.innerWidth <= 768;
  const { jewelsList } = useJewels();
  const { translateRotateMesh } = ARFunctions();
  const [handAngle, setHandAngle] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false)
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

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  useEffect(() => {
    let handLandmarker;
    let animationFrameId;
    let lastProcessTime = 0;

    const calculateHandAngle = (landmarks) => {
      const wrist = landmarks[0];
      const middleFinger = landmarks[9];

      const dx = middleFinger.x - wrist.x;
      const dy = middleFinger.y - wrist.y;

      let angle = Math.atan2(dy, dx) * (180 / Math.PI);
      angle = (angle + 360) % 360; // Normalize angle to 0-360 range
      console.log(angle, 'handangle');

      return angle;
    };

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
        setIsLoaded(true);
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
        if (currentTime - lastProcessTime >= 30) {
          lastProcessTime = currentTime;
          const detections = handLandmarker.detectForVideo(videoRef.current, currentTime);
          setHandPresence(detections.handednesses.length > 0);

          if (detections.landmarks?.[0]) {
            const smoothedLandmarks = smoothLandmarks(detections.landmarks[0]);
            const angle = calculateHandAngle(smoothedLandmarks);
            setHandAngle(angle);
            console.log(smoothedLandmarks, detections.landmarks[0], "warrr");
            translateRotateMesh(smoothedLandmarks, detections.handednesses[0][0].displayName, false, canvasRef.current);
            setHandLabels(detections.handednesses[0][0].displayName);

          } else {
            setHandAngle(null);
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
      cancelAnimationFrame(animationFrameId);
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}>
      {!handPresence && <Showhandscreen />}
      {handAngle > 300 || handAngle < 240 ? <Showhandscreen /> : null}
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
            {handAngle <= 300 && handAngle >= 240 && (
              <Splat
                src={url}
                rotation={[XRDelta, YRDelta, ZRDelta]}
                scale={[wristZoom, wristZoom, wristZoom]}
              />
            )}
          </Canvas>
        </ErrorBoundary>
      </div>
      <HandsModal isOpen={isModalOpen} onClose={handleCloseModal} isLoaded={isLoaded} />
    </div>
  );
};

export default HandTrackingComponent;
