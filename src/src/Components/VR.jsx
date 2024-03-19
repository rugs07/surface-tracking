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
        <div>VR</div>
    )
}

export default VR