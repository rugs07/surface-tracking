// src/context/JewelsContext.js
import React, { createContext, useContext } from "react";

const JewelsContext = createContext();

export const JewelsProvider = ({ children }) => {
  const jewelsList = {
    // Your jewels list here
    b4_gen3: {
      name: "b4_gen3",
      label: "Flower Bangle",
      type: "bangle",
      baseThetaVR: 0.015, //var1
      basePhiVR: -3.55, //var2
      baseGamaVR: -1.6, //var3
      baseThetaAR: -0.05, //var4
      basePhiAR: -0.6, //var5
      baseGamaAR: -1.55, //var6
      scaleMulObjVR: 1.5,
      size: 0.7,
    },
    laxmi_exp: {
      name: "laxmi_exp",
      label: "Laxmi Bangle",
      type: "bangle",
      baseThetaVR: -0.05,
      basePhiVR: -0.1,
      baseGamaVR: -1.58,
      baseThetaAR: -0.08,
      basePhiAR: -0.6,
      baseGamaAR: -1.55,
      scaleMulObjVR: 1.55,
      size: 0.7,
    },
    // grt_11_single: {
    //   name: "grt_11_single",
    //   label: "Blossom Bangle",
    //   type: "bangle",
    //   baseThetaVR: -0.03,
    //   baseThetaAR: -0.05,
    //   basePhi: 0.5,
    //   baseGama: -1.58,
    // },
    jewel7_lr: {
      name: "jewel7_lr",
      label: "Rose Diamond Bracelet",
      type: "bangle",
      baseThetaVR: -0.02,
      basePhiVR: -1.1,
      baseGamaVR: 0,
      baseThetaAR: -0.05,
      basePhiAR: 0,
      baseGamaAR: 0.0,
      lightBackground: "radial-gradient(#333,#000)",
      size: 0.7,
    },
    jewel3_lr: {
      name: "jewel3_lr",
      label: "Queen's Ring",
      type: "ring",
      baseThetaVR: -0.00,
      basePhiVR: -0.0,
      baseGamaVR: -0.07,
      baseThetaAR: 0.005,
      basePhiAR: 2.57,
      baseGamaAR: -0.05,
      lightBackground: "radial-gradient(#333,#000)",
      size: 0.4,
    },
    jewel21_lr: {
      name: "jewel21_lr",
      label: "Heart Ring",
      type: "ring",
      baseThetaVR: -0.35,
      basePhiVR: -1.2,
      baseGamaVR: -1.5 + 1.57,
      baseThetaAR: -0.1,
      basePhiAR: 2.6,
      baseGamaAR: -1.5,
      lightBackground: "radial-gradient(#333,#000)",
      size: 0.4,
    },
    jewel25_lr: {
      name: "jewel25_lr",
      label: "Red Eye Ring",
      type: "ring",
      baseThetaVR: -0.25,
      basePhiVR: -1.4,
      baseGamaVR: -1.5 + 1.57,
      baseThetaAR: -0.05,
      basePhiAR: 1.995,
      baseGamaAR: -1.5,
      size: 0.4,
    },
    jewel1_lr: {
      name: "jewel1_lr",
      label: "Sunny Ring",
      type: "ring",
      baseThetaVR: -0.45,
      basePhiVR: -1.2,
      baseGamaVR: -1.5 + 1.57,
      baseThetaAR: 0.05,
      basePhiAR: 2.55,
      baseGamaAR: -1.45,
      lightBackground: "radial-gradient(#333,#000)",
      size: 0.4,
    },
    jewel26_lr: {
      name: "jewel26_lr",
      label: "Flower Ring",
      type: "ring",
      baseThetaVR: -0.45,
      basePhiVR: -1.2,
      baseGamaVR: -1.5 + 1.57,
      baseThetaAR: -0.06,
      basePhiAR: 2.55,
      baseGamaAR: 1.7,
      size: 0.4,
    },
    pots: {
      name: "pots",
      label: "Ancient Pots",
      type: "handicraft",
      baseThetaVR: 0,
      basePhiVR: 0,
      baseGamaVR: 0,
      baseThetaAR: 0,
      basePhiAR: 0,
      baseGamaAR: 0,
      lightBackground: "radial-gradient(#000,#000)",
      size: 0.38,
    },
    swan: {
      name: "swan",
      label: "Lively Swans",
      type: "handicraft",
      baseThetaVR: 0.1,
      basePhiVR: -0.5,
      baseGamaVR: 0.1,
      baseThetaAR: 0,
      basePhiAR: 0,
      baseGamaAR: 0,
      lightBackground: "radial-gradient(#000,#000)",
      size: 0.45,
    },
    natraj: {
      name: "natraj",
      label: "Natraj",
      type: "handicraft",
      baseThetaVR: 0,
      basePhiVR: 0,
      baseGamaVR: 0,
      baseThetaAR: 0,
      basePhiAR: 0,
      baseGamaAR: 0,
      lightBackground: "radial-gradient(#333,#000)",
      size: 0.86,
    },
    table_1: {
      name: "table_1",
      label: "Luxe Table",
      type: "handicraft",
      baseThetaVR: 0,
      basePhiVR: 0,
      baseGamaVR: 0,
      baseThetaAR: 0,
      basePhiAR: 0,
      baseGamaAR: 0,
      lightBackground: "radial-gradient(#333,#000)",
      size: 0.38,
    },
  };

  return (
    <JewelsContext.Provider value={{ jewelsList }}>
      {children}
    </JewelsContext.Provider>
  );
};

export const useJewels = () => useContext(JewelsContext);
