/* ==========================================================
   service-worker.js
   Zaenal & Wulan Wedding Invitation
   Version 1.0.0
========================================================== */

"use strict";

/* ==========================================================
   CACHE
========================================================== */

const CACHE_NAME = "zw-wedding-v1.0.0";

/* ==========================================================
   FILES
========================================================== */

const ASSETS = [

    "./",

    "./index.html",

    "./manifest.json",

    "./config/config.json",

    "./assets/css/themes.css",
    "./assets/css/style.css",
    "./assets/css/animation.css",
    "./assets/css/responsive.css",

    "./assets/js/app.js",
    "./assets/js/music.js",
    "./assets/js/countdown.js",
    "./assets/js/gallery.js",
    "./assets/js/maps.js",
    "./assets/js/rsvp.js",
    "./assets/js/guestbook.js",
    "./assets/js/pwa.js",

    "./assets/icons/icon-192.png",
    "./assets/icons/icon-512.png"

];

/* ==========================================================
   INSTALL
========================================================== */

self.addEventListener(

    "install",

    event => {

        self.skipWaiting();

        event.waitUntil(

            caches.open(CACHE_NAME)

            .then(cache => {

                return cache.addAll(ASSETS);

            })

        );

    }

);

/* ==========================================================
   ACTIVATE
========================================================== */

self.addEventListener(

    "activate",

    event => {

        event.waitUntil(

            caches.keys()

            .then(keys => {

                return Promise.all(

                    keys.map(key => {

                        if(key !== CACHE_NAME){

                            return caches.delete(key);

                        }

                    })

                );

            })

            .then(() => self.clients.claim())

        );

    }

);

/* ==========================================================
   FETCH
========================================================== */

self.addEventListener(

    "fetch",

    event => {

        if(event.request.method !== "GET"){

            return;

        }

        event.respondWith(

            caches.match(event.request)

            .then(cacheResponse => {

                if(cacheResponse){

                    return cacheResponse;

                }

                return fetch(event.request)

                .then(networkResponse => {

                    if(

                        !networkResponse ||

                        networkResponse.status !== 200 ||

                        networkResponse.type !== "basic"

                    ){

                        return networkResponse;

                    }

                    const clone = networkResponse.clone();

                    caches.open(CACHE_NAME)

                    .then(cache => {

                        cache.put(

                            event.request,

                            clone

                        );

                    });

                    return networkResponse;

                });

            })

            .catch(() => {

                if(

                    event.request.mode === "navigate"

                ){

                    return caches.match("./index.html");

                }

            })

        );

    }

);

/* ==========================================================
   MESSAGE
========================================================== */

self.addEventListener(

    "message",

    event => {

        if(

            event.data &&

            event.data.type === "SKIP_WAITING"

        ){

            self.skipWaiting();

        }

    }

);

/* ==========================================================
   END
========================================================== */    caches.keys().then((keys) =>
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
