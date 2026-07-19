/* ==========================================================
   app.js
   Wedding Invitation
   Part 1/5
========================================================== */

(() => {
"use strict";

/* ==========================================================
   SELECTOR
========================================================== */

const $ = (s, p = document) => p.querySelector(s);
const $$ = (s, p = document) => [...p.querySelectorAll(s)];

/* ==========================================================
   DOM
========================================================== */

const cover = $("#cover");
const mainContent = $("#mainContent");
const envelope = $("#envelope");
const openInvitation = $("#openInvitation");

const heroDate = $("#heroDate");
const coupleQuote = $("#coupleQuote");

const guestName = $("#guestName");

const groomName = $("#groomName");
const groomParents = $("#groomParents");
const groomIg = $("#groomIg");

const brideName = $("#brideName");
const brideParents = $("#brideParents");
const brideIg = $("#brideIg");

const akadLabel = $("#akadLabel");
const akadTime = $("#akadTime");
const akadPlace = $("#akadPlace");
const akadAddress = $("#akadAddress");

const resepsiLabel = $("#resepsiLabel");
const resepsiTime = $("#resepsiTime");
const resepsiPlace = $("#resepsiPlace");
const resepsiAddress = $("#resepsiAddress");

const mapsFrame = $("#mapsFrame");

const storyTimeline = $("#storyTimeline");
const galleryGrid = $("#galleryGrid");

const giftBank = $("#giftBank");
const giftNumber = $("#giftNumber");
const giftName = $("#giftName");

const copyGift = $("#copyGift");
const addCalendar = $("#addToCalendar");

const backToTop = $("#backToTop");

const bgMusic = $("#bgMusic");

/* ==========================================================
   GLOBAL
========================================================== */

let CONFIG = null;

let invitationOpened = false;

/* ==========================================================
   HELPER
========================================================== */

function setText(el, value = "") {

    if (!el) return;

    el.textContent = value;

}

function setLink(el, url = "#") {

    if (!el) return;

    el.href = url;

}

function create(tag, cls = "") {

    const e = document.createElement(tag);

    if (cls) e.className = cls;

    return e;

}

/* ==========================================================
   FORMAT DATE
========================================================== */

function formatDate(dateString) {

    try {

        return new Intl.DateTimeFormat("id-ID", {

            weekday: "long",

            day: "numeric",

            month: "long",

            year: "numeric"

        }).format(new Date(dateString));

    } catch {

        return dateString;

    }

}

/* ==========================================================
   GUEST NAME
========================================================== */

function loadGuestName() {

    const params = new URLSearchParams(location.search);

    const guest = params.get("to");

    if (!guest) return;

    guestName.textContent = decodeURIComponent(guest);

}

/* ==========================================================
   LOAD CONFIG
========================================================== */

async function loadConfig() {

    try {

        const response = await fetch(

            "config/config.json",

            {

                cache: "no-cache"

            }

        );

        if (!response.ok)

            throw new Error("config.json gagal dimuat");

        CONFIG = await response.json();

        populateData();

        document.dispatchEvent(

            new CustomEvent(

                "wedding:config-ready",

                {

                    detail: CONFIG

                }

            )

        );

    } catch (err) {

        console.error(err);

        alert("Tidak dapat memuat data undangan.");

    }

}
/* ==========================================================
   POPULATE DATA
========================================================== */

function populateData() {

    if (!CONFIG) return;

    /* ================= HERO ================= */

    setText(
        heroDate,
        formatDate(CONFIG.event.date)
    );

    setText(
        coupleQuote,
        CONFIG.couple.quote
    );

    /* ================= GROOM ================= */

    setText(
        groomName,
        CONFIG.couple.groom.fullName
    );

    setText(
        groomParents,
        CONFIG.couple.groom.parents
    );

    setLink(
        groomIg,
        "https://instagram.com/" +
        CONFIG.couple.groom.instagram.replace("@","")
    );

    /* ================= BRIDE ================= */

    setText(
        brideName,
        CONFIG.couple.bride.fullName
    );

    setText(
        brideParents,
        CONFIG.couple.bride.parents
    );

    setLink(
        brideIg,
        "https://instagram.com/" +
        CONFIG.couple.bride.instagram.replace("@","")
    );

    /* ================= EVENT ================= */

    setText(akadLabel, CONFIG.event.akad.label);
    setText(akadTime, CONFIG.event.akad.time);
    setText(akadPlace, CONFIG.event.akad.place);
    setText(akadAddress, CONFIG.event.akad.address);

    setText(resepsiLabel, CONFIG.event.resepsi.label);
    setText(resepsiTime, CONFIG.event.resepsi.time);
    setText(resepsiPlace, CONFIG.event.resepsi.place);
    setText(resepsiAddress, CONFIG.event.resepsi.address);

    /* ================= MAP ================= */

    if (mapsFrame) {

        mapsFrame.src =
            CONFIG.event.mapsEmbedUrl;

    }

    /* ================= MUSIC ================= */

    if (bgMusic && CONFIG.music) {

        bgMusic.src =
            CONFIG.music.src;

    }

    /* ================= GIFT ================= */

    setText(
        giftBank,
        CONFIG.gift.bank
    );

    setText(
        giftNumber,
        CONFIG.gift.accountNumber
    );

    setText(
        giftName,
        CONFIG.gift.accountName
    );

    /* ================= STORY ================= */

    renderStory();

    /* ================= GALLERY ================= */

    renderGallery();

}

/* ==========================================================
   STORY
========================================================== */

function renderStory() {

    if (!storyTimeline) return;

    storyTimeline.innerHTML = "";

    CONFIG.story.forEach(item => {

        const card = create(
            "article",
            "story__item reveal"
        );

        card.innerHTML = `

        <div class="story__year">
            ${item.year}
        </div>

        <h3 class="story__title">
            ${item.title}
        </h3>

        <p class="story__text">
            ${item.text}
        </p>

        `;

        storyTimeline.appendChild(card);

    });

}

/* ==========================================================
   GALLERY
========================================================== */

function renderGallery() {

    if (!galleryGrid) return;

    galleryGrid.innerHTML = "";

    CONFIG.gallery.forEach((photo,index)=>{

        const item = create(
            "div",
            "gallery__item reveal"
        );

        item.innerHTML = `

        <img
            src="${photo.src}"
            alt="${photo.caption}"
            loading="lazy"
            data-index="${index}"
            data-caption="${photo.caption}">

        `;

        galleryGrid.appendChild(item);

    });

    document.dispatchEvent(

        new CustomEvent(

            "gallery:loaded",

            {

                detail: CONFIG.gallery

            }

        )

    );

}
/* ==========================================================
   OPEN INVITATION
========================================================== */

function openInvitationHandler() {

    if (invitationOpened) return;

    invitationOpened = true;

    openInvitation.disabled = true;

    document.body.classList.add("is-loading");

    /* Animasi amplop */

    envelope.classList.add("is-opening");

    setTimeout(() => {

        cover.classList.add("fade-out");

    }, 500);

    setTimeout(() => {

        cover.hidden = true;

        mainContent.hidden = false;

        document.body.classList.remove("is-loading");

        requestAnimationFrame(() => {

            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });

        });

        /* Event untuk modul lain */

        document.dispatchEvent(

            new CustomEvent(

                "wedding:invitation-opened",

                {

                    detail: CONFIG

                }

            )

        );

    }, 1000);

}

