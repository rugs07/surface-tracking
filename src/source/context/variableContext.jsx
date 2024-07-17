import React, { createContext, useContext, useState } from "react";

export const VariableContext = createContext();

export const VariableProvider = ({ children }) => {
  const [handPointsX, setHandPointsX] = useState(0);
  const [cameraFarVar, setCameraFarVar] = useState(0);
  const [cameraNearVar, setCameraNearVar] = useState(0);
  const [handPointsY, setHandPointsY] = useState(0);
  const [handPointsZ, setHandPointsZ] = useState(0);
  const [autorotate, setAutorotate] = useState(false);
  const [autorotateSpeed, setAutorotateSpeed] = useState(0.002);
  const [defaultLightBg, setDefaultLightBg] = useState('radial-gradient(#fcf2f3,#dfc0bf)');
  const [gSceneParams, setGSceneParams] = useState(null);
  const [varX, setVarX] = useState(2);
  const [varY, setVarY] = useState(2);
  const [varZ, setVarZ] = useState(2);
  const [transVar, setTransVar] = useState(1);
  const [ringTrans, setRingTrans] = useState(1.5);
  const [YRMul, setYRMul] = useState(1);
  const [translation, setTranslation] = useState(true);
  const [horizontalRotation, setHorizontalRotation] = useState(true);
  const [verticalRotation, setVerticalRotation] = useState(true);
  const [XYRotation, setXYRotation] = useState(true);
  const [resize, setResize] = useState(true);
  const [XRAngle, setXRAngle] = useState(0.0);
  const [YRAngle, setYRAngle] = useState(0.0);
  const [ZRAngle, setZRAngle] = useState(0.0);
  const [earZoom1, setEarZoom1] = useState(0.1);
  const [earZoom2, setEarZoom2] = useState(0.1);
  const [XTrans, setXTrans] = useState(0);
  const [YTrans, setYTrans] = useState(0);
  const [XRDelta, setXRDelta] = useState(0.015);
  const [YRDelta, setYRDelta] = useState(-3.55);
  const [YRDelta2, setYRDelta2] = useState(-3.55);
  const [ZRDelta, setZRDelta] = useState(1.6);
  const [isMobile, setIsMobile] = useState(true);
  const [isIOS, setIsIOS] = useState(false);
  const [browserName, setBrowserName] = useState('');
  const [jewelType, setJewelType] = useState("");
  const [rawBaseTheta, setRawBaseTheta] = useState(0);
  const [baseTheta, setBaseTheta] = useState(0);
  const [baseThetaVR, setBaseThetaVR] = useState(0);
  const [baseThetaAR, setBaseThetaAR] = useState(0);
  const [basePhi, setBasePhi] = useState(0);
  const [basePhiVR, setBasePhiVR] = useState(0);
  const [basePhiAR, setBasePhiAR] = useState(0);
  const [baseGama, setBaseGama] = useState(0);
  const [baseGamaVR, setBaseGamaVR] = useState(0);
  const [baseGamaAR, setBaseGamaAR] = useState(0);
  const [selectedJewel, setSelectedJewel] = useState('');
  const [resolution, setResolution] = useState(336);
  const [handLabels, setHandLabels] = useState("");
  const [aspectRatio, setAspectRatio] = useState(1);
  const [crop, setCrop] = useState(1);
  const [scaleMul, setScaleMul] = useState(0.5);
  const [scaleMulObjVR, setScaleMulObjVR] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [loadPercentage, setLoadPercentage] = useState('0');
  const [glamCanvas, setGlamCanvas] = useState(null);
  const [cameraFar, setCameraFar] = useState(100);
  const [cameraNear, setCameraNear] = useState(0.1);
  const [isMultiTouch, setIsMultiTouch] = useState(false);
  const [gLastFrame, setGLastFrame] = useState(window.performance.now());
  const [gNearPlane, setGNearPlane] = useState(0.33);
  const [gRayMarchScene, setGRayMarchScene] = useState(null);
  const [gLoadedRGBATextures, setGLoadedRGBATextures] = useState(0);
  const [gLoadedFeatureTextures, setGLoadedFeatureTextures] = useState(0);
  const [cameraControls, setCameraControls] = useState(null);
  const [arcballControls, setArcballControls] = useState(null);
  const [clock, setClock] = useState(null);
  const [currThetha, setCurrThetha] = useState(0);
  const [currPhi, setCurrPhi] = useState(0);
  const [rowArType, setRowArType] = useState("")
  // const [gDisplayMode, setGDisplayMode] = useState(DisplayModeType.DISPLAY_DIFFUSE);
  const [gNumTextures, setGNumTextures] = useState(0);
  const [gRenderer, setGRenderer] = useState(null);
  const [gCamera, setGCamera] = useState(null);
  const [gBlitCamera, setGBlitCamera] = useState(null);
  const [isVideo, setIsVideo] = useState(false);
  const [camera, setCamera] = useState(null);
  const [facingMode, setFacingMode] = useState('user');
  const [isDirectionalRing, setIsDirectionalRing] = useState(true);
  const [isArcball, setIsArcball] = useState(false);
  const [loadFeatures, setLoadFeatures] = useState(false);
  const [enableSmoothing, setEnableSmoothing] = useState(true);
  const [enableRingTransparency, setEnableRingTransparency] = useState(true);
  const [showingJewel, setShowingJewel] = useState(1);
  const [lastMidRef, setLastMidRef] = useState(null);
  const [lastRefOfMid, setLastRefOfMid] = useState(null);
  const [lastPinkyRef, setLastPinkyRef] = useState(null);
  const [lastIndexRef, setLastIndexRef] = useState(null);
  const [totalTransX, setTotalTransX] = useState(0);
  const [totalTransY, setTotalTransY] = useState(0);
  const [isvisible1,setIsvisible1] = useState(true);
  const [isvisible2,setIsvisible2] = useState(true);

  const contextValue = {
    autorotate,
    setAutorotate,
    isvisible1,
    setIsvisible1,
    isvisible2,
    setIsvisible2,
    autorotateSpeed,
    setAutorotateSpeed,
    defaultLightBg,
    setDefaultLightBg,
    gSceneParams,
    setGSceneParams,
    varX,
    setVarX,
    varY,
    setVarY,
    varZ,
    setVarZ,
    transVar,
    setTransVar,
    ringTrans,
    setRingTrans,
    YRMul,
    setYRMul,
    translation,
    setTranslation,
    horizontalRotation,
    setHorizontalRotation,
    verticalRotation,
    setVerticalRotation,
    XYRotation,
    setXYRotation,
    resize,
    setResize,
    XRAngle,
    setXRAngle,
    YRAngle,
    setYRAngle,
    ZRAngle,
    setZRAngle,
    XTrans,
    setXTrans,
    YTrans,
    setYTrans,
    XRDelta,
    setXRDelta,
    YRDelta,
    YRDelta2,
    setYRDelta,
    setYRDelta2,
    ZRDelta,
    setZRDelta,
    isMobile,
    setIsMobile,
    isIOS,
    setIsIOS,
    browserName,
    setBrowserName,
    jewelType,
    setJewelType,
    rawBaseTheta,
    setBaseTheta,
    baseThetaVR,
    setBaseThetaVR,
    baseThetaAR,
    setBaseThetaAR,
    basePhi,
    setBasePhi,
    basePhiVR,
    setBasePhiVR,
    basePhiAR,
    setBasePhiAR,
    baseGama,
    setBaseGama,
    baseGamaVR,
    setBaseGamaVR,
    baseGamaAR,
    setBaseGamaAR,
    selectedJewel,
    setSelectedJewel,
    resolution,
    setResolution,
    handLabels,
    setHandLabels,
    aspectRatio,
    setAspectRatio,
    crop,
    setCrop,
    scaleMul,
    setScaleMul,
    scaleMulObjVR,
    setScaleMulObjVR,
    isLoading,
    setIsLoading,
    loadPercentage,
    setLoadPercentage,
    glamCanvas,
    setGlamCanvas,
    cameraFar,
    setCameraFar,
    cameraNear,
    setCameraNear,
    isMultiTouch,
    setIsMultiTouch,
    gLastFrame,
    setGLastFrame,
    gNearPlane,
    setGNearPlane,
    gRayMarchScene,
    setGRayMarchScene,
    gLoadedRGBATextures,
    setGLoadedRGBATextures,
    gLoadedFeatureTextures,
    setGLoadedFeatureTextures,
    cameraControls,
    setCameraControls,
    arcballControls,
    setArcballControls,
    clock,
    setClock,
    currThetha,
    setCurrThetha,
    currPhi,
    setCurrPhi,
    // gDisplayMode,
    // setGDisplayMode,
    gNumTextures,
    setGNumTextures,
    gRenderer,
    setGRenderer,
    gCamera,
    setGCamera,
    gBlitCamera,
    setGBlitCamera,
    isVideo,
    setIsVideo,
    camera,
    setCamera,
    facingMode,
    setFacingMode,
    isDirectionalRing,
    setIsDirectionalRing,
    isArcball,
    setIsArcball,
    loadFeatures,
    setLoadFeatures,
    enableSmoothing,
    setEnableSmoothing,
    enableRingTransparency,
    setEnableRingTransparency,
    showingJewel,
    setShowingJewel,
    lastMidRef,
    setLastMidRef,
    lastRefOfMid,
    setLastRefOfMid,
    lastPinkyRef,
    setLastPinkyRef,
    lastIndexRef,
    setLastIndexRef,
    totalTransX,
    setTotalTransX,
    totalTransY,
    setTotalTransY,
    totalTransX,
    setTotalTransX,
    totalTransY,
    setEarZoom1,
    earZoom1,
    earZoom2,
    setEarZoom2,
    handPointsX,
    handPointsY,
    handPointsZ,
    setHandPointsX,
    setHandPointsY,
    setHandPointsZ,
    cameraFarVar,
    setCameraFarVar,
    cameraNearVar,
    setCameraNearVar,
    rowArType,
    setRowArType

  };

  return (
    <VariableContext.Provider value={contextValue}>
      {children}
    </VariableContext.Provider>
  );
};

export const useVariables = () => useContext(VariableContext);
