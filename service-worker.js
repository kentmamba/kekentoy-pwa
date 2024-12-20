const CACHE_NAME = 'dict-explore-v2'; // Updated version
const urlsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/app.js',
    '/manifest.json',
    '/icons/kent.png',
    '/icons/kentoy.png'
];

// Install Service Worker and Cache Files
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker: Caching essential files');
                return cache.addAll(urlsToCache);
            })
    );
});

// Fetch event: Cache files and fetch from network if not found
self.addEventListener('fetch', (event) => {
    if (event.request.url.includes('https://api.dictionaryapi.dev/')) {
        return fetch(event.request);
    }

    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                return cachedResponse || fetch(event.request);
            })
    );
});

// Activate Service Worker and Clean Old Caches
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
