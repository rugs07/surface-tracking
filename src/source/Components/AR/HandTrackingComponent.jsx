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
  const [landmark, setLandmark] = useState([]);
  const [handPresence, setHandPresence] = useState();
  const selectedJewel = JSON.parse(
    sessionStorage.getItem("selectedJewel") || "{}"
  );
  let detections;


  const url = `https://gaussian-splatting-production.s3.ap-south-1.amazonaws.com/${selectedJewel.name}/${selectedJewel.name}.splat`;
  const navigate = useNavigate();

  const handleStopAR = () => {
    // Stop the video stream
    if (videoRef.current && videoRef.current.srcObject) {
      // videoRef.current.srcObject?.getTracks()?.forEach((track) => track.stop());
    }

    navigate("/VR");
  };

  let wristPoints;
  useEffect(() => {
    let handLandmarker;
    let animationFrameId;


    // const selectedJewel = jewelsList[jewelId];

    // sessionStorage.setItem("selectedJewel", JSON.stringify(selectedJewel));

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

    const detectHands = () => {
      if (videoRef.current && videoRef.current.readyState >= 2) {
        detections = handLandmarker.detectForVideo(
          videoRef.current,
          performance.now()
        );
        setHandPresence(detections.handednesses.length > 0);

        if (detections.landmarks && detections.landmarks.length > 0) {
          try {
            translateRotateMesh(
              detections.landmarks[0],
              detections.handednesses[0][0].displayName,
              false,
              canvasRef.current

            );
            setHandLabels(detections.handednesses[0][0].displayName);
          } catch (error) {
            error;
          }
        } else {
          ("No hand landmarks detected");
        }
      }
      requestAnimationFrame(detectHands);
    };

    const startWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        videoRef.current.srcObject = stream;
        // videoRef.current.style.transform = 'scaleX(-1)';
        await initializeHandDetection();
      } catch (error) {
        alert('Error accessing web cam')
        console.error("Error accessing webcam:", error);
      }
    };

    startWebcam();
    return () => {
      try {

        if (videoRef.current && videoRef.current.srcObject) {
          videoRef.current.srcObject
            ?.getTracks()
            ?.forEach((track) => track.stop());
        }
        if (handLandmarker) {
          handLandmarker.close();
        }
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
      } catch (error) {
        alert('Camera not available');
      }
    };
  }, []);
  console.log(XRDelta, YRDelta, ZRDelta, "rotations ");

  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}>
      {!handPresence && <Showhandscreen />}
      {!handPresence && (
        <button
          className="stopArBtn"
          onClick={handleStopAR}
        >
          STOP AR
        </button>
      )}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={window.innerWidth <= 768 ? {
          position: "absolute",

          transform: "rotateY(180deg)", //! add screen size based ternary operator
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: "100%",
          height: "100%",
          zIndex: "-1000",
          objectFit: "cover",
        } :
          {
            position: "absolute",

            transform: "rotateY(180deg)", //! add screen size based ternary operator
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: "100%",
            height: "100%",
            zIndex: "-1000",
            objectFit: "cover",
          }
        }
      ></video>
      <FPSStats />
      <div
        style={window.innerWidth <= 768 ? {
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          // transform: "rotateY(180deg)"
        
        } : {
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
            transform: "rotateY(180deg)"

        }
        }
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
