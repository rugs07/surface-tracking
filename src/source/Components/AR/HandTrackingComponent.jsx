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
  const [frameSets, setFrameSets] = useState([]);
  const [frames, setFrames] = useState([]);
  const [prevFrame, setPrevFrame] = useState(null);
  const isMobile = window.innerWidth <= 768; // Define isMobile based on screen width
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
            delegate: "CPU",
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
        // console.log(detections, 'detectionsssss');
        const smoothLandmarks = (results) => {
          if (results.landmarks && results.landmarks[0]) {
            setFrameSets(prev => {
              const newFrameSets = [...prev, results.landmarks[0]];
              return newFrameSets.slice(-8); // Keep only the last 8 frames
            });
            setFrames(prev => {
              const newFrames = [...prev, results];
              return newFrames.slice(-8); // Keep only the last 8 frames
            });
          }

          const calculateVelocity = (currentFrame, previousFrame) => {
            if (!currentFrame || !previousFrame) return 0;

            let totalDistance = 0;
            for (let i = 0; i < currentFrame.length; i++) {
              const dx = currentFrame[i].x - previousFrame[i].x;
              const dy = currentFrame[i].y - previousFrame[i].y;
              const dz = currentFrame[i].z - previousFrame[i].z;
              totalDistance += Math.sqrt(dx * dx + dy * dy + dz * dz);
            }
            return totalDistance / currentFrame.length;
          };

          let velocity = 0;
          if (frameSets.length > 1 && prevFrame) {
            velocity = calculateVelocity(frameSets[frameSets.length - 1], prevFrame);
          }

          // Adjust the smoothing based on velocity
          let effectiveLength = frameSets.length;
          if (isMobile) {
            if (jewelType === "bangle") {
              if (velocity > 0.04) {
                effectiveLength = Math.min(effectiveLength, 4);
              } else if (velocity > 0.015) {
                effectiveLength = Math.min(effectiveLength, 6);
              } else {
                effectiveLength = Math.min(effectiveLength, 8);
              }
            } else {
              if (velocity > 0.015) {
                effectiveLength = Math.min(effectiveLength, 4);
              } else {
                effectiveLength = 6;
              }
            }
          } else {
            if (velocity > 0.04) {
              effectiveLength = Math.min(effectiveLength, 4);
            } else if (velocity > 0.015) {
              effectiveLength = Math.min(effectiveLength, 6);
            } else {
              effectiveLength = 8;
            }
          }

          if (effectiveLength >= 4 && frameSets.length >= effectiveLength) {
            const smoothedLandmarks = frameSets
              .slice(-effectiveLength)
              .reduce((acc, frame) => {
                return frame.map((point, index) => {
                  if (!acc[index]) {
                    acc[index] = { x: 0, y: 0, z: 0, visibility: 0 };
                  }
                  acc[index].x += point.x / effectiveLength;
                  acc[index].y += point.y / effectiveLength;
                  acc[index].z += point.z / effectiveLength;
                  acc[index].visibility += point.visibility / effectiveLength;
                  return acc[index];
                });
              }, []);

            if (results.landmarks && results.landmarks[0]) {
              results.landmarks[0] = smoothedLandmarks;
            }
            setPrevFrame(frameSets[frameSets.length - 1]);
          }
          console.log(results, "result in smooth landmarks");
          // console.log(smoothedDetections.landmarks[0]);
          return results;
        };
        
        
        const smoothedDetections = smoothLandmarks(detections);
        console.log(smoothedDetections.landmarks[0], ":if check");
        if (smoothedDetections.landmarks && smoothedDetections.landmarks.length > 0) {
          try {
            console.log(smoothedDetections, 'detecitons smmoths');
            translateRotateMesh(
              smoothedDetections.landmarks[0],
              smoothedDetections.handednesses[0][0].displayName,
              false,
              canvasRef.current
            );
            setHandLabels(smoothedDetections.handednesses[0][0].displayName);
          } catch (error) {
            console.error(error);
          }
        } else {
          console.log("No hand landmarks detected");
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
