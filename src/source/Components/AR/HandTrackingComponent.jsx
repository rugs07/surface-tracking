import React, { useEffect, useRef, useState } from "react";
import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";
import hand_landmarker_task from "../../../models/hand_landmarker.task";
import { Canvas } from "@react-three/fiber";
import { AsciiRenderer, OrbitControls, Splat } from "@react-three/drei";
import Hands from "../Loading-Screen/Hands";
import { ARFunctions } from "../../context/ARContext";
import { useNavigate } from "react-router-dom";
import Showhandscreen from "./Showhandscreen";
import { useVariables } from "../../context/variableContext";


const HandTrackingComponent = () => {
    const videoRef = useRef(null);
    const { translateRotateMesh } = ARFunctions();
    const { YRDelta, XRDelta } = useVariables()
    const canvasRef = useRef(null);
    const [landmark, setLandmark] = useState([]);
    const [handPresence, setHandPresence] = useState();
    const selectedJewel = JSON.parse(
        sessionStorage.getItem("selectedJewel") || "{}"
    );
    let detections;
    console.log(YRDelta, XRDelta, 'tsm');
    // (canvasRef.current, "canvas ref")
    // (translateRotateMesh, 'logs');
    const url = `https://gaussian-splatting-production.s3.ap-south-1.amazonaws.com/${selectedJewel.name}/${selectedJewel.name}.splat`;
    const navigate = useNavigate();

    const handleStopAR = () => {
        // Stop the video stream
        if (videoRef.current && videoRef.current.srcObject) {
            // videoRef.current.srcObject?.getTracks()?.forEach((track) => track.stop());
        }
        // setHandPresence(null);

        navigate("/VR");
    };


    let wristPoints;
    useEffect(() => {
        let handLandmarker;
        let animationFrameId;

        const initializeHandDetection = async () => {
            try {
                const vision = await FilesetResolver.forVisionTasks(
                    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
                );
                handLandmarker = await HandLandmarker.createFromOptions(vision, {
                    baseOptions: { modelAssetPath: hand_landmarker_task },
                    numHands: 2,
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

                // Check if detections.landmarks is not empty
                if (detections.landmarks && detections.landmarks.length > 0) {
                    // drawLandmarks(detections.landmarks);
                    // setLandmark(detections.landmarks)
                    // (123, detections.landmarks)
                    setLandmark(detections.landmarks[0][0]);//!
                    // Call translateRotateMesh only if landmarks are available
                    try {

                        translateRotateMesh(
                            detections.landmarks[0],
                            "Right",
                            true,
                            canvasRef.current
                        );
                        console.log(translateRotateMesh(
                            detections.landmarks[0],
                            "Right",
                            true,
                            canvasRef.current
                        ), "trm func");
                    } catch (error) {
                        (error);
                    }
                } else {
                    ("No hand landmarks detected");
                }
            }
            // 
            console.log(wristPoints, 'handTracking points ');
            requestAnimationFrame(detectHands);
        };


        const startWebcam = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                });
                videoRef.current.srcObject = stream;
                await initializeHandDetection();
            } catch (error) {
                console.error("Error accessing webcam:", error);
            }
        };


        startWebcam();
        return () => {
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
        };
    }, []);



    return (
        <div
            style={{ display: "flex", flexDirection: "column", alignItems: "center", overflow: 'hidden' }}
        >
            <h1 style={{ position: "absolute", bottom: 0, left: 0 }}>
                Is there a Hand? {handPresence ? "Yes" : "No"}
            </h1>
            <button style={{ position: "absolute", top: 10, right: 10 }} onClick={handleStopAR}>
                STOP AR
            </button>

            {!handPresence && <Showhandscreen />}
            <video
                ref={videoRef}
                autoPlay
                playsInline
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    zIndex: "-1000",
                    objectFit: "cover",
                }}
            ></video>
            <div
                style={{
                    position: "relative",
                    width: "100vw",
                    height: "100vh",
                    zIndex: "1000",
                }}
            >
                <Canvas ref={canvasRef} id="gsplatCanvas" >
                    <Splat
                        src={url}
                        rotation={[XRDelta, YRDelta, 0]}

                    //position={[0, 0, 0]}
                    />
                </Canvas>
            </div>

        </div>
    );
};

export default HandTrackingComponent;