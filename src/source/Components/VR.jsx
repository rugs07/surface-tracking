import React, { useEffect, useRef } from 'react';
import * as SPLAT from "gsplat";

const VR = () => {
    const canvasRef = useRef(null); // To reference the canvas DOM element
    const viewSpaceContainerRef = useRef(null);

    useEffect(() => {
        // Ensure SPLAT libraries and canvas are available
        if (!SPLAT || !canvasRef.current) return;
        const selectedJewel = JSON.parse(sessionStorage.getItem("selectedJewel"));
        if (!selectedJewel) return;

        const scene = new SPLAT.Scene();
        const camera = new SPLAT.Camera();
        const renderer = new SPLAT.WebGLRenderer(canvasRef.current); // Use the canvas reference here
        const controls = new SPLAT.OrbitControls(camera, renderer.canvas);


        controls.minAngle = 10;
        controls.maxAngle = 50;
        controls.minZoom = 4;
        controls.maxZoom = 20;

        const url = `https://gaussian-splatting-production.s3.ap-south-1.amazonaws.com/${selectedJewel.name}/${selectedJewel.name}.splat`;

        SPLAT.Loader.LoadAsync(url, scene, () => { })
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
        // <div style={{ width: '100vw', height: '100vh' }}>
        //     {/* <h2 style={{ color: white }}>3s models</h2> */}
        //     <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }}></canvas>
        // </div>
        <div ref={viewSpaceContainerRef} id="viewspacecontainer">
            <div className="ar-toggle-container" id="ar-toggle-container">
                <button className="desktop-viewar" id="desktop-viewar">Try On</button>
                <h2 id="updatenote">Welcome to JAR4U</h2>
                <div className="gsplatButtonDiv">
                    <span className="gsplatSoundEffect">
                        <img className="audioImg" width="25px" src="./assets/audio-off-svgrepo-com.svg" />
                    </span>
                    <span className="gsplatBackgroundEffect">
                        <img className="backImg" width="28px" src="./assets/moon-svgrepo-com.svg" />
                    </span>
                </div>
            </div>
            <div style={{ display: 'flex', alignItems: '', justifyContent: 'center',width:'100%',height:'100%' }}>
                <canvas ref={canvasRef} id="gsplatCanvas" ></canvas>
            </div>
            <audio className="audioElement">
                <source src="./assets/audion.mp3" type="audio/mp3" />
            </audio>
        </div>
    );
};

export default VR;