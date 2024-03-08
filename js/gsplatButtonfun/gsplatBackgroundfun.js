
//This is for Audio 
let soundButton = document.querySelector(".gsplatSoundEffect");
let audioElement = document.querySelector(".audioElement");
let AudioImage = document.querySelector(".audioImg");
soundButton.addEventListener("click", toggleAudio);
audioElement.style.display = "none";
let audio = true; // Set audio to true to indicate it's initially off

function toggleAudio() {
    audio = !audio; // Toggle the audio state
    if (!audio) { // If audio is now false (meaning it should be playing)
        audioElement.play(); // Play the audio
        AudioImage.src = "./assets/audio-svgrepo-com.svg"; // Change icon to 'audio on'
    } else {
        audioElement.pause(); // Pause the audio
        AudioImage.src = "./assets/audio-off-svgrepo-com.svg"; // Change icon to 'audio off'
    }
}
//sun-svgrepo-com (1)
//./assets/moon-svgrepo-com.svg
//This is for Background
let BackgroundEffect = document.querySelector(".gsplatBackgroundEffect");
let viewContainer = document.querySelector("#viewspacecontainer");
let backImg = document.querySelector(".backImg");

BackgroundEffect.addEventListener("click", backgroundApply);

let background = false;
const model = sessionStorage.getItem("selectedJewel");

function backgroundApply() {
    background = !background;
    if (background) {
        viewContainer.style.background = "#000";
        backImg.src = "./assets/sun-svgrepo-com (1).svg";
    } else {
        viewContainer.style.background = jewelsList[model].lightBackground || defaultLightBg;
        backImg.src = "./assets/moon-svgrepo-com.svg";
    }
}

