import React, { useEffect, useRef, useState } from 'react';
import { Hands } from '@mediapipe/hands';

const HandTrackingComponent = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const handsRef = useRef(null);
    const [handPoints, setHandPoints] = useState([]);

    useEffect(() => {
        const hands = new Hands({ locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}` });
        hands.setOptions({
            maxNumHands: 1,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5,
        });
        handsRef.current = hands;

        const initializeMediaPipe = async () => {
            await hands.initialize();
            await hands.send({ image: videoRef.current });
        };

        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
                videoRef.current.srcObject = stream;
                videoRef.current.addEventListener('loadeddata', () => {
                    initializeMediaPipe();
                });
            }).catch((error) => {
                console.error('Error accessing camera:', error);
            });
        }

        hands.onResults((results) => {
            if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
                const landmarks = results.multiHandLandmarks[0];
                setHandPoints(landmarks);
                console.log(results);
            }
        });
        
        return () => {
            hands.close();
        };
    }, []);
    
    useEffect(() => {
        if (canvasRef.current && handPoints.length > 0) {
            const ctx = canvasRef.current.getContext('2d');
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            handPoints.forEach((point) => {
                const x = point.x * canvasRef.current.width;
                const y = point.y * canvasRef.current.height;
                ctx.beginPath();
                ctx.arc(x, y, 5, 0, 2 * Math.PI);
                ctx.fillStyle = '#FF0000';
                ctx.fill();
            });
        }
    }, [handPoints]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h1>Hand Tracking</h1>
            <div style={{ position: 'relative' }}>
                <video
                    ref={videoRef}
                    style={{ width: '100%', maxWidth: '800px', display: 'block' }}
                    autoPlay
                    playsInline
                    muted
                ></video>
                <canvas
                    ref={canvasRef}
                    style={{ position: 'absolute', top: 0, left: 0 }}
                    width="800"
                    height="600"
                ></canvas>
            </div>
        </div>
    );
};

export default HandTrackingComponent;
