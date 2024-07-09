import React from "react";
import Home from "./Components/Home";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { JewelsProvider } from "./context/JewelsContext";
import VR from "./Components/VR/VR";
import HandTrackingComponent from "./Components/AR/HandTrackingComponent";
import Hands from "./Components/Loading-Screen/Hands";
import { VariableProvider } from "./context/variableContext";
import { GlobalFunctionsProvider } from "./context/ARContext";
import { GlobalFaceFunctionsProvider } from "./context/FaceContext";
import Showhandscreen from "./Components/AR/Showhandscreen";
import FaceTrackingComponent from "./Components/AR/FaceTrackingComponent";

const App = () => {
  return (
    <VariableProvider>
      <JewelsProvider>
        <GlobalFunctionsProvider>
          <GlobalFaceFunctionsProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/VR" element={<VR />} />
                <Route path="/AR" element={<HandTrackingComponent />} />
                <Route path="/Loading" element={<Hands />} />
                <Route path="/test" element={<FaceTrackingComponent />} />
              </Routes>
            </BrowserRouter>
          </GlobalFaceFunctionsProvider>
        </GlobalFunctionsProvider>
      </JewelsProvider>
    </VariableProvider>
  );
};

export default App;
