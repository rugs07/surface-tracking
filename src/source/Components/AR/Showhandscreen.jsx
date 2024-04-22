import React from 'react';
import '../../css/style.css'
import '../../css/loader.css'
import '../../css/gsplat.css'

const Showhandscreen = () => {

    const changeJewellery = (newJewel) => {
        const lastJewel = sessionStorage.getItem("selectedJewel");
        if (lastJewel === newJewel) return;
    
        sessionStorage.setItem("selectedJewel", newJewel);
        };

  return (
    <div>
      <div id="showhandscreen">
        <div className="camerasection">
          <p>Place your hand vertically as shown below</p>
          <img src="assets/hand.png" className="handimg" alt="Hand" />
          <button className="primarybtn" type="button" >Stop AR</button>
          <button className="primarybtn switchbtn" id="switchbtn">
            <img src="assets/switch.png" className="switchimg" alt="Switch" />
          </button>
        </div>
        <div className="rowar">
          <div className="jewel-container ar-jewel" onClick={() => changeJewellery('b4_gen3')} id="b4_gen3">
            <img src="assets/flowerban.png" className="jewelimg" alt="Flower Bangle" />
            <div className="selectarea">
              <button type="button">Flower Bangle</button>
            </div>
          </div>
          <div className="jewel-container ar-jewel" onClick={() => changeJewellery('laxmi_exp')} id="laxmi_exp">
            <img src="assets/laxmi.png" className="jewelimg" alt="Laxmi Bangle" />
            <div className="selectarea">
              <button type="button">Laxmi Bangle</button>
            </div>
          </div>
          <div className="jewel-container ar-jewel" onClick={() => changeJewellery('jewel3_lr')} id="jewel3_lr">
            <img src="assets/queen.png" className="jewelimg" alt="Queen's Ring" />
            <div className="selectarea">
              <button type="button">Queen's Ring</button>
            </div>
          </div>
          <div className="jewel-container ar-jewel" onClick={() => changeJewellery('jewel26_lr')} id="jewel26_lr">
            <img src="assets/flower.png" className="jewelimg" alt="Flower Ring" />
            <div className="selectarea">
              <button type="button">Flower Ring</button>
            </div>
          </div>
          <div className="jewel-container ar-jewel" onClick={() => changeJewellery('jewel21_lr')} id="jewel21_lr">
            <img src="assets/heart.png" className="jewelimg" alt="Heart Ring" />
            <div className="selectarea">
              <button type="button">Heart Ring</button>
            </div>
          </div>
          <div className="jewel-container ar-jewel" onClick={() => changeJewellery('jewel1_lr')} id="jewel1_lr">
            <img src="assets/sunny.png" className="jewelimg" alt="Sunny Ring" />
            <div className="selectarea">
              <button type="button">Sunny Ring</button>
            </div>
          </div>
          <div className="jewel-container ar-jewel" onClick={() => changeJewellery('jewel25_lr')} id="jewel25_lr">
            <img src="assets/redeye.png" className="jewelimg" alt="Red Eye Ring" />
            <div className="selectarea">
              <button type="button">Red Eye Ring</button>
            </div>
          </div>
        </div>
      </div>
      <div className="ar-bottom-container mobile-viewer" id="ar-bottom-container">
        <button id="mobile-viewar" >Try On</button>
      </div>
    </div>
  )
}

export default Showhandscreen;