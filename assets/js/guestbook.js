/* ============================================================
   guestbook.js — renders the list of wishes/ucapan collected
   through the RSVP form (see rsvp.js). Reads from the same
   localStorage key so both stay in sync.
   ============================================================ */
(function () {
  "use strict";

  const STORAGE_KEY = "wedding_wishes";
  const PAGE_SIZE = 5;
  let visibleCount = PAGE_SIZE;

  function readEntries() {
    try {
      return JSON.parse(window.localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
  }

  function formatDate(iso) {
    try {
      return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
    } catch {
      return "";
    }
  }

  function render() {
    const list = document.getElementById("guestbookList");
    const loadMoreBtn = document.getElementById("loadMoreWishes");
    if (!list) return;

    const entries = readEntries().filter((e) => e.message);

    if (entries.length === 0) {
      list.innerHTML = `<p class="guestbook__empty">Jadilah yang pertama mengirimkan ucapan dan doa melalui formulir konfirmasi di atas.</p>`;
      if (loadMoreBtn) loadMoreBtn.hidden = true;
      return;
    }

    const shown = entries.slice(0, visibleCount);
    list.innerHTML = shown.map((entry) => `
      <div class="wish">
        <div class="wish__head">
          <span>${escapeHtml(entry.name)}</span>
          <span class="wish__badge">${escapeHtml(entry.attendanceLabel || "")} · ${formatDate(entry.timestamp)}</span>
        </div>
        <p class="wish__text">${escapeHtml(entry.message)}</p>
      </div>
    `).join("");

    if (loadMoreBtn) {
      loadMoreBtn.hidden = entries.length <= visibleCount;
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    render();
    const loadMoreBtn = document.getElementById("loadMoreWishes");
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener("click", () => {
        visibleCount += PAGE_SIZE;
        render();
      });
    }
  });

  document.addEventListener("wedding:wish-added", render);
})();
