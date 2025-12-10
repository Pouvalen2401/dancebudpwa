/**
 * DanceBud Service Worker (Safe Version)
 */

// ===== VERSION =====
const CACHE_VERSION = 'v3';
const CACHE_NAME = `dancebud-cache-${CACHE_VERSION}`;

// ===== STATIC FILES TO CACHE =====
// NOTE: NO HTML SCREENS SHOULD BE LISTED HERE
const urlsToCache = [
  '/dancebudpwa/',
  '/dancebudpwa/index.html',
  '/dancebudpwa/manifest.json',

  // CSS
  '/dancebudpwa/css/styles.css',
  '/dancebudpwa/css/animations.css',

  // JS
  '/dancebudpwa/js/app.js',
  '/dancebudpwa/js/navigation.js',
  '/dancebudpwa/js/camera.js',
  '/dancebudpwa/js/audio.js',
  '/dancebudpwa/js/motion.js',
  '/dancebudpwa/js/session.js',
  '/dancebudpwa/js/storage.js',

  // Icons path
  '/dancebudpwa/asset/icons/icon-72x72.png',
  '/dancebudpwa/asset/icons/icon-96x96.png',
  '/dancebudpwa/asset/icons/icon-128x128.png',
  '/dancebudpwa/asset/icons/icon-144x144.png',
  '/dancebudpwa/asset/icons/icon-152x152.png',
  '/dancebudpwa/asset/icons/icon-192x192.png',
  '/dancebudpwa/asset/icons/icon-384x384.png',
  '/dancebudpwa/asset/icons/icon-512x512.png'
];

// ===== INSTALL =====
self.addEventListener('install', (event) => {
  console.log('[SW] Installing v3…');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// ===== ACTIVATE =====
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating v3…');

  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names.map((name) => {
          if (name !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          }
        })
      )
    ).then(() => self.clients.claim())
  );
});

// ===== FETCH (Network First for HTML, Cache First for Assets) =====
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Always fetch HTML from network to avoid loading freezes
  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request));
    return;
  }

  // Static assets → Cache first
  event.respondWith(cacheFirst(request));
});

// ===== STRATEGIES =====
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  if (response && response.status === 200) {
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, response.clone());
  }
  return response;
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    return response;
  } catch (err) {
    return caches.match('/dancebudpwa/index.html');
  }
}

console.log('[Service Worker] Loaded v3');
