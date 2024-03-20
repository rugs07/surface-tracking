import React from "react";
import Home from "./Components/Home";
import { BrowserRouter,Routes, Route, useNavigate } from "react-router-dom";
import { JewelsProvider } from "./context/JewelsContext";

import VR from "./Components/VR";
const App = () => {
  return (
    <JewelsProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/VR" element={<VR />} /> 
      </Routes>
    </BrowserRouter>
    </JewelsProvider>
  );
};
//app.jsx
export default App;
