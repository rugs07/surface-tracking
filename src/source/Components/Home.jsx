import React from "react";
import "../../css/style.css";
import { useNavigate } from "react-router-dom";
import { useJewels } from "../context/JewelsContext";

const Home = () => {
  const navigate = useNavigate();
  const { jewelsList } = useJewels();

  const handleClick = (jewelId) => {
    const selectedJewel = jewelsList[jewelId];
    sessionStorage.setItem("selectedJewel", JSON.stringify(selectedJewel));
    navigate("/VR");
  };

  const handleNavigate = (url) => {
    window.location.href = url;
  };

  return (
    <div>
      <div className="main-container">
        <div className="title-container" onClick="gotoHome()">
          <div className="logo-container">
            <img src="../../assets/logo1.png" className="logoimg" />
            <span className="logo-text">Jar4u</span>
          </div>
          <h2 className="sitename">3D Experiences that Uplift Sales</h2>
        </div>
        <div className="side-errors" id="side-errors"></div>
        {/* <div className="j4container" id="j4container">
                    <!-- <h3 className="type-label">
              Bangles <span className="items-text">(2 Items)</span>
            </h3> 

           <div className="parameter-adjustment-container">
              <label for="baseThetaVRSlider">Base Theta VR:</label>
              <input type="range" id="baseThetaVRSlider" min="-1" max="1" step="0.01" oninput="updateJewelParam('b4_gen3', 'baseThetaVR', this.value)">
              <output id="baseThetaVROutput">0</output>
                </div> */}
        <div className="jrow home-row" id="jewels_row">
          <div className="glassmorph">
            <div
              className="jewel-container home-jewel"
              onClick={() => {
                handleClick("b4_gen3");
              }}
            >
              <img src="assets/Bangle_new.png" className="jewelimg" />
              <div className="selectarea">
                {/* <!-- <button type="button">Flower Bangle</button> --> */}
                <span>Flower Bangle</span>
              </div>
            </div>
          </div>
          <div className="glassmorph">
            <div
              className="jewel-container home-jewel"
              onClick={() => {
                handleClick("laxmi_exp");
              }}
            >
              <img src="assets/laxmi1-bg.png" className="jewelimg" />
              <div className="selectarea">
                {/* <!-- <button type="button">Laxmi Bangle</button> --> */}
                <span>Laxmi Bangle</span>
              </div>
            </div>
          </div>
          <div className="glassmorph">
            <div
              className="jewel-container home-jewel"
              onClick={() => {
                handleNavigate("https://prod.jar4u.com/?id=jewel7_lr");
              }}
            >
                <img
                  src="assets/diamondbracelet22-bg.png"
                  className="jewelimg"
                />
                <div className="selectarea">
                  {/* <!-- <button type="button">Diamond Bracelet</button> --> */}
                  <span>Bracelet</span>
                </div>
            </div>
          </div>
          <div className="glassmorph">
            <div
              className="jewel-container home-jewel"
              onClick={() => {
                handleClick("jewel3_lr");
              }}
            >
              <img src="assets/Queen1-bg.png" className="jewelimg" />
              <div className="selectarea">
                {/* <!-- <button type="button">Queen's Ring</button> --> */}
                <span>Queen's Ring</span>
              </div>
            </div>
          </div>
        </div>

        {/* <!-- Other items --> */}
        <div className="jrow home-row" id="jewels_row">
          <div className="glassmorph">
            <div
              className="jewel-container home-jewel"
              onClick={() => handleNavigate("https://prod.jar4u.com/?id=pots")}
            >
              <img src="assets/pots-bg.png" className="jewelimg" />
              <div className="selectarea">
                {/* <!-- <button type="Gbutton">Ancient Pots</button> --> */}
                <span>Ancient Pots</span>
              </div>
            </div>
          </div>
          <div className="glassmorph">
            <div
              className="jewel-container home-jewel"
              onClick={() => {
                handleNavigate("https://prod.jar4u.com/?id=swan");
              }}
            >
              <img src="assets/swan-bg.png" className="jewelimg" />
              <div className="selectarea">
                {/* <!-- <button type="button">Lively Swans</button> --> */}
                <span>Lively Swans</span>
              </div>
            </div>
          </div>

          <div className="glassmorph">
            <div
              className="jewel-container home-jewel"
              onClick={() => {
                handleNavigate("https://prod.jar4u.com/?id=natraj");
              }}
            >
                <img src="assets/natraj-bg.png" className="jewelimg" />
                <div className="selectarea">
                  {/* <!-- <button type="button">Natraj</button> --> */}
                  <span>Natraj</span>
                </div>
            </div>
          </div>
          <div className="glassmorph">
            <div
              className="jewel-container home-jewel"
              onClick={() => {
                handleNavigate("https://prod.jar4u.com/?id=table_1");
              }}
            >
              <img src="assets/table_1-bg.png" className="jewelimg" />
              <div className="selectarea">
                {/* <!-- <button type="button">Luxe Table</button> --> */}
                <span>Luxe Table</span>
              </div>
            </div>
          </div>

          {/* <!-- Rings-- > */}
          <div className="jrow home-row" id="jewels_row">
            <div className="glassmorph">
              <div
                className="jewel-container home-jewel"
                onClick={() => {
                  handleClick("jewel21_lr");
                }}
              >
                <img src="assets/heart1-bg.png" className="jewelimg" />
                <div className="selectarea">
                  {/* <!-- <button type="button">Heart Ring</button> --> */}
                  <span>Heart Ring</span>
                </div>
              </div>
            </div>
            <div className="glassmorph">
              <div
                className="jewel-container home-jewel"
                onClick={() => {
                  handleClick("jewel25_lr");
                }}
              >
                <img src="assets/redeye1-bg.png" className="jewelimg" />
                <div className="selectarea">
                  {/* <!-- <button type="button">Red Eye Ring</button> --> */}
                  <span>Red Eye Ring</span>
                </div>
              </div>
            </div>
            <div className="glassmorph">
              <div
                className="jewel-container home-jewel"
                onClick={() => {
                  handleClick("jewel1_lr");
                }}
              >
                <img src="assets/sunny1-bg.png" className="jewelimg" />
                <div className="selectarea">
                  {/* <!-- <button type="button">Sunny Ring</button> --> */}
                  <span>Sunny Ring</span>
                </div>
              </div>
            </div>

            <div className="glassmorph">
              <div
                className="jewel-container home-jewel"
                onClick={() => {
                  handleClick("jewel26_lr");
                }}
              >
                <img src="assets/flower1-bg.png" className="jewelimg" />
                <div className="selectarea">
                  {/* <button type="button">Flower Ring</button> --> */}
                  <span>Flower Ring</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
