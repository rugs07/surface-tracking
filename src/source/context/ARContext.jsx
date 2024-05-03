// GlobalFunctionsContext.js
import * as THREE from 'three';
import React, { createContext, useContext } from 'react';
import { useVariables } from './variableContext';

// Create a context for your global functions
const GlobalFunctionsContext = createContext();

export const GlobalFunctionsProvider = ({ children }) => {
    let zArr = [];
    let rsArr = [];
    let yArr = [];
    let xtArr = [];
    let ytArr = [];
    // const gsplatCanvas = document.getElementById("gsplatCanvas");
    // Define your globally accessible functions
    let { setHandPointsX,
        setHandPointsY,
        setHandPointsZ, setWristZoom, XRAngle, XRDelta, setXRDelta, setYRDelta, enableRingTransparency, XTrans, YTrans, translation, YRAngle, enableSmoothing, facingMode, verticalRotation, jewelType, horizontalRotation, totalTransX, totalTransY, lastMidRef, ZRAngle, lastRefOfMid, handLabel, YRDelta, lastPinkyRef, lastIndexRef, isMobile, selectedJewel, scaleMul, cameraNear, cameraFar, resize, isArcball,setCameraFarVar,setCameraNearVar } = useVariables()
    // const { calculateAngleAtMiddle } = ARFunctions()
    function rotateX(angle) {
        if (isArcball) {
            var quaternion = new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(1, 0, 0),
                angle
            );

            gCamera.position.applyQuaternion(quaternion);
            gCamera.up.applyQuaternion(quaternion);
            gCamera.quaternion.multiplyQuaternions(quaternion, gCamera.quaternion);
        } else {
            // cameraControls.rotate(0, angle, false);
        }

        XRAngle = angle;
        XRDelta = THREE.MathUtils.degToRad(-XRAngle);
        setXRDelta(XRDelta)
        // (
        //   THREE.MathUtils.radToDeg(XRAngle),
        //   THREE.MathUtils.radToDeg(YRAngle),
        //   THREE.MathUtils.radToDeg(ZRAngle)
        // );
    }

    function rotateY(angle) {
        // if (isArcball) {
        //   var quaternion = new THREE.Quaternion().setFromAxisAngle(
        //     new THREE.Vector3(0, 1, 0),
        //     
        //   );
        //   gCamera.position.applyQuaternion(quaternion);
        //   gCamera.up.applyQuaternion(quaternion);
        //   gCamera.quaternion.multiplyQuaternions(quaternion, gCamera.quaternion);
        // } else {
        //   // cameraControls.rotate(angle, 0, false);
        //   // Using Show zone to not show the part which was placed on for recording

        //   let showZone = [-90, 90];
        //   if (selectedJewel === "flowerbangle") showZone = [-60, 90];

        //   if (angle > showZone[0] && angle < showZone[1]) {
        //     // cameraControls.azimuthAngle = THREE.MathUtils.degToRad(angle) + baseTheta;
        //   }
        //   // (
        //   //   "yangle",
        //   //   angle.toFixed(2),
        //   //   THREE.MathUtils.radToDeg(baseTheta).toFixed(2),
        //   //   handLabel
        //   // );
        // }
        console.log(1, angle);
        YRAngle = angle;
        console.log(2);

        if (
            (handLabel === "Right" && facingMode !== "environment") ||
            (handLabel === "Left" && facingMode === "environment")
        ) {
            console.log(3, handLabel, facingMode);
            YRDelta = THREE.MathUtils.degToRad(90 - YRAngle);
            console.log(4, YRDelta);
            console.log(YRAngle, 'YRDelta');
            setYRDelta(YRDelta)
        }
        else {
            console.log(5);
            YRDelta = THREE.MathUtils.degToRad(-90 - YRAngle)
            console.log(6, YRDelta);
        }
        console.log(7);
        // gsplatCanvas.style.tranform = 'inherit';
        console.log(YRDelta, 'yr delta ')
        return YRDelta;
    }

    const mapRange = (value, oldMin, oldMax, newMin, newMax) => {
        console.log(8);
        const oldRange = oldMax - oldMin;
        console.log(9);
        const newRange = newMax - newMin;

        const newValue = ((value - oldMin) * newRange) / oldRange + newMin;

        return newValue;
    }

    // To normalize angles between 0 to 360 deg
    function normalizeAngle(angle) {
        // Normalize the angle to the range of -180 to 180 degrees
        angle = angle % 360;

        // Map the angle to the equivalent angle in the range of 0 to 360 degrees
        if (angle < -180) {
            angle += 360;
        } else if (angle > 180) {
            angle -= 360;
        }
        return angle;
    }

    function rotateZ(angle, canX, canY) {
        (canX, canY, 'canxandy');
        let canP = 0;
        // cameraControls.setFocalOffset(canX, canY, 0.0, false);
        let adjustmentFactor = window.innerWidth * 0.5;
        let transform = null;
        if (!translation) transform = "rotateZ(" + angle + "deg)";
        else canP = canX - adjustmentFactor;
        transform =
            "translate3d(" +
            canP +
            "px, " +
            canY +
            "px, " +
            0 +
            "px) rotateZ(" +
            angle +
            "deg)";
        (transform, "can's");
        gsplatCanvas.style.transform = transform;

        ZRAngle = angle;
        XTrans = canX;
        YTrans = canY;
        // ZRDelta = THREE.MathUtils.degToRad(180 - ZRAngle);
    }

    function convertRingTransRange(value) {
        const oldMin = -25;
        const oldMax = 25;
        const newMin = 25;
        const newMax = 65;
        return ((value - oldMin) * (newMax - newMin)) / (oldMax - oldMin) + newMin;
    }

    function getYAngleAndRotate(newIndexRef, newPinkyRef, zAngle) {
        // rotate vectors around y-axis by -zAngle
        console.log(10);
        let rotatedNewIndexRef = rotateVectorZ(newIndexRef, -zAngle);
        console.log(11);
        let rotatedNewPinkyRef = rotateVectorZ(newPinkyRef, -zAngle);
        console.log(12);
        // the arctangent of the slope is the angle of the hand with respect to the x-axis
        let yAngle = -Math.atan2(
            rotatedNewPinkyRef.z - rotatedNewIndexRef.z,
            rotatedNewPinkyRef.x - rotatedNewIndexRef.x,
            console.log(13)
        );
        // make show zone from -90 to 
        console.log(14);
        yAngle = THREE.MathUtils.radToDeg(yAngle) - 90;
        console.log(15);
        if (facingMode === "environment") {
            console.log(16);
            yAngle += 180;
            console.log(17);
        }
        console.log(18);
        let normYAngle = normalizeAngle(yAngle);
        console.log(19);

        const baseNear = 0.0975;
        console.log(20);
        const phonethreshold = 0.015;
        console.log(21);
        if (jewelType === "bangle" && enableRingTransparency) {
            console.log(22);
            let transparencyZone = [-25, 25];
            console.log(23);
            if (normYAngle > transparencyZone[0] && normYAngle < transparencyZone[1]) {
                console.log(24);
                cameraNear = 4.9525;
                console.log(25);
                if (selectedJewel === "jewel26_lr") {
                    cameraNear = 4.925;
                    if (isMobile || isIOS) {
                        cameraNear += phonethreshold + 0.005;;
                    }
                } // for flowerring
                if (selectedJewel === "jewel1_lr") {
                    cameraNear = 4.93;
                    if (isMobile || isIOS) {
                        cameraNear += phonethreshold;
                    }
                } // for sunny ring
                if (selectedJewel === "jewel25_lr") {
                    cameraNear = 4.915;
                    if (isMobile || isIOS) {
                        cameraNear += phonethreshold + 0.015;
                    }
                } // for red eye ring
                if (selectedJewel === "jewel21_lr") {
                    cameraNear = 4.935;
                    if (isMobile || isIOS) {
                        cameraNear += phonethreshold + 0.01;
                    }
                } // for Heart ring
                if (selectedJewel === "jewel3_lr") {
                    cameraNear = 4.94;
                    if (isMobile || isIOS) {
                        cameraNear += phonethreshold;
                    }
                } // for Queen's Ring

                // converting angles to new range -20 to 20 -> 20 - 60 for transparency;
                console.log(99);
                normYAngle = convertRingTransRange(normYAngle);
                console.log(100);
            } else {
                // if (normYAngle > 0) normYAngle += 0.5;
                // else normYAngle -= 0.5;
                console.log(26);
                cameraNear = baseNear + scaleMul * 0.01;
                console.log(27);
            }
        }

        // previous code
        if (enableSmoothing) {
            console.log("enablesmoothing");
            let diff = normYAngle - YRAngle;
            yArr.push(diff); // Insert new value at the end
            console.log(diff, 'differ', yArr.length);
            if (yArr.length > 3) {
                yArr.shift(); // Remove first index value

                // Check if all 5 values are either positive or negative
                var allSameSign = yArr.every(function (value) {
                    return (value >= 0 && diff >= 0) || (value < 0 && diff < 0);
                });

                if (!allSameSign) {
                    normYAngle = YRAngle;
                }
            }
        }


        if (horizontalRotation) {
            // if (normYAngle > 90) normYAngle = 90;
            // else if (normYAngle < -90) normYAngle = -90;
            console.log(50);
            rotateY(-normYAngle);
            console.log(51, rotateY(-normYAngle));
        } else if (verticalRotation) {
            console.log(52);
            if (normYAngle > 90) {
                console.log(53);
                normYAngle = 90
                console.log(54);
            }
            else if (normYAngle < -90) {
                console.log(55);
                normYAngle = -90
                console.log(56);
            };
            console.log(57);
            rotateY(-normYAngle);
            console.log(58);
        }
        console.log(59);
        newPinkyRef = lastPinkyRef;
        console.log(60);
        newIndexRef = lastIndexRef;
        console.log(61);
    }

    function getXAngleAndRotate(wrist, newRefOfMid, zAngle) {
        // const gsplatCanvas = document.getElementById('gsplatCanvas');
        if (lastRefOfMid) {
            // rotate vectors around y-axis by -zAngle
            newRefOfMid = rotateVectorZ(newRefOfMid, -zAngle);
            wrist = rotateVectorZ(wrist, -zAngle);

            const dy = newRefOfMid.y - wrist.y;
            const dz = newRefOfMid.z - wrist.z;

            let xAngle = Math.atan2(dy, dz);
            xAngle = THREE.MathUtils.radToDeg(xAngle) + 65;

            // Normalize the angle to the range of -180 to 180 degrees
            let normXAngle = normalizeAngle(xAngle);

            if (normXAngle < -10) normXAngle = -10;
            if (normXAngle > 10) normXAngle = 10;
            // gsplatCanvas.style.transform = `rotateX(${normXAngle}deg)`;

            xArr.shift(); // Remove first index value
            rotateX(normXAngle);
        }

        newRefOfMid = lastRefOfMid;
    }

    function rotateVectorZ(vector, angle) {
        angle = THREE.MathUtils.degToRad(angle); // if the angle is in degrees, convert it to radians

        let sin = Math.sin(angle);
        let cos = Math.cos(angle);

        let rotatedVector = {};
        rotatedVector.x = vector.x * cos - vector.y * sin;
        rotatedVector.y = vector.x * sin + vector.y * cos;
        rotatedVector.z = vector.z;

        return rotatedVector;
    }

    function getZAngleAndRotate(wrist, newMidRef, canX, canY) {
        if (lastMidRef) {
            const dy = newMidRef.y - wrist.y;
            const dx = newMidRef.x - wrist.x;

            let zAngle = Math.atan2(dy, dx);
            zAngle = THREE.MathUtils.radToDeg(zAngle) + 90;

            // Normalize the angle to the range of -180 to 180 degrees
            let normZAngle = normalizeAngle(zAngle);

            if (enableSmoothing) {
                console.log(enableSmoothing, 'enabled');
                // Calculate the angle difference between the current and the new angle
                const angleDifference = ZRAngle - normZAngle;
                console.log(angleDifference, 'angdiff');
                // ("z rot:", ZRAngle, angleDifference, zAngle, normZAngle);

                zArr.push(angleDifference); // Insert new value at the end
                console.log(zArr, 'zarr');
                if (zArr.length > 3) {
                    zArr.shift(); // Remove first index value
                    // Check if all 5 values are either positive or negative
                    var allSameSign = zArr.every(function (value) {
                        return (
                            (value >= 0 && angleDifference >= 5) ||
                            (value < 0 && angleDifference < -5)
                        );
                    });

                    if (!allSameSign) {
                        normZAngle = ZRAngle;
                    }
                }
                const XDiff = XTrans - canX;
                console.log(XDiff, 'xdiff');

                xtArr.push(XDiff); // Insert new value at the end

                if (xtArr.length > 3) {
                    xtArr.shift(); // Remove first index value
                    // Check if all 5 values are either positive or negative
                    var allSameSign = xtArr.every(function (value) {
                        return (value >= 0 && XDiff >= 0) || (value < 0 && XDiff < 0);
                    });

                    if (!allSameSign) {
                        canX = XTrans;
                    }
                }

                const YDiff = YTrans - canY;
                console.log(YDiff, 'y diff');
                ytArr.push(YDiff); // Insert new value at the end

                if (ytArr.length > 3) {
                    ytArr.shift(); // Remove first index value
                    // Check if all 5 values are either positive or negative
                    var allSameSign = ytArr.every(function (value) {
                        return (value >= 0 && YDiff >= 0) || (value < 0 && YDiff < 0);
                    });

                    if (!allSameSign) {
                        canY = YTrans;
                    }
                }
            }

            // normZAngle *= 0.85;
            if (isMobile || isIOS) {
                if (jewelType === "bangle") normZAngle *= 1;
            }

            rotateZ(normZAngle, canX, canY);
        }

        lastMidRef = newMidRef;
    }

    function getNormalizedXTSub(value) {
        // define the old and new ranges
        const oldMin = 0;
        const oldMax = 1;
        let newMin, newMax;

        if (jewelType === "bangle") {
            newMin = 0.44;
            newMax = 0.56;
        } else if (jewelType === "ring") {
            newMin = 0.435;
            newMax = 0.525;
        }

        // apply the formula to normalize the value
        const normalizedValue =
            ((value - oldMin) / (oldMax - oldMin)) * (newMax - newMin) + newMin;

        // return the normalized value
        return normalizedValue;
    }

    function getNormalizedYTSub(value) {
        // define the old and new ranges
        const oldMin = 0;
        const oldMax = 1;
        let newMin = 0.4;
        let newMax = 0.55;

        // apply the formula to normalize the value
        const normalizedValue =
            ((value - oldMin) / (oldMax - oldMin)) * (newMax - newMin) + newMin;

        // return the normalized value
        return normalizedValue;
    }

    // euclidean distance
    function euclideanDistance(a, b) {
        return Math.sqrt(
            Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2) + Math.pow(a.z - b.z, 2)
        );
    }
    // manhattan distance
    function manhattanDistance(a, b) {
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y) + Math.abs(a.z - b.z);
    }

    function calculateWristSize(points, YRAngle, ZRAngle, foldedHand) {
        // calculate wrist size as distance between wrist and first knuckle and distance between thumb knuckle and pinky knuckle on first frame and then adjust for scale using wrist.z value
        // let wristSize = manhattanDistance(points[0], points[5]);
        // wristSize += manhattanDistance(points[9], points[17]);
        // wristSize /= 2;

        let wristSize = euclideanDistance(points[0], points[9]);
        console.log(wristSize, 'wristSize');
        // if (diff <= 0.1) {
        //     const newSize = kfResize.filter(wristSize);
        //     ("origsize", wristSize, "filtered", newSize);
        //     wristSize = newSize;
        // }

        let YTAdd = Math.abs(Math.sin(THREE.MathUtils.degToRad(ZRAngle)));
        let foldResize =
            YTAdd *
            Math.abs(Math.cos(THREE.MathUtils.degToRad(YRAngle))) *
            (1 - foldedHand / 20);

        if (isMobile || isIOS) {
            const mulVal = mapRange(YTAdd, 0, 1, 1, 1.1);
            wristSize *= mulVal;

            wristSize *= mapRange(foldResize, 0, 1, 1, 0.5);
        } else {
            const mulVal = mapRange(YTAdd, 0, 1, 1, 1.25);
            wristSize *= mulVal * 1.6;

            wristSize *= mapRange(foldResize, 0, 1, 1, 0.65);
        }

        lastSize = wristSize;
        // setWristZoom(wristSize)
        console.log(wristSize, 'wristSize');
        return wristSize;

    }

    let lastSize = null; mapRange

    function smoothResizing(wristSize) {
        if (enableSmoothing) {
            let diff = 0;
            if (lastSize) {
                diff = wristSize - lastSize;

                rsArr.push(diff); // Insert new value at the end

                if (rsArr.length > 3) {
                    rsArr.shift(); // Remove first index value

                    // Check if all 5 values are either positive or negative
                    var allSameSign = rsArr.every(function (value) {
                        return (value >= 0 && diff >= 0) || (value < 0 && diff < 0);
                    });

                    if (!allSameSign) return lastSize;
                }
            }
        }
        return wristSize;
    }

    //function to use mediapipe hand prediction data for translation and rotation
    function translateRotateMesh(points, handLabel, isPalmFacing, sourceImage) {
        if (!points || points.length === 0) {
            // Handle the case where points is null or empty
            return;
        }

        // (points, 'points');
        // (handLabel, 'handlabel');
        // (isPalmFacing, 'palm');
        // (sourceImage, 'sourceImage');
        let wrist = points[0];
        let firstKnuckle = points[5];
        let thumbTip = points[4];
        let pinkyTip = points[20];
        // (wrist.x, firstKnuckle, "trm logs");
        let pinkyKnuckle = {
            x: (points[17].x + points[18].x) / 2.0,
            y: (points[17].y + points[18].y) / 2.0,
            z: (points[17].z + points[18].z) / 2.0,
        };
        let midKnuckle = points[9];
        let midTop = points[12];
        let midPip = points[10];
        let ringPos = {
            x: (points[13].x + points[14].x) / 2.0,
            y: (points[13].y + points[14].y) / 2.0,
            z: (points[13].z + points[14].z) / 2.0,
        };

        // (wrist);

        let stayPoint = null;
        // (wrist, "before setting");
        if (verticalRotation) {
            if (jewelType === "bangle") {
                if (handLabel === "Left") {
                    stayPoint = {
                        x: wrist.x - 0.01, // Adjust the x-coordinate to move slightly to the side
                        y: wrist.y + 1.035, // Adjust the y-coordinate to move slightly below
                        z: wrist.z, // Keep the z-coordinate the same
                    };
                } else if (handLabel === "Right") {
                    stayPoint = {
                        x: wrist.x, // Adjust the x-coordinate to move slightly to the side
                        y: wrist.y + 100.035, // Adjust the y-coordinate to move slightly below
                        z: wrist.z, // Keep the z-coordinate the same
                    };
                }
            } else if (jewelType === "ring") {
                stayPoint = ringPos;
            }
        }
        if (horizontalRotation) {
            if (jewelType === "bangle") {
                if (handLabel === "Left") {
                    stayPoint = {
                        x: wrist.x - 0.015, // Adjust the x-coordinate to move slightly to the side
                        y: wrist.y, // Adjust the y-coordinate to move slightly below
                        z: wrist.z, // Keep the z-coordinate the same
                    };
                } else if (handLabel === "Right") {
                    stayPoint = {
                        x: wrist.x + 0.015, // Adjust the x-coordinate to move slightly to the side
                        y: wrist.y, // Adjust the y-coordinate to move slightly below
                        z: wrist.z, // Keep the z-coordinate the same
                    };
                }
            } else if (jewelType === "ring") {
                stayPoint = ringPos;
            }
            console.log(stayPoint.x, stayPoint.y, stayPoint.z, 'stayPoints');
            setHandPointsX(stayPoint.x)
            setHandPointsY(stayPoint.y)
            setHandPointsZ(stayPoint.z)
        }
        // (stayPoint);

        let foldedHand = calculateAngleAtMiddle(wrist, midKnuckle, midTop);
        // (foldedHand); // check foldedhand value
        //backhand open - 17, backhand closed - (0-1), fronthand open - (16-17) , fronthand closed = (4-7)

        let window_scale, canX, canY;
        let windowWidth = document.documentElement.clientWidth;
        let windowHeight = document.documentElement.clientHeight;
        windowWidth = window.screen.width;
        ("SourceImage height : ", sourceImage.height);
        ("SourceImage width : ", sourceImage.width);
        //old code

        (windowWidth, stayPoint.x, 'win height');
        if (windowWidth / windowHeight > sourceImage.width / sourceImage.height) {
            // Image is taller than the canvas, so we crop top & bottom & scale as per best fit of width
            canX = stayPoint.x * windowWidth - windowWidth / 2;
            // if(window.navigator.userAgent.includes("Firefox")){
            //   window_scale = (windowWidth/sourceImage.width) * 1.75;
            // }
            window_scale = windowWidth / sourceImage.width;
            canY =
                stayPoint.y * (sourceImage.height * window_scale) -
                (sourceImage.height * window_scale) / 2;

        } else {
            // Image is wider than the canvas, so we crop left & right & scale as per best fit of height
            canY = stayPoint.y * windowHeight - windowHeight / 2;
            window_scale = windowHeight / sourceImage.height;
            canX =
                stayPoint.x * (sourceImage.width * window_scale) -
                (sourceImage.width * window_scale) / 2;
        }


        (window_scale);

        // (sourceImage.height, windowHeight, sourceImage.width, windowWidth ) // Sample: 720 731 1280 1536
        // rotation & translation (getZAngleAndRotate also translates)
        // totalTransX = canX;

        totalTransX = canX
        totalTransY = canY
        // totalTransY = canY;
        if (jewelType === "bangle") {
            getZAngleAndRotate(wrist, midPip, canX, canY);
            getXAngleAndRotate(wrist, midPip, ZRAngle);
            getYAngleAndRotate(firstKnuckle, pinkyKnuckle, ZRAngle);
        } else if (jewelType === "ring") {
            if (isDirectionalRing) {
                getZAngleAndRotate(points[13], points[14], canX, canY);
                getXAngleAndRotate(points[13], points[14], ZRAngle);
            } else {
                if (
                    (handLabel === "Right" && facingMode !== "environment") ||
                    (handLabel === "Left" && facingMode === "environment")
                ) {
                    getZAngleAndRotate(points[14], points[13], canX, canY);
                    getXAngleAndRotate(points[14], points[13], ZRAngle);
                } else {
                    getZAngleAndRotate(points[13], points[14], canX, canY);
                    getXAngleAndRotate(points[13], points[14], ZRAngle);
                }
            }

            getYAngleAndRotate(firstKnuckle, pinkyKnuckle, ZRAngle);
        }

        // Resizing
        const dist = calculateWristSize(points, YRAngle, ZRAngle, foldedHand);

        let resizeMul;
        // (isPalmFacing);
        function calculateScaleAdjustment(foldedHand, isPalmFacing) {
            let scaleAdjustment = 1.0;

            // Define thresholds based on the observed folded hand angles
            const openHandThreshold = 16; // Average between backhand and fronthand open
            const closedHandThreshold = { backhand: 1, fronthand: 4 }; // Average for closed hand states

            // Adjust scale based on the folded hand angle and device type
            if (
                foldedHand >= closedHandThreshold.fronthand &&
                foldedHand <= openHandThreshold
            ) {
                // Hand is partially closed or in a natural state
                if (isMobile || isIOS) {
                    scaleAdjustment = 1.05; // Slightly larger adjustment for mobile devices
                } else {
                    scaleAdjustment = 1; // Smaller adjustment for laptops/desktops
                }
            } else if (foldedHand < closedHandThreshold.backhand) {
                // Hand is very closed
                scaleAdjustment = isPalmFacing ? 1.0 : 1.05; // Minor adjustment unless palm is facing, then no change
            }

            // No adjustment needed for fully open hand beyond openHandThreshold
            // as scaleAdjustment remains 1.0

            return scaleAdjustment;
        }



        let scaleAdjustment = calculateScaleAdjustment(foldedHand, isPalmFacing);

        if (jewelType === "bangle") {

            //previous code
            if (isMobile || isIOS) {
                resizeMul = window_scale * 3.0 * scaleAdjustment;
                if (handLabel === "Right" && isPalmFacing || handLabel === "Left" && !isPalmFacing) {
                    resizeMul *= 0.925;
                }
            } else {
                resizeMul = window_scale * 1.5 * scaleAdjustment;
            }

            if (selectedJewel !== "flowerbangle") resizeMul *= 1.25;
        } else if (jewelType === "ring") {
            let visibilityFactor =
                (handLabel === "Right" && !isPalmFacing) ||
                    (handLabel === "Left" && isPalmFacing)
                    ? 1.0
                    : 0.9;
            if (isMobile || isIOS) {
                resizeMul = window_scale * 1.2 * scaleAdjustment * visibilityFactor;
                // if (isPalmFacing) resizeMul *= 0.9;
            } else resizeMul = window_scale * 0.75 * scaleAdjustment * visibilityFactor;

            if (selectedJewel === "floralring") {
                resizeMul *= 0.9;
            }
        }

        let smoothenSize = smoothResizing(dist * resizeMul);
        setWristZoom(smoothenSize)
        // scaleMul = smoothenSize * 0.5;

        // Use if required
        // const baseNear = jewelType === "bangle" ? 0.093 : 0.0975;
        // cameraNear = baseNear + scaleMul * 0.01;

        if (jewelType === "bangle") {
            const baseNear = 0.093;
            cameraNear = baseNear + scaleMul * 0.01;
            setCameraNearVar(cameraNear);
        }

        const baseFar = jewelType === "bangle" ? 4.5 : 5.018;
        cameraFar = baseFar + scaleMul * 0.01;
        setCameraFarVar(cameraFar);
        console.log(cameraFar);

        // (cameraFar);
        // (cameraNear);
        // (scaleMul)

        // cameraControls.zoomTo(smoothenSize, false);
        // let transform = 'translate3d(10px, 20px, 0) rotateZ(45deg)'; 
        // gsplatCanvas.style.transform = transform;

        if (resize && isArcball)
            gCamera.position.set(gCamera.position.x, gCamera.position.y, 1 / dist);

    }




    const calculateAngleAtMiddle = (landmark1, landmark2, landmark3) => {
        // Calculate vectors between landmarks
        const vector1 = [
            landmark1.x - landmark2.x,
            landmark1.y - landmark2.y,
            landmark1.z - landmark2.z,
        ];
        const vector2 = [
            landmark3.x - landmark2.x,
            landmark3.y - landmark2.y,
            landmark3.z - landmark2.z,
        ];

        // Calculate dot product of the two vectors
        const dotProduct =
            vector1[0] * vector2[0] + vector1[1] * vector2[1] + vector1[2] * vector2[2];

        // Calculate magnitudes of the vectors
        const magnitude1 = Math.sqrt(
            vector1[0] * vector1[0] + vector1[1] * vector1[1] + vector1[2] * vector1[2]
        );
        const magnitude2 = Math.sqrt(
            vector2[0] * vector2[0] + vector2[1] * vector2[1] + vector2[2] * vector2[2]
        );

        // Calculate the cosine of the angle using dot product and magnitudes
        const cosAngle = dotProduct / (magnitude1 * magnitude2);

        // Calculate the angle in radians
        const angleInRadians = Math.acos(cosAngle);

        // Convert the angle to degrees
        const angleInDegrees = (angleInRadians * 180) / Math.PI;

        return Math.trunc(angleInDegrees / 10);
    }



    // Other globally accessible functions...

    // Provide the functions through the context value
    const contextValue = {
        rotateX,
        rotateY,
        normalizeAngle,
        rotateZ,
        mapRange,
        convertRingTransRange,
        getYAngleAndRotate,
        getXAngleAndRotate,
        rotateVectorZ,
        getZAngleAndRotate,
        getNormalizedXTSub,
        getNormalizedYTSub,
        euclideanDistance,
        manhattanDistance,
        calculateWristSize,
        smoothResizing,
        calculateAngleAtMiddle,
        translateRotateMesh
    };

    return (
        <GlobalFunctionsContext.Provider value={contextValue}>
            {children}
        </GlobalFunctionsContext.Provider>
    );
};

export const ARFunctions = () => useContext(GlobalFunctionsContext)