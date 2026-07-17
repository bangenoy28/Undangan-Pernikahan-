/* ============================================================
   service-worker.js — caches the app shell so the invitation
   still opens (last-seen content) without a network connection.
   Bump CACHE_NAME whenever you change any cached file.
   ============================================================ */
const CACHE_NAME = "wedding-invitation-v5.1";

const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./config/config.json",
  "./assets/css/style.css",
  "./assets/css/themes.css",
  "./assets/css/animation.css",
  "./assets/css/responsive.css",
  "./assets/js/app.js",
  "./assets/js/music.js",
  "./assets/js/countdown.js",
  "./assets/js/gallery.js",
  "./assets/js/rsvp.js",
  "./assets/js/guestbook.js",
  "./assets/js/maps.js",
  "./assets/js/pwa.js",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  // Network-first for the map iframe / external requests, cache-first for the app shell.
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const network = fetch(event.request)
        .then((response) => {
          if (response && response.status === 200 && event.request.url.startsWith(self.location.origin)) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
