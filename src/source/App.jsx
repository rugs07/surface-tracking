import React from "react";
import Home from "./Components/Home";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { JewelsProvider } from "./context/JewelsContext";
import VR from "./Components/VR";
import HandTrackingComponent from "./Components/AR/HandTrackingComponent";
import Hands from "./Components/Loading-Screen/Hands";
import { VariableProvider } from "./context/variableContext";
import { GlobalFunctionsProvider } from "./context/ARContext";

const App = () => {
  return (
    <VariableProvider>
      <GlobalFunctionsProvider>
        <JewelsProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/VR" element={<VR />} />
              <Route path="/AR" element={<HandTrackingComponent />} />
              <Route path="/Loading" element={<Hands />} />
            </Routes>
          </BrowserRouter>
        </JewelsProvider>
      </GlobalFunctionsProvider>
    </VariableProvider>
  );
};

export default App;
