import React, { useEffect, useRef, useState } from "react";
import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";
import hand_landmarker_task from "../../../models/hand_landmarker.task";
import { Canvas } from "@react-three/fiber";
import { AsciiRenderer, OrbitControls, Splat } from "@react-three/drei";
import Hands from "../Loading-Screen/Hands";
import { ARFunctions } from "../../context/ARContext";

const HandTrackingComponent = () => {
    const videoRef = useRef(null);
    const { translateRotateMesh } = ARFunctions()
    const canvasRef = useRef(null);
    const [landmark, setLandmark] = useState()
    const [handPresence, setHandPresence] = useState(null);
    const [cameraReady, setCameraReady] = useState(false)
    const selectedJewel = JSON.parse(sessionStorage.getItem("selectedJewel") || '{}');
    let detections;
    console.log(canvasRef.current, "canvas ref")
    console.log(translateRotateMesh, 'logs');
    const url = `https://gaussian-splatting-production.s3.ap-south-1.amazonaws.com/${selectedJewel.name}/${selectedJewel.name}.splat`;

    useEffect(() => {
        let handLandmarker;
        let animationFrameId;

        const initializeHandDetection = async () => {
            try {
                const vision = await FilesetResolver.forVisionTasks(
                    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
                );
                handLandmarker = await HandLandmarker.createFromOptions(
                    vision, {
                    baseOptions: { modelAssetPath: hand_landmarker_task },
                    numHands: 2,
                    runningMode: "video"
                }
                );
                detectHands();

            } catch (error) {
                console.error("Error initializing hand detection:", error);
            }
        };


        const drawLandmarks = (landmarksArray) => {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            ctx.clearReact(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'white';

            landmarksArray.forEach(landmarks => {
                landmarks.forEach(landmark => {
                    const x = landmark.x * canvas.width;
                    const y = landmark.y * canvas.height;

                    ctx.beginPath();
                    ctx.arc(x, y, 5, 0, 2 * Math.PI); // Draw a circle for each landmark
                    ctx.fill();
                });
            });

        };


        const detectHands = () => {
            if (videoRef.current && videoRef.current.readyState >= 2) {
                detections = handLandmarker.detectForVideo(videoRef.current, performance.now());
                setHandPresence(detections.handednesses.length > 0);

                // Check if detections.landmarks is not empty
                if (detections.landmarks && detections.landmarks.length > 0) {
                    // drawLandmarks(detections.landmarks);
                    // setLandmark(detections.landmarks)
                    console.log(123, detections.landmarks)

                    // Call translateRotateMesh only if landmarks are available
                    try {

                        translateRotateMesh(detections.landmarks[0], 'Right', true, canvasRef.current)
                    } catch (error) {
                        console.log(error)
                    }
                } else {
                    console.log('No hand landmarks detected');
                }
            }
            requestAnimationFrame(detectHands);
        };

        const startWebcam = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                videoRef.current.srcObject = stream;
                await initializeHandDetection();
            } catch (error) {
                console.error("Error accessing webcam:", error);
            }
        };


        startWebcam();
        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                videoRef.current.srcObject.getTracks().forEach(track => track.stop());
                setCameraReady(true)
            }
            if (handLandmarker) {
                handLandmarker.close();
            }
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, []);
    console.log(cameraReady, 'cam');

    // if (!cameraReady) {
    //     return <Hands />
    // }
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h1>Is there a Hand? {handPresence ? "Yes" : "No"}</h1>
            <video ref={videoRef} autoPlay playsInline style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: '-1000' }}></video>
            <div style={{ position: 'relative', width: '600px', height: '480px', zIndex: '1000' }}>
                <Canvas ref={canvasRef}>
                    {/* <AsciiRenderer /> */}
                    {/* <OrbitControls maxDistance={2.9} autoRotate={true} autoRotateSpeed={5} /> */}
                    <Splat src={url} />
                </Canvas>
            </div>
            {/* <canvas ref={canvasRef} style={{ backgroundColor: "black", width: "800px", height: "480px" }}></canvas> */}
        </div>
    );
};

export default HandTrackingComponent;