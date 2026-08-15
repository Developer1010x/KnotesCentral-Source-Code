/*
 * Offline support for the catalog. Pages are network-first (so notes stay
 * current on college wifi) with a cached fallback; static assets are
 * cache-first. Nothing here caches Drive or GitHub — only this origin.
 */
const VERSION = "knotes-v2";
const SHELL = `${VERSION}-shell`;
const PAGES = `${VERSION}-pages`;

// The site is a static export that may be served from a repository sub-path
// (…github.io/<repo>/). The worker's own scope is the only reliable source of
// that prefix, so every path below is built from it rather than hardcoded.
const BASE = new URL(self.registration.scope).pathname.replace(/\/$/, "");
const path = (route) => `${BASE}${route}`;

const OFFLINE_URL = path("/offline/");

const PRECACHE = [
  path("/"),
  path("/search/"),
  path("/saved/"),
  OFFLINE_URL,
  path("/manifest.webmanifest"),
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(SHELL)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => !key.startsWith(VERSION))
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Immutable build output — cache first.
  if (url.pathname.startsWith(path("/_next/static/"))) {
    event.respondWith(
      caches.match(request).then(
        (hit) =>
          hit ||
          fetch(request).then((response) => {
            const copy = response.clone();
            caches.open(SHELL).then((cache) => cache.put(request, copy));
            return response;
          })
      )
    );
    return;
  }

  // Pages — network first, fall back to whatever we have.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(PAGES).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() =>
          caches
            .match(request)
            .then((hit) => hit || caches.match(OFFLINE_URL))
            .then((hit) => hit || Response.error())
        )
    );
  }
});
