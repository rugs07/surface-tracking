import React, { useEffect, useRef, useState } from "react";
import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";
import hand_landmarker_task from "../../../models/hand_landmarker.task";
import { Canvas } from "@react-three/fiber";
import { Splat } from "@react-three/drei";
import FPSStats from "react-fps-stats";
import { ARFunctions } from "../../context/ARContext";
import { useNavigate } from "react-router-dom";
import Showhandscreen from "./Showhandscreen";
import { useVariables } from "../../context/variableContext";


const HandTrackingComponent = () => {
    const videoRef = useRef(null);
    let [points, setPoints] = useState({ x: 0, y: 0, z: 0 });
    const { translateRotateMesh } = ARFunctions();
    const { YRDelta, XRDelta, ZRDelta, wristZoom, handPointsX, handPointsY, handPointsZ, } = useVariables()
    const canvasRef = useRef(null);
    const [landmark, setLandmark] = useState([]);
    const [handPresence, setHandPresence] = useState();
    const selectedJewel = JSON.parse(
        sessionStorage.getItem("selectedJewel") || "{}"
    );
    let detections;
    let pointsX;
    let pointsY;
    let pointsZ
    console.log(YRDelta, XRDelta, 'tsm');
    // (canvasRef.current, "canvas ref")
    console.log(handPointsX,
        handPointsY,
        handPointsZ, 'position');
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

                // Check if detections.landmarks is not empty
                if (detections.landmarks && detections.landmarks.length > 0) {
                    pointsX = detections.landmarks[0][0].x;
                    pointsY = detections.landmarks[0][0].y;
                    pointsZ = detections.landmarks[0][0].z;
                    setPoints({ x: pointsX, y: pointsY, z: pointsZ });

                    console.log(points, 'points');

                    // Call translateRotateMesh only if landmarks are available
                    try {

                        translateRotateMesh(
                            detections.landmarks[0],
                            "Left",
                            true,
                            canvasRef.current
                        );

                        // console.log(points.x, 'points');

                    } catch (error) {
                        (error);
                    }
                } else {
                    ("No hand landmarks detected");
                }
            }
            // 
            console.log(detections.landmarks, 'handTracking points ');
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
        <div>
            {/* <h1 style={{ position: "absolute", bottom: 0, left: 0 }}>
                Is there a Hand? {handPresence ? "Yes" : "No"}
            </h1> */}
            {/* <button style={{ position: "absolute", top: 10, right: 10 }} onClick={handleStopAR}>
                STOP AR
            </button> */}

            {!handPresence && <Showhandscreen />}
            {!handPresence && <Showhandscreen />}
            {(!handPresence && <button
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    zIndex: "1001", // Ensure the button appears above the Showhandscreen
                }}
                onClick={handleStopAR}
            >
                STOP AR
            </button>)}
            <video
                ref={videoRef}
                autoPlay
                playsInline

                style={{
                    position: "absolute",
                    // // transform: 'rotateY(180deg)',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    width: "100%",
                    height: "100%",
                    // zIndex: "-1000",
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
                <FPSStats />
                <Canvas id="gsplatCanvas" ref={canvasRef} shadows gl={{ localClippingEnabled: true }} camera={{ fov: 46, position: [0, 1.5, 4.5], near: 0.25, far: 4.75 }} >

                    <Splat
                        src={url}
                        rotation={[XRDelta, YRDelta, ZRDelta]}
                        scale={[wristZoom, wristZoom, wristZoom]}
                        position={[ handPointsX, handPointsY, handPointsZ]}
                    />
                </Canvas>

            </div>

        </div>
    );
};

export default HandTrackingComponent;