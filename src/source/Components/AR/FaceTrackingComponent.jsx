import React, { useEffect, useRef, useState, useMemo } from "react";
import { FilesetResolver, FaceLandmarker } from "@mediapipe/tasks-vision";
import { Canvas } from "@react-three/fiber";
import face_landmarker_task from "../../../models/face_landmarker.task";
import { Splat } from "@react-three/drei";
import { FaceFunctions } from "../../context/FaceContext";
import { ARFunctions } from "../../context/ARContext";
import FPSStats from "react-fps-stats";
import { useVariables } from "../../context/variableContext";
import Facehandscreen from "./Facehandscreen";
import { useNavigate } from "react-router-dom";
import gifearring from "../../assets/earring1_big.gif"
import ErrorBoundary from "../Errorboundary/ErrorBoundary";

const HandsModal = ({ isOpen, onClose, isLoaded }) => {

  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/face-ar");
  };

  if (!isOpen) return null;
  // console.log(isLoaded, "is loaded ");

  return (
    <div className="modals-overlay" onClick={onClose}>
      <div className="modals-content" onClick={(e) => e.stopPropagation()}>
        {/* <h2>Try on with 3 simple steps!</h2> */}
        <div className="steps-Container">
          <div className="steps">
            <img src={gifearring} alt="Step 3" />
            <center>
              <p >Keep your face in front of the camera to try on the earrings</p>
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

const HandTrackingComponent = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const canvasRef2 = useRef(null);
  const isMobile = window.innerWidth <= 768;

  const queryParams = new URLSearchParams(window.location.search);
  let id = queryParams.get("id") || "jewel26_lr";


  const { translateRotateMesh } = FaceFunctions();
  const {
    jewelType,
    YRDelta,
    XRDelta,
    ZRDelta,
    earZoom2,
    earZoom1,
    setHandLabels,
    YRDelta2,
    isvisible1,
    isvisible2
  } = useVariables();

  const [faceDetections, setFaceDetections] = useState(null);
  const [earringPosition, setEarringPosition] = useState([0, 0, 0]);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  const ringUrl1 = useMemo(
    () =>
      `https://gaussian-splatting-production.s3.ap-south-1.amazonaws.com/${id}/${id}.splat`
  );

  const ringUrl2 = useMemo(
    () =>
      `https://gaussian-splatting-production.s3.ap-south-1.amazonaws.com/${id}/${id}.splat`
  );

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    let faceLandmarker;
    let animationFrameId;
    let lastProcessTime = 0;

    const initializeFaceDetection = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );

        faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: face_landmarker_task,
            delegate: "GPU",
          },
          runningMode: "VIDEO",
        });

        detectFaces();
      } catch (error) {
        console.error("Error initializing face detection:", error);
      }
    };

    let sourcevideowidth = null;
    let sourcevideoheight = null;

    const detectFaces = async () => {
      if (videoRef.current?.readyState >= 2) {
        const currentTime = performance.now();
        if (currentTime - lastProcessTime >= 30) {
          lastProcessTime = currentTime;
          const faceDetections = faceLandmarker.detectForVideo(
            videoRef.current,
            currentTime
          );
          setFaceDetections(faceDetections);
          if (sourcevideowidth == null)
            sourcevideowidth = videoRef.current?.videoWidth;
          if (sourcevideoheight == null)
            sourcevideoheight = videoRef.current?.videoHeight;
          if (faceDetections?.faceLandmarks[0]) {
            translateRotateMesh(
              faceDetections?.faceLandmarks[0],
              sourcevideowidth,
              sourcevideoheight
            );

            // translateRotateMesh2(
            //   faceDetections?.faceLandmarks[0],
            //   canvasRef2.current,
            //   sourcevideowidth,
            //   sourcevideoheight
            // );

            setIsLoaded(true); // Set loader to false when face detections are received
          }
        }
      }
      animationFrameId = requestAnimationFrame(detectFaces);
    };

    const startWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await initializeFaceDetection();
        } else {
          console.error("videoRef.current is null");
        }
      } catch (error) {
        console.error("Error accessing webcam:", error);
        alert("Error accessing webcam");
      }
    };

    startWebcam();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
      if (faceLandmarker) {
        faceLandmarker.close();
      }
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  const handlestopAR = () => {
    videoRef.current?.srcObject?.getTracks().forEach((track) => track.stop());
    window.location.href = "/";
  };

  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}>
      {!faceDetections?.faceLandmarks?.[0] && <Facehandscreen />}
      {!faceDetections?.faceLandmarks?.[0] && (
        <button className="stopArBtn1" onClick={handlestopAR}>
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
      {/* <button
        onClick={handlestopAR}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          zIndex: 2000,
          padding: "10px",
          background: "whitesmoke",
          color: "black",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Stop AR
      </button> */}
      <span
      className="close1"
      onClick={handlestopAR}
    >
      &times;
    </span>
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
          zIndex: 0,
          // transform: isMobile ? "none" : "rotateY(180deg)",
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
          style={{ width: "100vw", height: "100vh", position: "absolute" }}
        >
          {faceDetections?.faceLandmarks?.[0]?.[401] && (
            <>
              <Splat
                src={ringUrl1}
                scale={[earZoom1,earZoom1,earZoom1]}
                rotation={[XRDelta, YRDelta2, 0]}
                visible={isvisible1}
              />
            </>
          )}
        </Canvas>
        <Canvas
          id="gsplatCanvas2"
          ref={canvasRef2}
          shadows
          gl={{ localClippingEnabled: true }}
          camera={{
            fov: 46,
            position: [0, 1.5, 4.5],
            near: 0.093,
            far: 4.75,
          }}
          style={{ width: "100vw", height: "100vh", position: "absolute" }}
        >
          {faceDetections?.faceLandmarks?.[0] && (
            <>
              <Splat
                src={ringUrl2}
                scale={[earZoom2,earZoom2,earZoom2]}
                rotation={[XRDelta, YRDelta, 0]}
                visible={isvisible2}
              />
            </>
          )}
        </Canvas>
        </ErrorBoundary>
      </div>
      <HandsModal isOpen={isModalOpen} onClose={handleCloseModal} isLoaded={isLoaded} />
    </div>
  );
};

export default HandTrackingComponent;
