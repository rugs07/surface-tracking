import React, { useState, useEffect } from "react";
import { useJewels } from "../../context/JewelsContext";
import { useNavigate } from "react-router-dom";
import "../../css/style.css"; // Create a new CSS file for modal styles

const HandsModal = ({ isOpen, onClose }, isLoaded) => {
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

  if (!isOpen) return null;

  return (
    <div className="modals-overlay" onClick={onClose}>
      <div className="modals-content" onClick={(e) => e.stopPropagation()}>
        <h2>Try on with 3 simple steps!</h2>
        <div className="steps-Container">
          <div className="steps">
            <img src={imagePaths.step1} alt="Step 1" />
            <p>Place your hand vertically in front of the camera</p>
          </div>
          <div className="steps">
            <img src={imagePaths.step2} alt="Step 2" />
            <p>Set the jewellery on your hand correctly</p>
          </div>
          <div className="steps">
            <img src={imagePaths.step3} alt="Step 3" />
            <p>Try it on freely to view all its details</p>
          </div>
        </div>
        {!isLoaded ? (
          <button className="modal-Button" onClick={onClose}>
            Getting started...
          </button>
        ) : <button className="modal-Button" onClick={onClose}>
          get Started
        </button>}
      </div>
    </div>
  );
};

export default HandsModal;
