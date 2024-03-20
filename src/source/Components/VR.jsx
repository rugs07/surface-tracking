import React, { useEffect, useRef,useState } from 'react';
import * as SPLAT from "gsplat";
import '../../css/gsplat.css'
import '../../css/loader.css'
import '../../css/style.css'


const VR = () => {
    const canvasRef = useRef(null); // To reference the canvas DOM element
    const [loadingProgress, setLoadingProgress] = useState(0); 
    const viewSpaceContainerRef = useRef(null);

    const selectedJewel = JSON.parse(sessionStorage.getItem("selectedJewel"));
    useEffect(() => {
        // Ensure SPLAT libraries and canvas are available
        if (!SPLAT || !canvasRef.current) return;
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
        
        const mockLoad = (progress) => {
            if (progress < 100) {
                setTimeout(() => {
                    const nextProgress = progress + 50; // Increment progress
                    setLoadingProgress(nextProgress);
                    mockLoad(nextProgress); // Recursively call mockLoad
                }, 20); 
            }
        };

        SPLAT.Loader.LoadAsync(url, scene, () => {
            mockLoad(0);
         })
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
            {loadingProgress < 100 && (
                <div id="loading-container">
                    <div role="progressbar" aria-valuenow={loadingProgress} aria-valuemin="0" aria-valuemax="100" style={{ '--value': loadingProgress }}></div>
                    <p className="progresstext">Crafting artwork of stars</p>
                </div>
            )}
            <div className="ar-toggle-container" id="ar-toggle-container">
                <button className="tryon-button" id="desktop-viewar">Try On</button>
                <h2 id="updatenote">{selectedJewel.label}</h2>
                <div className="gsplatButtonDiv">
                    <span className="gsplatSoundEffect">
                        <img className="audioImg" width="25px" src="./assets/audio-off-svgrepo-com.svg" />
                        {/* <img className="audioImg" width="25px" src="./assets/audio-off-svgrepo-com.svg" style={{ filter: 'invert(100%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%)' }} /> */}
                    </span>
                    <span className="gsplatBackgroundEffect">
                        <img className="backImg" width="28px" src="./assets/moon-svgrepo-com.svg" />
                        {/* <img className="backImg" width="28px" src="./assets/moon-svgrepo-com.svg" style={{ filter: 'invert(100%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%)' }} /> */}
                    </span>
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', width: '100%', height: '100%' }}>
                <canvas ref={canvasRef} id="gsplatCanvas" ></canvas>
            </div>
            <audio className="audioElement">
                <source src="./assets/audion.mp3" type="audio/mp3" />
            </audio>
        </div>
    );
};

export default VR;