import React, { useEffect, useState } from 'react';
import '../../css/style.css';
import '../../css/loader.css';
import '../../css/gsplat.css';
import face from '../../assets/face1.png';
import { useJewels } from '../../context/JewelsContext';
import { useVariables } from '../../context/variableContext';
import { ARFunctions } from '../../context/ARContext';
import { useNavigate } from 'react-router-dom';


const Facehandscreen = () => {
  const { jewelsList } = useJewels();
  const { setJewelParams, setJewelType, jewelType, rowArType, setRowArType } = useVariables();
  const { translateRotateMesh } = ARFunctions();
  const navigate = useNavigate();
  const lastJewel = sessionStorage.getItem("selectedJewel") || "{}";
  let animationFrameId;
  const [handLabels, setHandLabels] = useState('');

  const handleJewelTypeChange = (jewelType) => {
    if (jewelType === 'ring') {
      // Update the handLabels state to trigger a re-render
      setHandLabels(handLabels === 'Left' ? 'Right' : 'Left');
    }
  };

  useEffect(() => {
    setJewelType(lastJewel.type);
  }, [lastJewel]);

  let jewelName = JSON.parse(lastJewel);

  function changeJewel(type) {
    setJewelType(type);
  }
  // requestAnimationFrame(changeJewel)

  const changeJewellery = (jewelId) => {
    if (jewelName['name'] === jewelId) {
      return;
    }
    const selectedJewel = jewelsList[jewelId];
    changeJewel(jewelsList[jewelId].type)
    sessionStorage.setItem("selectedJewel", JSON.stringify(selectedJewel));
    // window.location.reload();
  };

  const changeToRing = (jewelId) => {
    if (jewelName['name'] === jewelId) {
      changeJewel("ring");

      return;
    }
    handleJewelTypeChange('ring')
    const selectedJewel = jewelsList[jewelId];
    changeJewel(jewelsList[jewelId].type);
    sessionStorage.setItem("selectedJewel", JSON.stringify(selectedJewel));
    // window.location.reload();
  }


  return (
    <div 
      className="container" 
      style={{
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh'
      }}
    >
      <div className="camerasection" style={{ textAlign: 'center' }}>
        <p className="showhandscreen">Show your face as shown below</p>
        <img src={face} className="handimg" alt="Hand" style={{ height: '35dvh' }} />
      </div>
    </div>
  );  
}

export default Facehandscreen;
