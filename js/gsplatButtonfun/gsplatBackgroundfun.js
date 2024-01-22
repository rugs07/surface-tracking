
//This is for Audio 
let soundButton = document.querySelector(".gsplatSoundEffect");
let audioElement = document.querySelector(".audioElement");
let AudioImage=document.querySelector(".audioImg");
soundButton.addEventListener("click", toggleAudio);
audioElement.style.display="none";
let audio = false;

function toggleAudio() {
    audio = !audio;
    if (audio) {
        audioElement.play();
        AudioImage.src="./assets/audio-svgrepo-com.svg"
    } else {
        audioElement.pause();
        AudioImage.src="./assets/audio-off-svgrepo-com.svg"
    }
}
//sun-svgrepo-com (1)
//./assets/moon-svgrepo-com.svg
//This is for Background
let BackgroundEffect = document.querySelector(".gsplatBackgroundEffect");
let viewContainer = document.querySelector("#viewspacecontainer");
let backImg = document.querySelector(".backImg");

BackgroundEffect.addEventListener("click", backgroundApply);

let background = true;

function backgroundApply() {
    background = !background;
    if (background) {
        viewContainer.style.background = "linear-gradient(to right, #1a1a1a, #444444)";
        backImg.src = "./assets/sun-svgrepo-com (1).svg";
    } else {
        viewContainer.style.background = "linear-gradient(to bottom, #fcf2f3, #b77d79)";
        backImg.src = "./assets/moon-svgrepo-com.svg";
    }
}

