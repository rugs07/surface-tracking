import React, { useEffect, useRef, useState } from 'react';
import * as SPLAT from "gsplat";
import { Canvas } from '@react-three/fiber';
import { CameraControls, OrbitControls, PresentationControls, Splat } from '@react-three/drei';
import '../../css/gsplat.css'
import '../../css/loader.css'
import '../../css/style.css'
import FPSStats from "react-fps-stats";
import { hideLoading, updateLoadingProgress } from '../../js/utils';
import { Navigate, useNavigate } from 'react-router-dom';


const VR = () => {

    const navigate = useNavigate();
    const handleclick = () => {
        navigate('/MediaPipe');
    }

    const canvasRef = useRef(null);
    const [loadingProgress, setLoadingProgress] = useState(1);
    const autorotateAngleRef = useRef(0); // Using useRef to persist the value without causing re-renders
    const viewSpaceContainerRef = useRef(null);
    let autorotate = true; // Assuming you have a condition to enable/disable autorotation
    const autorotateSpeed = 0.005; // Define the speed of autorotation
    let splat;
    let url; // This will hold your loaded 3D object

    const selectedJewel = JSON.parse(sessionStorage.getItem("selectedJewel") || '{}');
    console.log(canvasRef, "canvas ref")

    url = `https://gaussian-splatting-production.s3.ap-south-1.amazonaws.com/${selectedJewel.name}/${selectedJewel.name}.splat`;
    useEffect(() => {
        if (!SPLAT || !canvasRef.current || !selectedJewel) return;

        const scene = new SPLAT.Scene();
        const camera = new SPLAT.Camera();
        const renderer = new SPLAT.WebGLRenderer(canvasRef.current);

        const controls = new SPLAT.OrbitControls(camera, renderer.canvas);

        controls.minAngle = 10;
        controls.maxAngle = 50;
        controls.minZoom = 4;
        controls.maxZoom = 20;

        SPLAT.Loader.LoadAsync(url, scene, (progress) => {
            updateLoadingProgress(progress * 100);
            setLoadingProgress(progress * 100);

        }).then((loadedObject) => {
            if (loadingProgress == 100) {
                hideLoading()
            }
            splat = loadedObject;
            // hideLoading()  // Assuming LoadAsync returns the loaded 3D object

            const frame = () => {
                if (autorotate) {
                    autorotateAngleRef.current += autorotateSpeed;

                    // Assuming you have defined or imported baseTheta, basePhi, and baseGama somewhere
                    const baseTheta = 0, basePhi = 0, baseGama = 0; // Example values, replace with actual ones
                    const XRDelta = 0, YRDelta = 0; // Replace with actual values if needed

                    const rotation = new SPLAT.Vector3(
                        baseTheta + XRDelta,
                        basePhi + YRDelta + autorotateAngleRef.current,
                        baseGama
                    );
                    splat.rotation = SPLAT.Quaternion.FromEuler(rotation);
                }

                controls.update();
                renderer.render(scene, camera);
                requestAnimationFrame(frame);
            };

            requestAnimationFrame(frame);
        });

        return () => {
            if (renderer) renderer.dispose();
        };
    }, [selectedJewel]);
    console.log(loadingProgress)// Re-run the effect when selectedJewel changes

    return (
        // <div style={{ width: '100vw', height: '100vh' }}>
        //     {/* <h2 style={{ color: white }}>3s models</h2> */}
        //     <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }}></canvas>
        // </div>
        <div ref={viewSpaceContainerRef} id="viewspacecontainer">
            {/* {loadingProgress < 100 ? (
                <div id="loading-container" >
                    <div role="progressbar" aria-valuenow={loadingProgress} aria-valuemin="0" aria-valuemax="100" style={{ '--value': loadingProgress }}></div>
                    <p className="progresstext">Crafting artwork of stars</p>
                </div>
            )
                : null
            } */}
            {/* <div>{fpsControl}</div> */}
            <div className="ar-toggle-container" id="ar-toggle-container">
                <FPSStats />
                <button className="tryon-button" id="desktop-viewar" onClick={handleclick}> Try On </button>
                <h2 id="updatenote">{selectedJewel.label}</h2>
                <div className="gsplatButtonDiv">
                    <span className="gsplatSoundEffect">
                        {/* <img className="audioImg" width="25px" src="./assets/audio-off-svgrepo-com.svg" /> */}
                        {/* <img className="audioImg" width="25px" src="./assets/audio-off-svgrepo-com.svg" style={{ filter: 'invert(100%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%)' }} /> */}
                    </span>
                    <span className="gsplatBackgroundEffect">
                        {/* <img className="backImg" width="28px" src="./assets/moon-svgrepo-com.svg" /> */}
                        {/* <img className="backImg" width="28px" src="./assets/moon-svgrepo-com.svg" style={{ filter: 'invert(100%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%)' }} /> */}
                    </span>
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', width: '100%', height: '100%' }}>
                {/* <canvas ref={canvasRef} id="gsplatCanvas" ></canvas> */}
                <Canvas >

                    <OrbitControls maxDistance={2.9} autoRotate={true} autoRotateSpeed={2} />
                    {/* <CameraControls rotate={[0.09,2,4.5]} /> */}

                    <Splat src={url}
                        rotation={[0.09, 2, 4.5, 2]}
                    // position={[2.1036774620197414, -2.397127693021015, ]}

                    />
                    {/* </PresentationControls> */}
                </Canvas>
            </div>
            {/* <audio className="audioElement">
                <source src="./assets/audion.mp3" type="audio/mp3" />
            </audio> */}
        </div>
    );
};

export default VR;