/* ==========================================================
   COPY GIFT
========================================================== */

async function copyGiftNumber() {

    if (!CONFIG) return;

    try {

        await navigator.clipboard.writeText(

            CONFIG.gift.accountNumber

        );

        copyGift.textContent =

            "Berhasil Disalin";

        setTimeout(() => {

            copyGift.textContent =

                "Salin Nomor Rekening";

        }, 2000);

    } catch {

        alert(

            "Nomor rekening:\n\n" +

            CONFIG.gift.accountNumber

        );

    }

}

/* ==========================================================
   CALENDAR
========================================================== */

function addToCalendarHandler() {

    if (!CONFIG) return;

    const start =

        new Date(CONFIG.event.date);

    const end =

        new Date(

            start.getTime() +

            (3 * 60 * 60 * 1000)

        );

    const format = date =>

        date.toISOString()

        .replace(/[-:]/g,"")

        .split(".")[0] + "Z";

    const url =

        "https://calendar.google.com/calendar/render?action=TEMPLATE"

        + "&text="

        + encodeURIComponent(

            CONFIG.couple.groom.nickname +

            " & " +

            CONFIG.couple.bride.nickname

        )

        + "&dates="

        + format(start)

        + "/"

        + format(end)

        + "&location="

        + encodeURIComponent(

            CONFIG.event.resepsi.place

        );

    window.open(

        url,

        "_blank"

    );

}

