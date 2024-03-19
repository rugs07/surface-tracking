import React from 'react'
import * as SPLAT from "../../js/gsplat_j4u/index.js";//./gsplat_j4u/index.js


const canvas = document.getElementById("gsplatCanvas");
const progressDialog = document.getElementById("progress-dialog");
const progressIndicator = document.getElementById("progress-indicator");

const renderer = new SPLAT.WebGLRenderer(canvas);
const scene = new SPLAT.Scene();
const camera = new SPLAT.Camera();
const controls = new SPLAT.OrbitControls(camera, canvas);
console.log(controls)
console.log(renderer)
const VR = () => {
    return (
        <>
            <div id="error"></div>
            <div id="viewspacecontainer">
                {/* <div id="progress-container">
          <dialog open id="progress-dialog">
            <p>
              <label for="progress-indicator">Loading ...</label>
            </p>
            <progress max="100" id="progress-indicator"></progress>
          </dialog>
        </div>  */}

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
        </>
    )
}

export default VR