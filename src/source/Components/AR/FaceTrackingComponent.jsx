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
      
      <a-scene
      webar-scene="key: f59faf1a-5ffb-40de-9678-cf2957c4c1f0"
      vr-mode-ui="enabled: false"
      device-orientation-permission-ui="enabled: false"
      loading-screen="enabled: false">

      <a-camera webar-camera></a-camera>

      <a-assets>
        <a-asset-item
          id="astronaut"
          src="https://gaussian-splatting-production.s3.ap-south-1.amazonaws.com/natraj/natraj.splat">
        </a-asset-item>
      </a-assets>

      {/* <a-entity webar-stage>
        <a-entity gltf-model="#astronaut" id="astronaut_1" 
                  rotation="0 0 0" position="0 0 0" scale="0.25 0.25 0.25"
                  webar-loadmonitor="elType: splat"></a-entity>
      </a-entity> */}
    </a-scene>

      <HandsModal isOpen={isModalOpen} onClose={handleCloseModal} isLoaded={isLoaded} />
    </div>
  );
};

export default ARComponent;
