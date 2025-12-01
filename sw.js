// Minimal Service Worker for DanceBud PWA
self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  clients.claim();
});

self.addEventListener('fetch', event => {
  // Basic passthrough
  event.respondWith(fetch(event.request));
});
