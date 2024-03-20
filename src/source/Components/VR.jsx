import React, { useEffect, useRef } from 'react';
import * as SPLAT from "gsplat";

const VR = () => {
    const canvasRef = useRef(null); // To reference the canvas DOM element

    useEffect(() => {
        // Ensure SPLAT libraries and canvas are available
        if (!SPLAT || !canvasRef.current) return;
        const selectedJewel = JSON.parse(sessionStorage.getItem("selectedJewel"));
        if (!selectedJewel) return;

        const scene = new SPLAT.Scene();
        const camera = new SPLAT.Camera();
        const renderer = new SPLAT.WebGLRenderer(canvasRef.current); // Use the canvas reference here
        const controls = new SPLAT.OrbitControls(camera, renderer.canvas);

        const url = `https://gaussian-splatting-production.s3.ap-south-1.amazonaws.com/${selectedJewel.name}/${selectedJewel.name}.splat`;

        SPLAT.Loader.LoadAsync(url, scene, () => {})
            .then(() => {
                const frame = () => {
                    controls.update();
                    renderer.render(scene, camera);
                    requestAnimationFrame(frame);
                };

                requestAnimationFrame(frame);
            });

        // Cleanup function to stop the animation frame when the component unmounts
        return () => {
            if (renderer) renderer.dispose();
        };
    }, []); // Empty dependency array means this effect runs once on mount

    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }}></canvas>
        </div>
    );
};

export default VR;