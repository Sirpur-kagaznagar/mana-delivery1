// 1. ALWAYS change this version (e.g., v3, v4, v5) whenever you update index.html
const CACHE_NAME = "mana-delivery-v2"; 
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./logo.png",
  "./icon-192.png",
  "./icon-512.png"
];

// Install: Save new files to the phone
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(c => {
      console.log("Saving new assets to cache");
      return c.addAll(ASSETS);
    })
  );
  // Force the new code to take over immediately
  self.skipWaiting(); 
});

// Activate: DELETE the old cache so users don't see old pricing/buttons
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log("Clearing old cache:", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  // Ensure the new service worker controls all open tabs immediately
  return self.clients.claim();
});

// Fetch: Serve the new files
self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});
