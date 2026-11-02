const CACHE_NAME = 'ogrenci-paneli-v2';
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json'
];

// Dosyaları cihaza indir (Kurulum)
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Dosyalar önbelleğe alındı');
        return cache.addAll(urlsToCache);
      })
  );
});

// İnternet yoksa indirilen dosyaları kullan (Fetch)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Önbellekte varsa onu döndür, yoksa internetten çek
        return response || fetch(event.request);
      })
  );
});
