import React, { useState, useEffect } from "react";
import { useJewels } from "../../context/JewelsContext";
import { useNavigate } from "react-router-dom";

const Hands = () => {
  const { jewelsList } = useJewels();
  const [imagePaths, setImagePaths] = useState({
    step1: "",
    step2: "",
    step3: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchImages() {
      const selectedJewelKey =
        sessionStorage.getItem("selectedJewel") || "b4_gen3";

      const jewelDetails =
        jewelsList[JSON.parse(selectedJewelKey).name] || jewelsList["b4_gen3"];

      const type = jewelDetails.type || "bangle"; // Default to bangle if undefined

      try {
        const images = await Promise.all([
          import(`../../assets/${type}step1.jpg`),
          import(`../../assets/${type}step2.jpg`),
          import(`../../assets/${type}step3.gif`),
        ]);

        setImagePaths({
          step1: images[0].default,
          step2: images[1].default,
          step3: images[2].default,
        });
      } catch (error) {
        console.error("Failed to load images", error);
      }
    }

    fetchImages();
  }, [jewelsList]); // Dependency on jewelsList to update on its change

  const handleClick = () => {
    navigate("/AR");
  };

  return (
    <div id="usermanual">
      <h3 className="trytitle">Try on with 3 simple steps!</h3>
      <div className="allsteps">
        <div className="step">
          <img src={imagePaths.step1} className="stepimg" alt="Step 1" />
          <p className="steptext">
            Place your hand vertically in front of the camera
          </p>
        </div>
        <div className="step">
          <img src={imagePaths.step2} className="stepimg" alt="Step 2" />
          <p className="steptext">Set the jewellery on your hand correctly</p>
        </div>
        <div className="step">
          <img src={imagePaths.step3} className="stepimg" alt="Step 3" />
          <p className="steptext">Try it on freely to view all its details</p>
        </div>
      </div>
      <button className="centerbtn" onClick={handleClick}>
        Get Started
      </button>
    </div>
  );
};

export default Hands;
