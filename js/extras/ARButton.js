class ARButton {
  static createButton(renderer, sessionInit = {}) {
    const placementDiv = document.getElementById("placement");
    const button = document.createElement("button");
    const glamCanvas = document.getElementById("glamCanvas");

    function showStartAR(/*device*/) {
      if (sessionInit.domOverlay === undefined) {
        const container = document.createElement("div");
        placementDiv.appendChild(container);

        const overlay = document.createElement("div");
        overlay.id = "trackOverlay";
        overlay.style.position = "absolute";
        overlay.style.top = "0px";
        overlay.style.left = "0px";
        container.appendChild(overlay);

        glamCanvas.style.position = "absolute";
        glamCanvas.style.top = "0px";
        glamCanvas.style.left = "0px";
        container.appendChild(glamCanvas);

        const svg = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "svg"
        );
        svg.setAttribute("width", 40);
        svg.setAttribute("height", 40);
        svg.style.position = "absolute";
        svg.style.right = "25px";
        svg.style.top = "25px";
        svg.style.marginLeft = "auto";
        svg.style.zIndex = "40";
        svg.addEventListener("click", function () {
          currentSession.end();
        });
        container.appendChild(svg);

        const path = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path"
        );
        path.setAttribute("d", "M 12,12 L 28,28 M 28,12 12,28");
        path.setAttribute("stroke", "#fff");
        path.setAttribute("stroke-width", 3);
        svg.appendChild(path);

        if (sessionInit.optionalFeatures === undefined) {
          sessionInit.optionalFeatures = [];
        }

        sessionInit.optionalFeatures.push("dom-overlay");
        sessionInit.domOverlay = { root: container };
      }

      let currentSession = null;

      async function onSessionStarted(session) {
        hideJewel();
        session.addEventListener("end", onSessionEnded);

        renderer.xr.setReferenceSpaceType("local");

        await renderer.xr.setSession(session);

        button.textContent = "Exit AR";
        sessionInit.domOverlay.root.style.display = "";

        currentSession = session;
      }

      function onSessionEnded(/*event*/) {
        currentSession.removeEventListener("end", onSessionEnded);

        button.textContent = "Try On";
        // sessionInit.domOverlay.root.style.display = "none";
        const placeCanvas = document.getElementById("placeCanvas");
        placeCanvas.style.display = "none";
        resetMeshForVR();

        currentSession = null;
      }

      button.style.display = "";

      // button.style.cursor = "pointer";
      // button.style.left = "calc(50% - 50px)";
      // button.style.width = "100px";

      button.textContent = "Try On";

      // button.onmouseenter = function () {
      //   button.style.opacity = "1.0";
      // };

      // button.onmouseleave = function () {
      //   button.style.opacity = "0.5";
      // };

      button.onclick = function () {
        if (currentSession === null) {
          navigator.xr
            .requestSession("immersive-ar", sessionInit)
            .then(onSessionStarted);
        } else {
          currentSession.end();
        }
      };
    }

    function disableButton() {
      // button.style.display = "";

      // button.style.cursor = "auto";
      // button.style.left = "calc(50% - 75px)";
      // button.style.width = "150px";

      button.classList.add("disabledbtn");

      button.onmouseenter = null;
      button.onmouseleave = null;

      button.onclick = null;
    }

    function showARNotSupported() {
      disableButton();

      button.textContent = "AR Not Supported";
    }

    function showARNotAllowed(exception) {
      disableButton();

      console.warn(
        "Exception when trying to call xr.isSessionSupported",
        exception
      );

      button.textContent = "AR Not Allowed";
    }

    function stylizeElement(element) {
      element.style.position = "absolute";
      element.style.bottom = "0px";
      // element.style.padding = "12px 6px";
      // element.style.border = "1px solid #fff";
      // element.style.borderRadius = "4px";
      // element.style.background = "rgba(0,0,0,0.1)";
      // element.style.color = "#fff";
      // element.style.font = "normal 13px sans-serif";
      // element.style.textAlign = "center";
      // element.style.opacity = "0.5";
      // element.style.outline = "none";
      // element.style.zIndex = "999";
    }

    if ("xr" in navigator) {
      button.id = "ARButton";
      // button.style.display = "none";

      if (isMobile || isIOS) stylizeElement(button);

      let viewARButton = isMobile || isIOS ? mobileViewAR : desktopViewAR;
      viewARButton.style.display = "none";

      navigator.xr
        .isSessionSupported("immersive-ar")
        .then(function (supported) {
          supported ? showStartAR() : showARNotSupported();
        })
        .catch(showARNotAllowed);

      return button;
    } else {
      const message = document.createElement("a");

      if (window.isSecureContext === false) {
        message.href = document.location.href.replace(/^http:/, "https:");
        message.innerHTML = "WebXR needs HTTPS"; // TODO Improve message
      } else {
        message.href = "https://immersiveweb.dev/";
        message.innerHTML = "WebXR not available";
      }

      // message.style.left = "calc(50% - 90px)";
      // message.style.width = "180px";
      message.style.textDecoration = "none";

      stylizeElement(message);

      return message;
    }
  }
}

export { ARButton };