/* ==========================================================
   BACK TO TOP
========================================================== */

function handleScroll() {

    if (

        window.scrollY >

        400

    ) {

        backToTop.hidden = false;

    } else {

        backToTop.hidden = true;

    }

}

function scrollTopHandler() {

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

}
/* ==========================================================
   REVEAL ANIMATION
========================================================== */

let revealObserver = null;

function initRevealAnimation() {

    if (!("IntersectionObserver" in window)) {

        $$(".reveal").forEach(el => {

            el.classList.add("show");

        });

        return;

    }

    revealObserver = new IntersectionObserver(

        entries => {

            entries.forEach(entry => {

                if (!entry.isIntersecting) return;

                entry.target.classList.add("show");

                revealObserver.unobserve(entry.target);

            });

        },

        {
            threshold: 0.15,
            rootMargin: "0px 0px -60px 0px"
        }

    );

    $$(".reveal").forEach(el => {

        revealObserver.observe(el);

    });

}

/* ==========================================================
   NAVBAR
========================================================== */

const nav = $("#mainNav");

function updateNavbar() {

    if (!nav) return;

    if (window.scrollY > 40) {

        nav.classList.add("nav--scrolled");

    } else {

        nav.classList.remove("nav--scrolled");

    }

}

/* ==========================================================
   REFRESH REVEAL
========================================================== */

function refreshReveal() {

    if (!revealObserver) {

        initRevealAnimation();

        return;

    }

    $$(".reveal").forEach(el => {

        if (!el.classList.contains("show")) {

            revealObserver.observe(el);

        }

    });

}

/* ==========================================================
   EVENT LISTENER
========================================================== */

function registerEvents() {

    if (openInvitation) {

        openInvitation.addEventListener(

            "click",

            openInvitationHandler

        );

    }

    if (copyGift) {

        copyGift.addEventListener(

            "click",

            copyGiftNumber

        );

    }

    if (addCalendar) {

        addCalendar.addEventListener(

            "click",

            addToCalendarHandler

        );

    }

    if (backToTop) {

        backToTop.addEventListener(

            "click",

            scrollTopHandler

        );

    }

    window.addEventListener(

        "scroll",

        () => {

            handleScroll();

            updateNavbar();

        },

        {

            passive: true

        }

    );

}

/* ==========================================================
   CUSTOM EVENT
========================================================== */

document.addEventListener(

    "gallery:loaded",

    () => {

        refreshReveal();

    }

);

document.addEventListener(

    "wedding:config-ready",

    () => {

        refreshReveal();

    }

);
/* ==========================================================
   INITIALIZATION
========================================================== */

function init() {

    /* Nama tamu dari URL */
    loadGuestName();

    /* Daftarkan semua event */
    registerEvents();

    /* Reveal awal */
    initRevealAnimation();

    /* Load konfigurasi */
    loadConfig();

    /* Posisi awal */
    handleScroll();

    updateNavbar();

}

/* ==========================================================
   DOM READY
========================================================== */

if (document.readyState === "loading") {

    document.addEventListener(

        "DOMContentLoaded",

        init

    );

} else {

    init();

}

/* ==========================================================
   PUBLIC EVENT
========================================================== */

/*
    Event yang tersedia untuk modul lain

    wedding:config-ready
    wedding:invitation-opened
    gallery:loaded

*/

/* ==========================================================
   SAFETY
========================================================== */

window.addEventListener(

    "pageshow",

    () => {

        handleScroll();

        updateNavbar();

    }

);

window.addEventListener(

    "resize",

    () => {

        refreshReveal();

    }

);

/* ==========================================================
   ERROR HANDLER
========================================================== */

window.addEventListener(

    "error",

    event => {

        console.error(

            "[Wedding]",

            event.message

        );

    }

);

window.addEventListener(

    "unhandledrejection",

    event => {

        console.error(

            "[Wedding]",

            event.reason

        );

    }

);

/* ==========================================================
   END
========================================================== */

})();      return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
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
