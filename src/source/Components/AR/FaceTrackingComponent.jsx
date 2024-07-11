import React, { useEffect, useRef, useState, useMemo } from "react";
import { FilesetResolver, FaceLandmarker } from "@mediapipe/tasks-vision";
import { Canvas } from "@react-three/fiber";
import face_landmarker_task from "../../../models/face_landmarker.task";
import { Splat } from "@react-three/drei";
import { log } from "three/examples/jsm/nodes/Nodes.js";
import { FaceFunctions } from "../../context/FaceContext";
import { ARFunctions } from "../../context/ARContext";
import FPSStats from "react-fps-stats";
import { useVariables } from "../../context/variableContext";

const HandTrackingComponent = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const canvasRef2 = useRef(null);
  const isMobile = window.innerWidth <= 768;
  //   console.log(ARFunctions);
  //   console.log(FaceFunctions);
  const { translateRotateMesh, translateRotateMesh2 } = FaceFunctions();
  const { jewelType, YRDelta, XRDelta, ZRDelta, wristZoom, setHandLabels } =
    useVariables();

  const [faceDetections, setFaceDetections] = useState(null);
  const [earringPosition, setEarringPosition] = useState([0, 0, 0]);
  //   console.log(earringPosition);

  const ringUrl1 = useMemo(
    () =>
      `https://gaussian-splatting-production.s3.ap-south-1.amazonaws.com/jewel26_lr/jewel26_lr.splat`
  );

  const ringUrl2 = useMemo(
    () =>
      `https://gaussian-splatting-production.s3.ap-south-1.amazonaws.com/jewel25_lr/jewel25_lr.splat`
  );

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

    const detectFaces = async () => {
      if (videoRef.current?.readyState >= 2) {
        const currentTime = performance.now();
        if (currentTime - lastProcessTime >= 30) {
          lastProcessTime = currentTime;
          const faceDetections = faceLandmarker.detectForVideo(
            videoRef.current,
            currentTime
          );
          //   console.log(faceDetections?.faceLandmarks[0],'face 401');
          setFaceDetections(faceDetections);
          if (faceDetections?.faceLandmarks[0]) {
            // console.log(smoothedLandmarks, detections.landmarks[0], "warrr");
            translateRotateMesh(
              faceDetections?.faceLandmarks[0],
              "left",
              false,
              canvasRef.current
            );

            translateRotateMesh2(
              faceDetections?.faceLandmarks[0],
              "right",
              false,
              canvasRef2.current
            );

            const landmark = faceDetections.faceLandmarks[0][401];
            setEarringPosition([landmark.x, landmark.y, landmark.z]);
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

  const stopAR = () => {
    videoRef.current?.srcObject?.getTracks().forEach((track) => track.stop());
    window.location.href = "http://localhost:5173";
  };

  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{
          position: "absolute",
          //   transform: "rotateY(180deg)",
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
      <button
        onClick={stopAR}
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
      </button>
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
        }}
      >
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
                // position={earringPosition}
                scale={[wristZoom, wristZoom, wristZoom]}
                rotation={[XRDelta, YRDelta, 0]}
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
                scale={[wristZoom, wristZoom, wristZoom]}
                rotation={[XRDelta, YRDelta, 0]}
              />
            </>
          )}
        </Canvas>
      </div>
    </div>
  );
};

export default HandTrackingComponent;
