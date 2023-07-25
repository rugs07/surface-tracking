localStorage.openpages = Date.now();
var onLocalStorageEvent = function (e) {
  if (e.key == "page_available") {
    showErrors([
      {
        error: "jar4u Error: Duplicate tabs at the same time",
        msg1: "Looks like you've opened our website on some other tab / browser as well",
        msg2: "For better performance, please use single tab at a time and close others",
        imgsrc: "duplicate-tabs.png",
        tryagain: true,
      },
    ]);
  }

  if (e.key == "openpages") {
    // Listen if anybody else is opening the same page!
    localStorage.page_available = Date.now();
  }
};

window.addEventListener("storage", onLocalStorageEvent, false);

// To test camera
// navigator.mediaDevices
//   .getUserMedia({
//     video: true,
//     audio: false,
//   })
//   .then((mediaStream) => {
//     const stream = mediaStream;
//     const tracks = stream?.getTracks();
//     if (tracks?.length) console.log(tracks);
//     // tracks.forEach((track) => track.stop());
//   })
//   .catch((err) => {
//     console.log(err);
//   });
