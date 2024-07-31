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
        {/* <h2>Try on with 3 simple steps!</h2> */}
        <div className="steps-Container">
          {/* <div className="steps">
            <img src={imagePaths.step1} alt="Step 1" />
            <p>Place your hand vertically in front of the camera</p>
          </div> */}
          {/* <div className="steps">
            <img src={imagePaths.step2} alt="Step 2" />
            <p>Set the jewellery on your hand correctly</p>
          </div> */}
          <div className="steps">
            <img src={imagePaths.step3} alt="Step 3" />
            <center>

              <p >Place your hand vertically in front of the camera and try it on freely</p>
            </center>

          </div>
        </div>
        {!isLoaded ? (
          <button disabled className="modal-Button" onClick={onClose}>
            Loading...
          </button>
        ) : (<button className="modal-Button" onClick={onClose}>
          Start
        </button>)}
      </div>
    </div>
  );
};

// Fill the buffer with a line
function setGeometry(gl, x1, y1, x2, y2) {
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      x1, y1,
      x2, y2]),
    gl.STATIC_DRAW);
}


const HandTrackingComponent = () => {
  const videoRef = useRef(null);
  const prevFrameRef = useRef(null);
  // const isMobile = window.innerWidth <= 768;
  const { jewelsList } = useJewels();
  const { translateRotateMesh } = ARFunctions();
  const [handAngle, setHandAngle] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false)
  const ismobile = window.innerWidth < 768;
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
  console.log(selectedJewel.type, "selectedJewel");

  const url = useMemo(() => `https://gaussian-splatting-production.s3.ap-south-1.amazonaws.com/${selectedJewel.name}/${selectedJewel.name}.splat`, [selectedJewel]);

  const handleStopAR = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
    navigate("/VR");
    window.location.reload();
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
          minHandDetectionConfidence: 0.7,
          minHandPresenceConfidence: 0.7
        });
        setIsLoaded(true);
        detectHands();
      } catch (error) {
        console.error("Error initializing hand detection:", error);
      }
    };

    // New smoothing logic based on provided code
    let prevFrame = null; // Store the previous frame for velocity calculation
    let frameSets = []; // Stores multiple frames for smoothing

    // Function to calculate velocity based on the movement of hand landmarks
    const calculateVelocity = (currentFrame, previousFrame) => {
      if (!previousFrame) return 0;
      let totalVelocity = 0;
      for (let i = 0; i < currentFrame.length; i++) {
        const dx = currentFrame[i].x - previousFrame[i].x;
        const dy = currentFrame[i].y - previousFrame[i].y;
        const dz = currentFrame[i].z - previousFrame[i].z;
        totalVelocity += Math.sqrt(dx * dx + dy * dy + dz * dz);
      }
      return totalVelocity / currentFrame.length; // Average velocity across all points
    };

    // Function to smooth hand landmarks
    const smoothLandmarks = (results, jewelType, isMobile) => {
      console.log(results, "results")
      if (results && Array.isArray(results)) {
        frameSets.push(results);
      }

      let velocity = 0;
      if (frameSets.length > 1 && prevFrame) {
        velocity = calculateVelocity(frameSets[frameSets.length - 1], prevFrame);
      }

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

      if (effectiveLength >= 4) {
        const smoothedLandmarks = frameSets.slice(-effectiveLength).reduce((acc, frame, _, src) => {
          if (!Array.isArray(frame)) return acc; // Skip non-array frames
          return frame.map((point, index) => {
            acc[index] = acc[index] || { x: 0, y: 0, z: 0, visibility: 0 };
            acc[index].x += point.x / src.length;
            acc[index].y += point.y / src.length;
            acc[index].z += point.z / src.length;
            acc[index].visibility += point.visibility / src.length;
            return acc[index];
          });
        }, []);

        results = smoothedLandmarks;
        prevFrame = frameSets[frameSets.length - 1];
      }

      if (frameSets.length >= 8) {
        frameSets.shift();
      }

      return results;
    };

    let sourcevideowidth = null;
    let sourcevideoheight = null;

    const detectHands = async () => {
      if (videoRef.current?.readyState >= 2) {
        const currentTime = performance.now();
        if (currentTime - lastProcessTime >= 30) {
          lastProcessTime = currentTime;
          const detections = handLandmarker.detectForVideo(videoRef.current, currentTime);
          setHandPresence(detections.handednesses.length > 0);

          if (detections.landmarks?.[0]) {
            const smoothedLandmarks = smoothLandmarks(detections.landmarks[0], jewelType, ismobile);
            console.log(detections.landmarks[0], "results")
            const angle = calculateHandAngle(smoothedLandmarks);
            setHandAngle(angle);
            console.log(smoothedLandmarks, detections.landmarks[0], "warrr");
            if (sourcevideowidth == null)
              sourcevideowidth = videoRef.current?.videoWidth;
            if (sourcevideoheight == null)
              sourcevideoheight = videoRef.current?.videoHeight;
            translateRotateMesh(smoothedLandmarks, detections.handednesses[0][0].displayName, false, sourcevideowidth, sourcevideoheight);
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

  window.onpopstate = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
    navigate("/VR");
  }


  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}>
      {!handPresence && <Showhandscreen />}
      {/* {wristZoom > 1.0 ?  : null} */}

      {/* {( (selectedJewel.type === "bangle") && (handAngle > 330 || handAngle < 210)) && <Showhandscreen />} */}
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
      {/* <FPSStats /> */}
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
          // transform: isMobile ? "none" : "rotateY(180deg)",
          width: '200%',
          height: '200%',
        }}
      >
        <ErrorBoundary>
          <Canvas
            id="gsplatCanvas"
            ref={canvasRef}
            shadows
            gl={{ localClippingEnabled: true }}
            camera={{
              fov: 70,
              position: [0, 1.5, 4.5],
              near: 0.093,
              far: 4.75,
            }}
            style={{ width: "100%", height: "100%" }}
          >
            {/* {(selectedJewel.type !== "bangle" || (handAngle <= 330 && handAngle >= 210)) && ( */}
            <Splat
              src={url}
              rotation={[XRDelta, YRDelta, ZRDelta]}
              scale={[wristZoom, wristZoom, wristZoom]}
            />
            {/* )} */}
          </Canvas>
        </ErrorBoundary>
      </div>
      <HandsModal isOpen={isModalOpen} onClose={handleCloseModal} isLoaded={isLoaded} />
    </div>
  );
};

export default HandTrackingComponent;
