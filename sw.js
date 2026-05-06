const CACHE_NAME = 'naga-hitam-v1';
const assets = [
  '/',
  '/index.html',
  '/stats.html',
  '/style.css',
  '/app.js'
];

self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      cache.addAll(assets);
    })
  );
});

self.addEventListener('fetch', evt => {
  evt.respondWith(
    caches.match(evt.request).then(rec => {
      return rec || fetch(evt.request);
    })
  );
});
