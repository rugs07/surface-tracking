import React, { useEffect, useRef, useState } from 'react';
import { Holistic } from '@mediapipe/holistic/holistic.js';
import { Camera } from '@mediapipe/camera_utils';
import { drawConnectors } from '@mediapipe/drawing_utils';
import { Canvas } from '@react-three/fiber';
import { Splat, OrbitControls } from '@react-three/drei';

const HandTrackingComponent = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const holisticRef = useRef(null);
    const [handPoints, setHandPoints] = useState([]);

    const selectedJewel = JSON.parse(sessionStorage.getItem("selectedJewel") || '{}');
    const url = "https://huggingface.co/datasets/dylanebert/3dgs/resolve/main/bonsai/bonsai-7k.splat";

    useEffect(() => {
        const holistic = new Holistic({
            locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`,
        });
        holistic.setOptions({
            selfieMode: false,
            smoothLandmarks: true,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5,
        });
        holisticRef.current = holistic;

        const camera = new Camera(videoRef.current, {
            onFrame: async () => {
                await holistic.send({ image: videoRef.current });
            },
            width: 800,
            height: 600,
        });
        camera.start();

        holistic.onResults((results) => {
            const landmarks = results.poseLandmarks;
            if (landmarks && landmarks.length > 0) {
                setHandPoints(landmarks);
                console.log(results.rightHandLandmarks); // Log the results here
            }
        });

        return () => {
            camera.stop();
            holistic.close();
        };
    }, []);

    useEffect(() => {
        if (canvasRef.current && handPoints.length > 0) {
            const ctx = canvasRef.current.getContext('2d');
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            drawConnectors(ctx, handPoints, Holistic.POSE_CONNECTIONS, { color: '#FF0000' });
        }
    }, [handPoints]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h1>Hand Tracking</h1>
            <div style={{ position: 'relative' }}>
                <video ref={videoRef} style={{ width: '100%', maxWidth: '800px', display: 'block' }} autoPlay playsInline muted></video>
                <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0 }} width="800" height="600"></canvas>
                <Canvas style={{ width: '800px', height: '600px', position: 'absolute', top: 0, left: 0 }}>
                    <OrbitControls maxDistance={2.9} autoRotate={true} autoRotateSpeed={5} />
                    <Splat src={url} rotation={[0.09, 2, 4.5, 2]} />
                </Canvas>
            </div>
        </div>
    );
};

export default HandTrackingComponent;