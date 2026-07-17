/* ============================================================
   gallery.js — renders the photo grid and lightbox viewer.
   Falls back to a soft placeholder if an image fails to load,
   so the layout stays intact before real photos are added to
   assets/images/.
   ============================================================ */
(function () {
  "use strict";

  function renderGallery(config) {
    const grid = document.getElementById("galleryGrid");
    if (!grid || !Array.isArray(config.gallery)) return;

    grid.innerHTML = config.gallery.map((item, i) => `
      <figure class="gallery__item reveal" data-index="${i}">
        <img src="${escapeHtml(item.src)}" alt="${escapeHtml(item.caption || "")}" loading="lazy">
      </figure>
    `).join("");

    // Attach fallbacks and click handlers in JS (avoids escaping pitfalls
    // that inline onerror="" attributes have with quotes in captions).
    grid.querySelectorAll(".gallery__item").forEach((el) => {
      const index = Number(el.dataset.index);
      const item = config.gallery[index];
      const img = el.querySelector("img");

      if (img) {
        img.addEventListener("error", () => {
          const placeholder = document.createElement("div");
          placeholder.className = "gallery__placeholder";
          placeholder.textContent = item.caption || "Foto";
          img.replaceWith(placeholder);
        }, { once: true });
      }

      el.addEventListener("click", () => openLightbox(config.gallery, index));
    });

    if (typeof window.initRevealObserver === "function") window.initRevealObserver();
  }

  function openLightbox(items, index) {
    const item = items[index];
    if (!item) return;
    const lightbox = document.getElementById("lightbox");
    const img = document.getElementById("lightboxImg");
    const caption = document.getElementById("lightboxCaption");
    if (!lightbox || !img) return;

    img.src = item.src;
    img.alt = item.caption || "";
    if (caption) caption.textContent = item.caption || "";
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    const lightbox = document.getElementById("lightbox");
    if (!lightbox) return;
    lightbox.hidden = true;
    document.body.style.overflow = "";
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
  }

  document.addEventListener("DOMContentLoaded", () => {
    const closeBtn = document.getElementById("lightboxClose");
    const lightbox = document.getElementById("lightbox");
    if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
    if (lightbox) lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLightbox(); });
  });

  document.addEventListener("wedding:config-ready", (e) => renderGallery(e.detail));
})();
