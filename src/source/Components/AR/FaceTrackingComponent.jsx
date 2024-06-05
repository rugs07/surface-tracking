import React, { useEffect, useRef } from 'react'
import face_landmarker_task from "../../../models/face_landmarker.task";
import { useNavigate } from 'react-router-dom';
import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

// const url = `https://gaussian-splatting-production.s3.ap-south-1.amazonaws.com/${selectedJewel.name}/${selectedJewel.name}.splat`;


//! eyeBlinkLeft, eyeBlinkRight: Useful for detecting eye blinks and ensuring the eyewear frames adapt during these actions.
//!    eyeSquintLeft, eyeSquintRight: Helps in ensuring the glasses fit correctly when the user squints.
//!         eyeLookUpLeft, eyeLookUpRight, eyeLookDownLeft, eyeLookDownRight: Important for tracking eye movements and ensuring the eyewear orientation follows the eyes.
//!             eyeWideLeft, eyeWideRight: Indicates the openness of the eyes, useful for adjusting the position and fit of the glasses.

const FaceTrackingComponent = () => {
    const videoRef = useRef(null);

    // const navigate = useNavigate();
    let faceDetections;


    let wristPoints;
    let faceLandmarker;
    useEffect(() => {
        let handLandmarker;
        let animationFrameId;

        const initializeFaceDetection = async () => {
            try {
                const vision = await FilesetResolver.forVisionTasks(
                    // path/to/wasm/root
                    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
                );
                faceLandmarker = await FaceLandmarker.createFromOptions(
                    vision,
                    {
                        baseOptions: {
                            modelAssetPath: face_landmarker_task,
                            delegate: 'GPU'
                        },
                        numFaces: 1,
                        runningMode: "video",
                    });
                detectFace();
            } catch (error) {
                console.error("Error initializing face detet detection:", error);
            }
        };

        const detectFace = () => {
            if (videoRef.current && videoRef.current.readyState >= 2) {
                faceDetections = faceLandmarker.detectForVideo(
                    videoRef.current,
                    performance.now()
                );
                console.log(faceDetections, 'face detections ');
                // setHandPresence(detections.handednesses.length > 0);;

            }
            console.log(faceDetections, 'face detections');
            requestAnimationFrame(detectFace);
        };

        const startWebcam = async () => {
            try {
                const faceStream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                });
                console.log(videoRef);
                videoRef.current.srcObject = faceStream;
                await initializeFaceDetection();
            } catch (error) {
                alert('Error accessing web cam');
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
    return (
        <div>
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
            ></video>
        </div>
    )
}

export default FaceTrackingComponent