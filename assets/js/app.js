/* ============================================================
   app.js — bootstraps the invitation: loads config.json,
   populates content, handles the envelope reveal, nav & UX bits.
   Other modules (countdown/gallery/rsvp/guestbook/maps) listen
   for the "wedding:config-ready" event dispatched from here.
   ============================================================ */
(function () {
  "use strict";

  window.WEDDING_CONFIG = null;

  function fireConfigReady(config) {
    window.WEDDING_CONFIG = config;
    document.dispatchEvent(new CustomEvent("wedding:config-ready", { detail: config }));
  }

  async function loadConfig() {
    try {
      const res = await fetch("config/config.json");
      if (!res.ok) throw new Error("config.json not found");
      const config = await res.json();
      fireConfigReady(config);
    } catch (err) {
      console.error("[app.js] Failed to load config.json:", err);
    }
  }

  function getGuestNameFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const to = params.get("to") || params.get("nama") || params.get("guest");
    return to ? decodeURIComponent(to.replace(/\+/g, " ")) : null;
  }

  function formatLongDate(isoString) {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
    } catch {
      return "";
    }
  }

  function populateContent(config) {
    const { couple, event, gift } = config;

    // Guest name on cover
    const guestName = getGuestNameFromUrl();
    const guestEl = document.getElementById("guestName");
    if (guestEl && guestName) guestEl.textContent = guestName;

    // Hero
    const heroDateEl = document.getElementById("heroDate");
    if (heroDateEl) heroDateEl.textContent = formatLongDate(event.date);
    const quoteEl = document.getElementById("coupleQuote");
    if (quoteEl) quoteEl.textContent = "\u201C" + couple.quote + "\u201D";

    // Couple
    setText("groomName", couple.groom.fullName);
    setText("groomParents", couple.groom.parents);
    setLink("groomIg", "https://instagram.com/" + couple.groom.instagram.replace("@", ""), couple.groom.instagram);
    setText("brideName", couple.bride.fullName);
    setText("brideParents", couple.bride.parents);
    setLink("brideIg", "https://instagram.com/" + couple.bride.instagram.replace("@", ""), couple.bride.instagram);

    // Event details
    setText("akadLabel", event.akad.label);
    setText("akadTime", event.akad.time);
    setText("akadPlace", event.akad.place);
    setText("akadAddress", event.akad.address);
    setText("resepsiLabel", event.resepsi.label);
    setText("resepsiTime", event.resepsi.time);
    setText("resepsiPlace", event.resepsi.place);
    setText("resepsiAddress", event.resepsi.address);

    // Story timeline
    const timeline = document.getElementById("storyTimeline");
    if (timeline && Array.isArray(config.story)) {
      timeline.innerHTML = config.story.map((item) => `
        <div class="story__item reveal">
          <p class="story__year">${escapeHtml(item.year)}</p>
          <h3 class="story__title">${escapeHtml(item.title)}</h3>
          <p class="story__text">${escapeHtml(item.text)}</p>
        </div>
      `).join("");
    }

    // Gift
    if (gift) {
      setText("giftBank", gift.bank);
      setText("giftNumber", gift.accountNumber);
      setText("giftName", "a.n. " + gift.accountName);
    }

    document.title = `${couple.groom.nickname} & ${couple.bride.nickname} — Undangan Pernikahan`;
    initRevealObserver();
  }

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el && value != null) el.textContent = value;
  }
  function setLink(id, href, label) {
    const el = document.getElementById(id);
    if (el) { el.href = href; el.textContent = label; }
  }
  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
  }

  function initRevealObserver() {
    const revealEls = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window) || revealEls.length === 0) {
      revealEls.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach((el) => observer.observe(el));
  }
  // Exposed so modules that inject content after this file runs
  // (gallery.js, etc.) can re-scan for newly added ".reveal" elements.
  window.initRevealObserver = initRevealObserver;

  function markSectionsForReveal() {
    document.querySelectorAll(
      "#couple, #countdown-section, #acara, #gallery, #rsvp, #guestbook, #gift"
    ).forEach((section) => section.classList.add("reveal"));
  }

  function initEnvelope() {
    const openBtn = document.getElementById("openInvitation");
    const cover = document.getElementById("cover");
    const mainContent = document.getElementById("mainContent");

    if (!openBtn || !cover || !mainContent) return;

    openBtn.addEventListener("click", () => {
      cover.classList.add("is-closing");
      document.dispatchEvent(new CustomEvent("wedding:invitation-opened"));
      window.setTimeout(() => {
        cover.setAttribute("hidden", "");
        mainContent.removeAttribute("hidden");
        markSectionsForReveal();
        initRevealObserver();
        window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
      }, 900);
    }, { once: true });
  }

  function initNavScroll() {
    const nav = document.getElementById("mainNav");
    const backToTop = document.getElementById("backToTop");
    if (!nav) return;
    window.addEventListener("scroll", () => {
      const scrolled = window.scrollY > 80;
      nav.classList.toggle("is-scrolled", scrolled);
      if (backToTop) backToTop.hidden = window.scrollY < 400;
    }, { passive: true });

    if (backToTop) {
      backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    }
  }

  function initAddToCalendar() {
    const btn = document.getElementById("addToCalendar");
    if (!btn) return;
    btn.addEventListener("click", () => {
      const config = window.WEDDING_CONFIG;
      if (!config) return;
      const start = new Date(config.event.date);
      const end = new Date(start.getTime() + 6 * 60 * 60 * 1000);
      const toIcs = (d) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
      const title = `Pernikahan ${config.couple.groom.nickname} & ${config.couple.bride.nickname}`;
      const details = `${config.event.akad.label}: ${config.event.akad.time}\\n${config.event.resepsi.label}: ${config.event.resepsi.time}`;
      const location = config.event.resepsi.address;
      const ics = [
        "BEGIN:VCALENDAR", "VERSION:2.0", "BEGIN:VEVENT",
        `DTSTART:${toIcs(start)}`, `DTEND:${toIcs(end)}`,
        `SUMMARY:${title}`, `DESCRIPTION:${details}`, `LOCATION:${location}`,
        "END:VEVENT", "END:VCALENDAR"
      ].join("\r\n");
      const blob = new Blob([ics], { type: "text/calendar" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "undangan-pernikahan.ics";
      link.click();
      URL.revokeObjectURL(link.href);
    });
  }

  function initCopyGift() {
    const btn = document.getElementById("copyGift");
    if (!btn) return;
    btn.addEventListener("click", async () => {
      const config = window.WEDDING_CONFIG;
      if (!config) return;
      try {
        await navigator.clipboard.writeText(config.gift.accountNumber);
        const original = btn.textContent;
        btn.textContent = "Tersalin!";
        window.setTimeout(() => (btn.textContent = original), 1800);
      } catch {
        alert("Nomor rekening: " + config.gift.accountNumber);
      }
    });
  }

  document.addEventListener("wedding:config-ready", (e) => populateContent(e.detail));

  document.addEventListener("DOMContentLoaded", () => {
    initEnvelope();
    initNavScroll();
    initAddToCalendar();
    initCopyGift();
    loadConfig();
  });
})();
