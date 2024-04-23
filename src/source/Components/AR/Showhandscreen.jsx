import React from 'react';
import '../../css/style.css'
import '../../css/loader.css'
import '../../css/gsplat.css'
import flowerban from '../../assets/flowerban.png'
import queen from '../../assets/queen.png'
import laxmiban from '../../assets/laxmi.png'
import flowerring from '../../assets/flower.png'
import heartring from '../../assets/heart.png'
import sunnyring from '../../assets/sunny.png'
import redeye from '../../assets/redeye.png'
import hand from '../../assets/hand.png'

const Showhandscreen = () => {

  const changeJewellery = (newJewel) => {
    const lastJewel = sessionStorage.getItem("selectedJewel");
    if (lastJewel === newJewel) return;

    sessionStorage.setItem("selectedJewel", newJewel);
  };

  return (


    <div style={{
     }} >
      <div className="camerasection">
        <p>Place your hand vertically as shown below</p>
        <img src={hand} className="handimg" alt="Hand" />
      </div>
      <div className="rowar">
        <div className="jewel-container ar-jewel" id="b4_gen3" alt="">
          <img src={flowerban} className="jewelimg" alt="Flower Bangle" />
          <div className="selectarea">
            <button type="button">Flower Bangle</button>
          </div>
        </div>
        <div className="jewel-container ar-jewel" id="laxmi_exp" alt="">
          <img src={laxmiban} className="jewelimg" alt="Laxmi Bangle" />
          <div className="selectarea">
            <button type="button">Laxmi Bangle</button>
          </div>
        </div>
        <div className="jewel-container ar-jewel" id="jewel3_lr" alt="">
          <img src={queen} className="jewelimg" alt="Queen's Ring" />
          <div className="selectarea">
            <button type="button">Queen's Ring</button>
          </div>
        </div>
        <div className="jewel-container ar-jewel" id="jewel26_lr" alt="">
          <img src={flowerring} className="jewelimg" alt="Flower Ring" />
          <div className="selectarea">
            <button type="button">Flower Ring</button>
          </div>
        </div>
        <div className="jewel-container ar-jewel" id="jewel21_lr" alt="">
          <img src={heartring} className="jewelimg" alt="Heart Ring" />
          <div className="selectarea">
            <button type="button">Heart Ring</button>
          </div>
        </div>
        <div className="jewel-container ar-jewel" id="jewel1_lr" alt="">
          <img src={sunnyring} className="jewelimg" alt="Sunny Ring" />
          <div className="selectarea">
            <button type="button">Sunny Ring</button>
          </div>
        </div>
        <div className="jewel-container ar-jewel" id="jewel25_lr" alt="">
          <img src={redeye} className="jewelimg" alt="Red Eye Ring" />
          <div className="selectarea">
            <button type="button">Red Eye Ring</button>
          </div>
        </div>
      </div>
    </div>


  )
}

export default Showhandscreen;