import React, { useEffect, useRef, useState, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { Splat } from "@react-three/drei";
import { useNavigate } from "react-router-dom";
import gifearring from "../../assets/earring1_big.gif";
import { FaceFunctions } from "../../context/FaceContext";
import { useVariables } from "../../context/variableContext";
import * as THREE from "three";

const HandsModal = ({ isOpen, onClose, isLoaded }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="modals-overlay" onClick={onClose}>
      <div className="modals-content" onClick={(e) => e.stopPropagation()}>
        <div className="steps-Container">
          <div className="steps">
            <img src={gifearring} alt="Step 3" />
            <center>
              <p>Keep your face in front of the camera to try on the earrings</p>
            </center>
          </div>
        </div>
        {/* {!isLoaded ? (
          <button disabled className="modal-Button" onClick={onClose}>
            Loading...
          </button>
        ) : ( */}
          <button className="modal-Button" onClick={onClose}>
            Start
          </button>
        {/* )} */}
      </div>
    </div>
  );
};

const ARComponent = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const { XRDelta, YRDelta, YRDelta2, earZoom1, earZoom2, isvisible1, isvisible2 } = useVariables();
  const { translateRotateMesh } = FaceFunctions();
  const canvasRef = useRef();
  const [session, setSession] = useState(null);
  const [referenceSpace, setReferenceSpace] = useState(null);
  const [gl, setGl] = useState(null);

  const ringUrl1 = useMemo(() => `https://gaussian-splatting-production.s3.ap-south-1.amazonaws.com/jewel26_lr/jewel26_lr.splat`);
  // const ringUrl2 = useMemo(() => `https://gaussian-splatting-production.s3.ap-south-1.amazonaws.com/jewel26_lr/jewel26_lr.splat`);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const startARSession = async () => {
    try {
      if (!navigator.xr) {
        console.error("WebXR not supported by this browser or device.");
        return;
      }
  
      const isSupported = await navigator.xr.isSessionSupported("immersive-ar");
      if (!isSupported) {
        console.error("Immersive AR session is not supported on this device.");
        return;
      }
  
      const session = await navigator.xr.requestSession("immersive-ar", {
        optionalFeatures: ["local-floor"],
      });
  
      const gl = new THREE.WebGLRenderer({ alpha: true });
      session.updateRenderState({ baseLayer: new XRWebGLLayer(session, gl.getContext()) });
      const refSpace = await session.requestReferenceSpace("local");
      setGl(gl);
      setSession(session);
      setReferenceSpace(refSpace);
    } catch (error) {
      console.error("Error initializing WebXR:", error);
    }
  };
  

  useEffect(() => {
    if (session && referenceSpace) {
      const onXRFrame = (time, frame) => {
        const viewerPose = frame.getViewerPose(referenceSpace);
        if (viewerPose) {
          translateRotateMesh();
        }
        session.requestAnimationFrame(onXRFrame);
      };
      session.requestAnimationFrame(onXRFrame);
    }
  }, [session, referenceSpace]);

  const handlestopAR = () => {
    if (session) {
      session.end();
    }
    window.location.href = "/";
  };

  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}>
      <button className="startArBtn" onClick={startARSession}>
        Start AR Session
      </button>
      <span className="close1" onClick={handlestopAR}>
        &times;
      </span>
      <Canvas
        id="gsplatCanvas"
        ref={canvasRef}
        shadows
        gl={{ localClippingEnabled: true }}
        camera={{ fov: 46, position: [0, 1.5, 4.5], near: 0.093, far: 4.75 }}
        style={{ width: "100vw", height: "100vh", position: "absolute" }}
      >
        {referenceSpace && (
          <>
            <Splat
              src={ringUrl1}
              scale={[earZoom1, earZoom1, earZoom1]}
              rotation={[XRDelta, YRDelta2, 0]}
              visible={isvisible1}
            />
            {/* <Splat
              src={ringUrl2}
              scale={[earZoom2, earZoom2, earZoom2]}
              rotation={[XRDelta, YRDelta, 0]}
              visible={isvisible2}
            /> */}
          </>
        )}
      </Canvas>
      <HandsModal isOpen={isModalOpen} onClose={handleCloseModal} isLoaded={isLoaded} />
    </div>
  );
};

export default ARComponent;
