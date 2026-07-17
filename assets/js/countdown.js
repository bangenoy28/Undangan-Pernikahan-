/* ============================================================
   countdown.js — live countdown to the akad/event date
   ============================================================ */
(function () {
  "use strict";

  let timerId = null;

  function pad(n) { return String(n).padStart(2, "0"); }

  function tick(targetDate) {
    const now = new Date().getTime();
    const distance = targetDate - now;

    const els = {
      days: document.getElementById("cd-days"),
      hours: document.getElementById("cd-hours"),
      minutes: document.getElementById("cd-minutes"),
      seconds: document.getElementById("cd-seconds"),
    };

    if (distance <= 0) {
      if (timerId) clearInterval(timerId);
      Object.values(els).forEach((el) => el && (el.textContent = "00"));
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((distance / (1000 * 60)) % 60);
    const seconds = Math.floor((distance / 1000) % 60);

    if (els.days) els.days.textContent = pad(days);
    if (els.hours) els.hours.textContent = pad(hours);
    if (els.minutes) els.minutes.textContent = pad(minutes);
    if (els.seconds) els.seconds.textContent = pad(seconds);
  }

  function initCountdown(config) {
    const targetDate = new Date(config.event.date).getTime();
    if (Number.isNaN(targetDate)) return;
    tick(targetDate);
    timerId = window.setInterval(() => tick(targetDate), 1000);
  }

  document.addEventListener("wedding:config-ready", (e) => initCountdown(e.detail));
})();
