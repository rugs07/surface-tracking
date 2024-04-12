import React from "react";
import step1img from '../../assets/banglestep1.jpg'
import step2img from '../../assets/banglestep2.jpg'
import step3img from '../../assets/banglestep3.gif'
import '../../css/style.css'
// import '../../css/gsplat.css'
// import '../../css/loader.css'
import { Navigate, useNavigate } from 'react-router-dom';

const Hands = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate('/Ar');
  }

  return (
    <div style={{}}>
      <div id="usermanual">
        <h3 className="trytitle">Try on with 3 simple steps !</h3>
        <div className="allsteps">
          <div className="step">
            <img src={step1img} className="stepimg" id="step1img" alt="Step 1" />
            <p className="steptext">
              Place your hand vertically in front of camera
            </p>
          </div>
          <div className="step">
            <img src={step2img} className="stepimg" id="step2img" alt="Step 2" />
            <p className="steptext">Set the jewellery on your hand correctly</p>
          </div>
          <div className="step">
            <img
              src={step3img}
              className="stepimg"
              id="step3img"
              alt="Step 3"
            />
            <p className="steptext">Try it on freely to view all its details</p>
          </div>
        </div>
        <button
          className="centerbtn "
          type="button"
          id="getstartedbtn"
          onClick={handleClick}
        // disabled

        >
          Get Started
        </button>
      </div>
      {/* <div id="retrycamscreen">
        <h4 className="trytitle">
          Looks like your camera is already being accessed by another
          application(s)
        </h4>
        <h4 className="trytitle">
          Please close your camera on that application(s) and Try again !
        </h4>
        <div className="allsteps">
          <div className="errorstep">
            <img
              src="assets/no-camerafeed.png"
              className="errorimg"
              id="step1img"
              alt="Camera Error"
            />
          </div>
        </div>
        <button className="centerbtn" type="button" id="retrycambtn">
          Try again
        </button>
      </div> */}
    </div>

  );
};

export default Hands;
