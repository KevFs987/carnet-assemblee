// Garde le carnet sur l'appareil pour qu'il s'ouvre sans internet.
const CACHE = "carnet-d5a3020f4413";
const FICHIERS = ["./", "index.html", "manifest.webmanifest", "icone-180.png", "icone-512.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FICHIERS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((noms) => Promise.all(noms.filter((n) => n !== CACHE).map((n) => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});
// Le cache d'abord : une coupure de réseau ne change rien à l'affichage.
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request, {ignoreSearch: true}).then((r) => r || fetch(e.request).catch(() => caches.match("index.html")))
  );
});
