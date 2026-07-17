/* ============================================================
   pwa.js — registers the service worker so the invitation can
   be installed and viewed offline once loaded once.
   ============================================================ */
(function () {
  "use strict";

  if (!("serviceWorker" in navigator)) return;

  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js").catch((err) => {
      console.warn("[pwa.js] Service worker registration failed:", err);
    });
  });
})();
