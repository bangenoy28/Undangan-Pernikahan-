/* ============================================================
   music.js — background music toggle. Starts automatically the
   moment the guest opens the invitation (most browsers allow
   audio after a user gesture, which "Buka Undangan" provides),
   and can be muted/unmuted anytime via the nav button.
   ============================================================ */
(function () {
  "use strict";

  let audioEl = null;
  let toggleBtn = null;

  function setPlayingState(isPlaying) {
    if (toggleBtn) toggleBtn.setAttribute("aria-pressed", String(isPlaying));
  }

  function play() {
    if (!audioEl) return;
    audioEl.play().then(() => setPlayingState(true)).catch(() => setPlayingState(false));
  }

  function pause() {
    if (!audioEl) return;
    audioEl.pause();
    setPlayingState(false);
  }

  function initMusic(config) {
    audioEl = document.getElementById("bgMusic");
    toggleBtn = document.getElementById("musicToggle");
    if (!audioEl || !config.music || !config.music.src) return;

    audioEl.src = config.music.src;

    if (toggleBtn) {
      toggleBtn.setAttribute("aria-label", "Putar/hentikan musik: " + (config.music.title || ""));
      toggleBtn.addEventListener("click", () => {
        if (audioEl.paused) play(); else pause();
      });
    }
  }

  // Start music right when the guest opens the envelope (user gesture present).
  document.addEventListener("wedding:invitation-opened", play);
  document.addEventListener("wedding:config-ready", (e) => initMusic(e.detail));
})();
