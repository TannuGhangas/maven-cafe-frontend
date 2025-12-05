/* ======================================================
   MAVEN CAFE — CLEAN & SAFE SERVICE WORKER (NO REFRESH BUG)
   ====================================================== */

const CACHE_NAME = "maven-cache-v3";

// Install — just skip waiting
self.addEventListener("install", () => {
  console.log("[SW] Installed");
  self.skipWaiting();
});

// Activate — delete old caches
self.addEventListener("activate", (event) => {
  console.log("[SW] Activated");

  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );

  self.clients.claim();
});

/* ======================================================
   FETCH HANDLER — NO HTML CACHING (fixes UI update delays)
   ====================================================== */

self.addEventListener("fetch", (event) => {
  const req = event.request;

  // ---------------------------
  // 1. NEVER CACHE API CALLS
  // ---------------------------
  if (
    req.url.includes("/orders") ||
    req.url.includes("/api/") ||
    req.url.includes("/status")
  ) {
    event.respondWith(fetch(req).catch(() => new Response("Offline", { status: 503 })));
    return;
  }

  // ---------------------------
  // 2. NEVER CACHE HTML (fixes update loop)
  // ---------------------------
  if (req.headers.get("accept")?.includes("text/html")) {
    event.respondWith(fetch(req));
    return;
  }

  // ---------------------------
  // 3. Cache-first for static files (images, css, js)
  // ---------------------------
  event.respondWith(
    caches.match(req).then((cacheRes) => {
      if (cacheRes) return cacheRes;

      return fetch(req)
        .then((netRes) => {
          // Only cache valid static assets
          if (
            netRes.ok &&
            !req.url.includes("/hot") &&
            !req.url.includes("vite")
          ) {
            const clone = netRes.clone();
            caches.open(CACHE_NAME).then((c) => c.put(req, clone));
          }
          return netRes;
        })
        .catch(() => cacheRes); // fallback if exists
    })
  );
});
