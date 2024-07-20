import React, { Suspense } from "react";
import "../css/style.css";
import "../css/loader.css";
import "../css/gsplat.css";
import { useNavigate } from "react-router-dom";
import { useJewels } from "../context/JewelsContext";
import flowerbangle from "../assets/flowerban.png";
import laxmibangle from "../assets/laxmi.png";
import flowerring from "../assets/flower.png";
import heart from "../assets/heart.png";
import redeye from "../assets/redeye.png";
import sunny from "../assets/sunny.png";
import logo from "../assets/logo1.png";
import { useVariables } from "../context/variableContext";
import modelimage from "../assets/finalimg.png";
import modelimage2 from "../assets/finalimg2.png";

let typeOfJewel;
const Home = () => {
  const navigate = useNavigate();
  const { jewelsList } = useJewels();
  const { setJewelType, jewelType, setXRDelta, setYRDelta, setZRDelta } =
    useVariables();
  const handleClick = (jewelId) => {
    const selectedJewel = jewelsList[jewelId];

    setJewelType(jewelsList[jewelId].type);

    typeOfJewel == jewelsList[jewelId].type;
    sessionStorage.setItem("selectedJewel", JSON.stringify(selectedJewel));
    if(selectedJewel.type === "earring"){
      navigate(`/face-ar?id=${selectedJewel.name}`)
    }
    else{
    navigate("/VR");
    }
  };

  const handleNavigate = (url) => {
    window.location.href = url;
  };

  const gotoHome = () => {
    window.location.href = `https://www.jar4u.com/`;
  };

  return (
    <div>
      <div className="main-container">
        <div className="title-container" onClick={gotoHome}>
          <div className="logo-container">
            <img src={logo} className="logoimg" />
            <span className="logo-text">Jar4u</span>
          </div>
          {/* <h2 className="sitename">3D Experiences that Uplift Sales</h2> */}
        </div>
        <div className="side-errors" id="side-errors"></div>
        <Suspense fallback={<div>Loading...</div>}>
          <div className="jewel-category">
            <h3 className="category-label">Rings</h3>
            <div className="jrow home-row" id="jewels_row">
              <div className="glassmorph">
                <div
                  className="jewel-container home-jewel"
                  onClick={() => {
                    handleClick("jewel21_lr");
                  }}
                >
                  <img src={heart} className="jewelimg" />
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
                  <img src={redeye} className="jewelimg" />
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
                  <img src={sunny} className="jewelimg" />
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
                  <img src={flowerring} className="jewelimg" />
                  <div className="selectarea">
                    {/* <button type="button">Flower Ring</button> --> */}
                    <span>Flower Ring</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* {Bangles and earrings} */}
          <div className="jewel-category">
            {/* <hr className="category-line" /> */}
            <h3 className="category-label">EarRings and Bangles</h3>
            {/* <hr className="category-line" /> */}
            <div className="jrow home-row" id="jewels_row">
              <div className="glassmorph">
                <div
                  className="jewel-container home-jewel"
                  onClick={() => {
                    handleClick("jewel26_lr_earring");
                  }}
                >
                  <img src={modelimage2} className="jewelimg1" />
                  <div className="selectarea">
                    {/* <!-- <button type="button">Heart Ring</button> --> */}
                    <span>Lotus Earring</span>
                  </div>
                </div>
              </div>
              <div className="glassmorph">
                <div
                  className="jewel-container home-jewel"
                  onClick={() => {
                    handleClick("jewel25_lr_earring");
                  }}
                >
                  <img src={modelimage} className="jewelimg1" />
                  <div className="selectarea">
                    {/* <!-- <button type="button">Red Eye Ring</button> --> */}
                    <span>Ruby Earring</span>
                  </div>
                </div>
              </div>
              <div className="glassmorph">
                <div
                  className="jewel-container home-jewel"
                  onClick={() => {
                    handleClick("b4_gen3");
                  }}
                >
                  <img src={flowerbangle} className="jewelimg" />
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
                  <img src={laxmibangle} className="jewelimg" />
                  <div className="selectarea">
                    {/* <!-- <button type="button">Laxmi Bangle</button> --> */}
                    <span>Laxmi Bangle</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Suspense>
      </div>
    </div>
  );
};

export default Home;
