import React from "react";
import Home from "./Components/Home";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { JewelsProvider } from "./context/JewelsContext";
import VR from "./Components/VR/VR";
import HandTrackingComponent from "./Components/AR/HandTrackingComponent";
import Hands from "./Components/Loading-Screen/Hands";
import Face from "./Components/Loading-Screen/Face";
import { VariableProvider } from "./context/variableContext";
import { GlobalFunctionsProvider } from "./context/ARContext";
import { GlobalFaceFunctionsProvider } from "./context/FaceContext";
import Showhandscreen from "./Components/AR/Showhandscreen";
import FaceTrackingComponent from "./Components/AR/FaceTrackingComponent";
import Foottracking from "./Components/AR/Foottrackingcomponent";

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
                <Route path="/Loading1" element={<Face />} />
                <Route path="/face-ar" element={<FaceTrackingComponent />} />
                <Route path="/shoe" element={<Foottracking />} />
              </Routes>
            </BrowserRouter>
          </GlobalFaceFunctionsProvider>
        </GlobalFunctionsProvider>
      </JewelsProvider>
    </VariableProvider>
  );
};

export default App;
