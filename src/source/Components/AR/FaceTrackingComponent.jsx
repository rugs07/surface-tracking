import { useNavigate } from "react-router-dom";
import gifearring from "../../assets/earring1_big.gif";
import React, { useState ,useMemo} from "react";


const HandsModal = ({ isOpen, onClose, isLoaded }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/face-ar");
  };

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
        {!isLoaded ? (
          <button disabled className="modal-Button" onClick={onClose}>
            Loading...
          </button>
        ) : (
          <button className="modal-Button" onClick={onClose}>
            Start
          </button>
        )}
      </div>
    </div>
  );
};

const ARComponent = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isLoaded, setIsLoaded] = useState(true); 

  // const natrajurl = useMemo(
  //   () =>
  //     "https://gaussian-splatting-production.s3.ap-south-1.amazonaws.com/natraj/natraj.splat"
  // );

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handlestopAR = () => {
    window.location.href = "/";
  };

  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}>
      <button className="stopArBtn1" onClick={handlestopAR}>
        STOP AR
      </button>
      
      <model-viewer
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
        src="https://modelviewer.dev/shared-assets/models/Astronaut.glb" // Replace with your model path
        alt="A 3D model of a chair"
        ar
        ar-modes="scene-viewer webxr quick-look"
        camera-controls
        auto-rotate
        ar-scale="auto"
        ar-placement="floor" // Optional: to place the model on a wall instead of the floor
      >
        <button slot="ar-button" className="start-ar-button">
          View in your space
        </button>
      </model-viewer>

      <HandsModal isOpen={isModalOpen} onClose={handleCloseModal} isLoaded={isLoaded} />
    </div>
  );
};

export default ARComponent;
