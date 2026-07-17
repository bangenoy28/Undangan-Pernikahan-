/* ============================================================
   maps.js — points the embedded map iframe at the venue
   defined in config.json (event.mapsEmbedUrl).
   ============================================================ */
(function () {
  "use strict";

  function initMap(config) {
    const frame = document.getElementById("mapsFrame");
    if (!frame || !config.event || !config.event.mapsEmbedUrl) return;
    frame.src = config.event.mapsEmbedUrl;
  }

  document.addEventListener("wedding:config-ready", (e) => initMap(e.detail));
})();
