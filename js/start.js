let sameOpenBox = document.getElementById("same-openbox");
let j4container = document.getElementById("j4container");
let retrycamscreen = document.getElementById("retrycamscreen");
let isError = false;

localStorage.openpages = Date.now();
var onLocalStorageEvent = function (e) {
  if (e.key == "page_available") {
    sameOpenBox.style.display = "block";
    j4container.style.display = "none";
    isError = true;
  }

  if (e.key == "openpages") {
    // Listen if anybody else is opening the same page!
    localStorage.page_available = Date.now();
  }
};

window.addEventListener("storage", onLocalStorageEvent, false);
