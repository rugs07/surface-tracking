import React, { useEffect, useRef, useState, useMemo } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { Splat } from "@react-three/drei";
import { useNavigate } from "react-router-dom";
import gifearring from "../../assets/earring1_big.gif";
import { FaceFunctions } from "../../context/FaceContext";
import { useVariables } from "../../context/variableContext";
import * as THREE from "three";

// ... HandsModal component remains the same ...

const ARScene = ({ session, referenceSpace }) => {
  const { gl, scene, camera } = useThree();
  const { XRDelta, YRDelta, YRDelta2, earZoom1, earZoom2, isvisible1, isvisible2 } = useVariables();
  const { translateRotateMesh } = FaceFunctions();

  const ringUrl1 = useMemo(() => `https://gaussian-splatting-production.s3.ap-south-1.amazonaws.com/natraj/natraj.splat`);

  useFrame((state, delta) => {
    if (session && referenceSpace) {
      const xrViewerPose = gl.xr.getFrame().getViewerPose(referenceSpace);
      if (xrViewerPose) {
        // Update your 3D object position/rotation based on the viewer pose
        // This is where you'd call translateRotateMesh if needed
      }
    }
  });

  return (
    <Splat
      src={ringUrl1}
      scale={[earZoom1, earZoom1, earZoom1]}
      rotation={[XRDelta, YRDelta2, 0]}
      visible={isvisible1}
    />
  );
};

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

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const startARSession = async () => {
    if (!navigator.xr) {
      console.error("WebXR not supported");
      return;
    }

    try {
      const supported = await navigator.xr.isSessionSupported('immersive-ar');
      if (!supported) {
        console.error("AR not supported");
        return;
      }

      const session = await navigator.xr.requestSession('immersive-ar', {
        requiredFeatures: ['local-floor', 'hit-test'],
        optionalFeatures: ['dom-overlay'],
        domOverlay: { root: document.body }
      });

      const canvas = canvasRef.current;
      const context = canvas.getContext('webgl', { xrCompatible: true });
      const gl = new THREE.WebGLRenderer({ canvas, context, alpha: true });
      
      await gl.xr.setSession(session);
      setGl(gl);

      const xrGLLayer = new XRWebGLLayer(session, context);
      session.updateRenderState({ baseLayer: xrGLLayer });

      const referenceSpace = await session.requestReferenceSpace('local-floor');
      setSession(session);
      setReferenceSpace(referenceSpace);

      session.addEventListener('end', () => {
        setSession(null);
        setReferenceSpace(null);
      });

      // Set up the render loop
      const onXRFrame = (time, frame) => {
        session.requestAnimationFrame(onXRFrame);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        const pose = frame.getViewerPose(referenceSpace);
        if (pose) {
          const view = pose.views[0];
          const viewport = session.renderState.baseLayer.getViewport(view);
          gl.viewport(viewport.x, viewport.y, viewport.width, viewport.height);

          // Perform face tracking here
          translateRotateMesh();

          // Render your AR content here
          // You'll need to set up your Three.js scene and camera
          // gl.render(scene, camera);
        }
      };

      session.requestAnimationFrame(onXRFrame);

      setIsLoaded(true);
    } catch (error) {
      console.error("Error starting AR session:", error);
    }
  };

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
      <canvas
        ref={canvasRef}
        style={{ width: "100vw", height: "100vh", position: "absolute" }}
      />
      {session && referenceSpace && (
        <ErrorBoundary>
          <Canvas
            gl={gl}
            camera={{ fov: 75, near: 0.1, far: 1000, position: [0, 0, 5] }}
          >
            <Splat
              src={ringUrl1}
              scale={[earZoom1, earZoom1, earZoom1]}
              rotation={[XRDelta, YRDelta2, 0]}
              visible={isvisible1}
            />
          </Canvas>
        </ErrorBoundary>
      )}
      <HandsModal isOpen={isModalOpen} onClose={handleCloseModal} isLoaded={isLoaded} />
    </div>
  );
};


export default ARComponent;