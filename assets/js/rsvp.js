/* ============================================================
   rsvp.js — handles the RSVP form. Entries are stored in
   localStorage (key: "wedding_wishes") so they also appear in
   the guestbook. For a production event, swap the `saveEntry`
   function to POST to your own backend / Google Sheet / etc.
   ============================================================ */
(function () {
  "use strict";

  const STORAGE_KEY = "wedding_wishes";

  function readEntries() {
    try {
      return JSON.parse(window.localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  }

  function saveEntry(entry) {
    const entries = readEntries();
    entries.unshift(entry);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    document.dispatchEvent(new CustomEvent("wedding:wish-added", { detail: entries }));
  }

  function attendanceLabel(value) {
    return { hadir: "Hadir", tidak: "Tidak Hadir", ragu: "Masih Ragu" }[value] || value;
  }

  function initForm() {
    const form = document.getElementById("rsvpForm");
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("rsvpName").value.trim();
      const attendance = document.getElementById("rsvpAttendance").value;
      const guests = document.getElementById("rsvpGuests").value;
      const message = document.getElementById("rsvpMessage").value.trim();

      if (!name || !attendance) return;

      saveEntry({
        name,
        attendance,
        attendanceLabel: attendanceLabel(attendance),
        guests: Number(guests) || 1,
        message,
        timestamp: new Date().toISOString(),
      });

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalLabel = submitBtn.textContent;
      submitBtn.textContent = "Terkirim, terima kasih!";
      submitBtn.disabled = true;

      window.setTimeout(() => {
        form.reset();
        submitBtn.textContent = originalLabel;
        submitBtn.disabled = false;
      }, 2200);
    });
  }

  document.addEventListener("DOMContentLoaded", initForm);
})();
