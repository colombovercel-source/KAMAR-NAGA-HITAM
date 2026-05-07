const CACHE_NAME = 'naga-hitam-v11'; // Ganti versi setiap kali update besar

const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  'https://i.imgur.com/mF88miV.png', // Ikon Naga
  'https://i.imgur.com/bfrp75y.png'  // Background (WAJIB dicache biar gak berat)
];

// 1. Install: Simpan aset ke cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// 2. Activate: Bersihkan cache lama agar HP enteng
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// 3. Strategi Fetch: Ambil Cache dulu (BIAR INSTAN), lalu update di background
self.addEventListener('fetch', (event) => {
  // Abaikan request Supabase agar data piket tetap realtime/langsung
  if (event.request.url.includes('supabase.co')) {
    return; 
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        // Update cache dengan data terbaru dari internet
        if (networkResponse && networkResponse.status === 200) {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
          });
        }
        return networkResponse;
      }).catch(() => {
        // Jika offline total, tetap berikan cache
      });

      // Tampilkan cache (Sangat Cepat), jika tidak ada baru tunggu network
      return cachedResponse || fetchPromise;
    })
  );
});
