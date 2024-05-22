import React, { useEffect } from 'react';
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
// import { GlobalFunctionsProvider } from '../../context/ARContext';

const Showhandscreen = (typeJewel) => {
  const { jewelsList } = useJewels();
  // const { setJewelParams } = GlobalFunctionsProvider()

  let jewelNameid;

  const lastJewel = sessionStorage.getItem("selectedJewel") || "{}";

  let jewelName = JSON.parse(lastJewel);
  let jewelId = jewelName['name'];
  const jewelNames = Object.keys(jewelsList).reduce((acc, key) => {
    acc[key] = jewelsList[key].name;
    return acc;
  }, {});
  jewelNameid = jewelName['name'];

  const changeJewellery = (jewelId) => {
    alert(jewelId);
    if (lastJewel === jewelId) {
      return;
    }
    sessionStorage.setItem("selectedJewel", JSON.stringify({ name: jewelId }));
    setJewelParams()
  };

  return (
    <div className="container">
      <div className="camerasection">
        <p>Place your hand vertically as shown below</p>
        <img src={hand} className="handimg" alt="Hand" />
      </div>
      <div className="rowar">
        <div className="jewel-container ar-jewel" id="b4_gen3" alt="">
          <img src={flowerban} className="jewelimg" alt="Flower Bangle" />
          <div className="selectarea">
            <button type="button" onClick={() => changeJewellery("b4_gen3")}>Flower Bangle</button>
          </div>
        </div>
        <div className="jewel-container ar-jewel" id="laxmi_exp" alt="">
          <img src={laxmiban} className="jewelimg" alt="Laxmi Bangle" />
          <div className="selectarea">
            <button type="button" onClick={() => changeJewellery("laxmi_exp")}>Laxmi Bangle</button>
          </div>
        </div>
        <div className="jewel-container ar-jewel" id="jewel3_lr" alt="">
          <img src={queen} className="jewelimg" alt="Queen's Ring" />
          <div className="selectarea">
            <button type="button" onClick={() => changeJewellery("jewel3_lr")}>Queen's Ring</button>
          </div>
        </div>
        <div className="jewel-container ar-jewel" id="jewel26_lr" alt="">
          <img src={flowerring} className="jewelimg" alt="Flower Ring" />
          <div className="selectarea">
            <button type="button" onClick={() => changeJewellery("jewel26_lr")}>Flower Ring</button>
          </div>
        </div>
        <div className="jewel-container ar-jewel" id="jewel21_lr" alt="">
          <img src={heartring} className="jewelimg" alt="Heart Ring" />
          <div className="selectarea">
            <button type="button" onClick={() => changeJewellery("jewel21_lr")}>Heart Ring</button>
          </div>
        </div>
        <div className="jewel-container ar-jewel" id="jewel1_lr" alt="">
          <img src={sunnyring} className="jewelimg" alt="Sunny Ring" />
          <div className="selectarea">
            <button type="button" onClick={() => changeJewellery("jewel1_lr")}>Sunny Ring</button>
          </div>
        </div>
        <div className="jewel-container ar-jewel" id="jewel25_lr" alt="">
          <img src={redeye} className="jewelimg" alt="Red Eye Ring" />
          <div className="selectarea">
            <button type="button" onClick={() => changeJewellery("jewel25_lr")}>Red Eye Ring</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Showhandscreen;
