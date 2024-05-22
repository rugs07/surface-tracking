import React, { useEffect, useRef, useState, Suspense, lazy } from "react";
import * as SPLAT from "gsplat";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import FPSStats from "react-fps-stats";
import { hideLoading, updateLoadingProgress } from "../../js/utils";
import { useNavigate } from "react-router-dom";
import { useVariables } from "../context/variableContext";

import "../css/gsplat.css";
import "../css/loader.css";
import "../css/style.css";

const ErrorBoundary = lazy(() => import("./Errorboundary/ErrorBoundary"));
const SplatComponent = lazy(() =>
  import("@react-three/drei").then((module) => ({ default: module.Splat }))
);

function CarShow() {
  return (
    <>
      <PerspectiveCamera makeDefault fov={70} position={[3, 2, 5]} />
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color={"red"} />
      </mesh>
    </>
  );
}

const VR = () => {
  const navigate = useNavigate();
  const handleclick = () => {
    navigate("/Loading");
  };

  const canvasRef = useRef(null);
  const [loadingProgress, setLoadingProgress] = useState(1);
  const autorotateAngleRef = useRef(0);
  const viewSpaceContainerRef = useRef(null);
  const { XRDelta, YRDelta, ZRDelta } = useVariables();
  let autorotate = true;
  const autorotateSpeed = 0.005;
  let splat;
  let url;

  const selectedJewel = JSON.parse(
    sessionStorage.getItem("selectedJewel") || "{}"
  );

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
      if (loadingProgress === 100) {
        hideLoading();
      }
      splat = loadedObject;

      const frame = () => {
        if (autorotate) {
          autorotateAngleRef.current += autorotateSpeed;

          const baseTheta = 0,
            basePhi = 0,
            baseGama = 0;
          const XRDelta = 0,
            YRDelta = 0;

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

  return (
    <div ref={viewSpaceContainerRef} id="viewspacecontainer">
      <div className="ar-toggle-container" id="ar-toggle-container">
        <div className="FPSStats">
          <FPSStats />
        </div>
        <button
          className="tryon-button"
          id="desktop-viewar"
          onClick={handleclick}
        >
          Try On
        </button>
        <h2 id="updatenote">{selectedJewel.label}</h2>
        <div className="gsplatButtonDiv">
          <span className="gsplatSoundEffect"></span>
          <span className="gsplatBackgroundEffect"></span>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "150%",
          height: "150%",
        }}
      >
        <Suspense fallback={<div>Loading...</div>}>
          <ErrorBoundary>
            <Canvas
              shadows
              gl={{ localClippingEnabled: true }}
              camera={{ fov: 86, position: [0, 1.9, 5.5], near: 0.25, far: 16 }}
            >
              <OrbitControls
                maxDistance={2.9}
                autoRotate={true}
                autoRotateSpeed={2}
              />
              <SplatComponent
                src={url}
                rotation={[0.015, -3.55, 1.6]}
                position={[0, 0, 0]}
              />
            </Canvas>
          </ErrorBoundary>
        </Suspense>
      </div>
    </div>
  );
};

export default VR;
