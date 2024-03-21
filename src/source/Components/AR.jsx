import React from 'react'

const AR = () => {
    
    return (

        <div class="main-container">
            <div class="title-container tryon-title" id="tryon-title" onclick="gotoHome()">
                <img src="assets/logo.png" class="logoimg" />
                <h2 class="sitename">3D Experiences that uplift sales</h2>
            </div>
            <div class="side-errors" id="side-errors">
            </div>
            <div class="viewer-container" id="viewer-container">
                <video class="input_video"></video>
                <canvas class="output_canvas"></canvas>
                <div class="control-panel">
                </div>

                <div id="error"></div>
                <div id="viewspacecontainer">
                    <div id="progress-container">
                        <dialog open id="progress-dialog">
                            <p>
                                <label for="progress-indicator">Loading ...</label>
                            </p>
                            <progress max="100" id="progress-indicator"></progress>
                        </dialog>
                    </div>

                    <div class="ar-toggle-container" id="ar-toggle-container">
                        <button class="desktop-viewar" id="desktop-viewar" onclick="showManual()">Try On</button>
                        <h2 id="updatenote">Welcome to JAR4U</h2>
                        <div class="gsplatButtonDiv">
                            <span class="gsplatSoundEffect"><img class="audioImg" width="25px"
                                src="./assets/audio-off-svgrepo-com.svg" /></span>
                            <span class="gsplatBackgroundEffect"><img class="backImg" width="28px"
                                src="./assets/moon-svgrepo-com.svg" /></span>
                        </div>

                    </div>

                    <div id="Loading">
                        {/* <p id="funorfact">Tip: For best AR experience, make sure that no major light source is behind you.</p>  */}
                    </div>
                    <div id="loading-container">
                        <div role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="--value: 0"></div>
                        <p class="progresstext">Crafting artwork of stars</p>
                    </div>
                    <canvas id="gsplatCanvas"></canvas>
                    <audio class="audioElement">
                        <source src="./assets/audion.mp3" type="audio/mp3" />
                    </audio>
                </div>
                <div id="usermanual">
                    <h3 class="trytitle">Try on with 3 simple steps !</h3>
                    <div class="allsteps">
                        <div class="step">
                            <img src="" class="stepimg" id="step1img" />
                            <p class="steptext">
                                Place your hand vertically in front of camera
                            </p>
                        </div>
                        <div class="step">
                            <img src="" class="stepimg" id="step2img" />
                            <p class="steptext">Set the jewellery on your hand correctly</p>
                        </div>
                        <div class="step">
                            <img src="assets/banglestep3.gif" class="stepimg" id="step3img" />
                            <p class="steptext">Try it on freely to view all its details</p>
                        </div>
                    </div>
                    <button class="centerbtn disabledbtn" type="button" id="getstartedbtn" disabled>
                        Setting up
                    </button>
                </div>
                <div id="retrycamscreen">
                    <h4 class="trytitle">Looks like your camera is already being accessed by another application(s)</h4>
                    <h4 class="trytitle">
                        Please close your camera on that application(s) and Try again !
                    </h4>
                    <div class="allsteps">
                        <div class="errorstep">
                            <img src="assets/no-camerafeed.png" class="errorimg" id="step1img" />
                        </div>
                    </div>
                    <button class="centerbtn" type="button" id="retrycambtn" onclick="showManual()">
                        Try again
                    </button>
                </div>
                <div id="showhandscreen">
                    <div class="camerasection">
                        <p>Place your hand vertically as shown below</p>
                        <img src="assets/hand.png" class="handimg" />
                        <button class="primarybtn" type="button" onclick="toggleVideo()">Stop AR</button>
                        <button class="primarybtn switchbtn" onclick="switchFacingMode()" id="switchbtn">
                            <img src="assets/switch.png" class="switchimg" />
                        </button>
                    </div>
                    <div class="rowar">
                        <div class="jewel-container ar-jewel" onclick="changeJewellery('jewel7_lr')" id="jewel7_lr">
                            <img src="assets/diamondbracelet.png" class="jewelimg" />
                            <div class="selectarea">
                                <button type="button">Diamond Bracelet</button>
                            </div>
                        </div>
                        <div
                            class="jewel-container ar-jewel"
                            onclick="changeJewellery('grt_11_single')"
                            id="grt_11_single"
                        >
                            <img src="assets/triveni.png" class="jewelimg" />
                            <div class="selectarea">
                                <button type="button">Blossom Bangle</button>
                            </div>
                        </div>
                        <div class="jewel-container ar-jewel" onclick="changeJewellery('b4_gen3')" id="b4_gen3">
                            <img src="assets/flowerban.png" class="jewelimg" />
                            <div class="selectarea">
                                <button type="button">Flower Bangle</button>
                            </div>
                        </div>
                        <div class="jewel-container ar-jewel" onclick="changeJewellery('laxmi_exp')" id="laxmi_exp">
                            <img src="assets/laxmi.png" class="jewelimg" />
                            <div class="selectarea">
                                <button type="button">Laxmi Bangle</button>
                            </div>
                        </div>
                        <div class="jewel-container ar-jewel" onclick="changeJewellery('jewel3_lr')" id="jewel3_lr">
                            <img src="assets/queen.png" class="jewelimg" />
                            <div class="selectarea">
                                <button type="button">Queen's Ring</button>
                            </div>
                        </div>
                        <div class="jewel-container ar-jewel" onclick="changeJewellery('jewel26_lr')" id="jewel26_lr">
                            <img src="assets/flower.png" class="jewelimg" />
                            <div class="selectarea">
                                <button type="button">Flower Ring</button>
                            </div>
                        </div>
                        <div class="jewel-container ar-jewel" onclick="changeJewellery('jewel21_lr')" id="jewel21_lr">
                            <img src="assets/heart.png" class="jewelimg" />
                            <div class="selectarea">
                                <button type="button">Heart Ring</button>
                            </div>
                        </div>
                        <div class="jewel-container ar-jewel" onclick="changeJewellery('jewel1_lr')" id="jewel1_lr">
                            <img src="assets/sunny.png" class="jewelimg" />
                            <div class="selectarea">
                                <button type="button">Sunny Ring</button>
                            </div>
                        </div>
                        <div class="jewel-container ar-jewel" onclick="changeJewellery('jewel25_lr')" id="jewel25_lr">
                            <img src="assets/redeye.png" class="jewelimg" />
                            <div class="selectarea">
                                <button type="button">Red Eye Ring</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="ar-bottom-container mobile-viewer" id="ar-bottom-container">
                    <button id="mobile-viewar" onclick="showManual()">Try On</button>
                </div>
            </div>
        </div>
    );
};
export default AR;