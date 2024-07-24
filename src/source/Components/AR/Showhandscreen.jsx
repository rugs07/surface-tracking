import React, { useEffect, useState } from 'react';
import '../../css/style.css';
import '../../css/loader.css';
import '../../css/gsplat.css';
import flowerban from '../../assets/flowerban.png';
import queen from '../../assets/queen.png';
import laxmiban from '../../assets/laxmi.png';
import flowerring from '../../assets/flower.png';
import heartring from '../../assets/heart.png';
import sunnyring from '../../assets/sunny.png';
import redeye from '../../assets/redeye.png';
import hand from '../../assets/hand.png';
import { useJewels } from '../../context/JewelsContext';
import { useVariables } from '../../context/variableContext';
import { ARFunctions } from '../../context/ARContext';
import { useNavigate } from 'react-router-dom';


const Showhandscreen = () => {
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
    window.location.reload();
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
    window.location.reload();
  }


  // if (animationFrameId) {
  //   cancelAnimationFrame(animationFrameId);
  // }

  return (
    <div className="container">
      <div className="camerasection">
        <p className='showhandscreen' >Place your hand vertically as shown below</p>
        <img src={hand} className="handimg" alt="Hand" />
      </div>
      <div className="rowar">
        {/* <div className="jewel-container ar-jewel" id="jewel3_lr" alt="" onClick={() => changeToRing("jewel3_lr")}>
          <img src={queen} className="rowar-img" alt="Queen's Ring" />
          <div className="selectarea">
            <h3 type="h3" onClick={() => changeToRing("jewel3_lr")}>Queen's Ring</h3>
          </div>
        </div> */}
        <div className="jewel-container ar-jewel" id="jewel26_lr" alt="" onClick={() => changeToRing("jewel26_lr")}>
          <img src={flowerring} className="rowar-img" alt="Flower Ring" />
          <div className="selectarea">
            <h3 type="h3" onClick={() => changeToRing("jewel26_lr")}>Flower Ring</h3>
          </div>
        </div>
        <div className="jewel-container ar-jewel" id="jewel25_lr" alt="" onClick={() => changeToRing("jewel25_lr") && setJewelType("ring")}>
          <img src={redeye} className="rowar-img" alt="Red Eye Ring" />
          <div className="selectarea">
            <h3 type="h3" onClick={() => changeToRing("jewel25_lr") && setJewelType("ring")}>Red Eye Ring</h3>
          </div>
        </div>
        <div className="jewel-container ar-jewel" id="b4_gen3" alt="" onClick={() => changeJewellery("b4_gen3")}>
          <img src={flowerban} className="rowar-img" alt="Flower Bangle" />
          <div className="selectarea">
            <h3 type="h3" onClick={() => changeJewellery("b4_gen3")}>Flower Bangle</h3>
          </div>
        </div>
        <div className="jewel-container ar-jewel" id="laxmi_exp" alt="" onClick={() => changeJewellery("laxmi_exp")}>
          <img src={laxmiban} className="rowar-img" alt="Laxmi Bangle" />
          <div className="selectarea">
            <h3 type="h3" onClick={() => changeJewellery("laxmi_exp")}>Laxmi Bangle</h3>
          </div>
        </div>
        <div className="jewel-container ar-jewel" id="jewel21_lr" alt="" onClick={() => changeToRing("jewel21_lr")}>
          <img src={heartring} className="rowar-img" alt="Heart Ring" />
          <div className="selectarea">
            <h3 type="h3" onClick={() => changeToRing("jewel21_lr")}>Heart Ring</h3>
          </div>
        </div>
        <div className="jewel-container ar-jewel" id="jewel1_lr" alt="" onClick={() => changeToRing("jewel1_lr")}>
          <img src={sunnyring} className="rowar-img" alt="Sunny Ring" />
          <div className="selectarea">
            <h3 type="h3" onClick={() => changeToRing("jewel1_lr")}>Sunny Ring</h3>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Showhandscreen;
