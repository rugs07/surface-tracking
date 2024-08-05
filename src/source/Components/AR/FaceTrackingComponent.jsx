import React, { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { Splat } from "@react-three/drei";
import { FaceFunctions } from "../../context/FaceContext";
import { useVariables } from "../../context/variableContext";

const ARComponent = () => {
  const [session, setSession] = useState(null);
  const [referenceSpace, setReferenceSpace] = useState(null);
  const canvasRef = useRef(null);

  const { XRDelta, YRDelta2, earZoom1, isvisible1 } = useVariables();
  const { translateRotateMesh } = FaceFunctions();

  useEffect(() => {
    if (session && referenceSpace) {
      const gl = new THREE.WebGLRenderer({ canvas: canvasRef.current });
      const clock = new THREE.Clock();

      const onXRFrame = (time, frame) => {
        session.requestAnimationFrame(onXRFrame);
        const dt = clock.getDelta();
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        const xrViewerPose = frame.getViewerPose(referenceSpace);
        if (xrViewerPose) {
          const view = xrViewerPose.views[0];
          const viewport = session.renderState.baseLayer.getViewport(view);
          gl.setSize(viewport.width, viewport.height);
          gl.setPixelRatio(window.devicePixelRatio);
          gl.xr.updateCamera(view, referenceSpace);

          translateRotateMesh();
          gl.render(gl.xr.getScene(), gl.xr.getCamera());
        }
      };

      session.requestAnimationFrame(onXRFrame);

      return () => {
        session.end();
      };
    }
  }, [session, referenceSpace]);

  const startARSession = async () => {
    if (navigator.xr) {
      const session = await navigator.xr.requestSession("immersive-ar", {
        requiredFeatures: ["local-floor", "hit-test"],
        optionalFeatures: ["dom-overlay"],
        domOverlay: { root: document.body },
      });

      const referenceSpace = await session.requestReferenceSpace("local-floor");
      setSession(session);
      setReferenceSpace(referenceSpace);

      session.addEventListener("end", () => {
        setSession(null);
        setReferenceSpace(null);
      });
    }
  };

  return (
    <div>
      <button onClick={startARSession}>Start AR Session</button>
      <canvas ref={canvasRef} style={{ width: "100vw", height: "100vh" }} />
      {session && referenceSpace && (
        <Canvas camera={{ fov: 75, near: 0.1, far: 1000 }}>
          <Splat
            src="https://gaussian-splatting-production.s3.ap-south-1.amazonaws.com/natraj/natraj.splat"
            scale={[earZoom1, earZoom1, earZoom1]}
            rotation={[XRDelta, YRDelta2, 0]}
            visible={isvisible1}
          />
        </Canvas>
      )}
    </div>
  );
};

export default ARComponent;
