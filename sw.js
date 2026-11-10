// 펭이 다이어리 — offline cache. Bump VERSION whenever files change.
const VERSION = "pengi-diary-v70";
const FILES = [
  "./",
  "./fonts/Gaegu-Bold.woff2",
  "./fonts/Gaegu-Regular.woff2",
  "./fonts/Jua-Regular.woff2",
  "./icons/apple-touch-icon.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./images/face-angry.png",
  "./images/face-calm.png",
  "./images/face-excited.png",
  "./images/face-good.png",
  "./images/face-meh.png",
  "./images/face-sad.png",
  "./images/face-tired.png",
  "./images/face-worried.png",
  "./images/pengi-pointe-lift.png",
  "./images/pengi-pointe.png",
  "./images/pengi-pose.png",
  "./index.html",
  "./manifest.webmanifest",
];
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then((hit) => hit || fetch(e.request).then((res) => {
      if (res.ok && new URL(e.request.url).origin === location.origin) {
        const copy = res.clone(); caches.open(VERSION).then((c) => c.put(e.request, copy));
      }
      return res;
    }).catch(() => caches.match("./index.html")))
  );
});
