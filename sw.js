/**
 * DanceBud Service Worker
 * Handles caching, offline functionality, and app updates
 */

// ========== VERSION & CONFIGURATION ==========
const CACHE_VERSION = 'v1.0.0';
const CACHE_NAME = `dancebudpwa-${CACHE_VERSION}`;

// ========== FILES TO CACHE ==========
const urlsToCache = [
  '/dancebudpwa/',
  '/dancebudpwa/index.html',
  '/dancebudpwa/manifest.json',
  
  // CSS
  '/dancebudpwa/css/styles.css',
  '/dancebudpwa/css/animations.css',
  
  // JavaScript
  '/dancebudpwa/js/app.js',
  '/dancebudpwa/js/navigation.js',
  '/dancebudpwa/js/database.js',
  '/dancebudpwa/js/camera.js',
  '/dancebudpwa/js/audio.js',
  '/dancebudpwa/js/motion.js',
  '/dancebudpwa/js/notifications.js',
  '/dancebudpwa/js/theme.js',
  '/dancebudpwa/js/config.js',
  '/dancebudpwa/js/ui-enhancements.js',
  
  // Screens
  '/dancebudpwa/screens/home.html',
  '/dancebudpwa/screens/permissions.html',
  '/dancebudpwa/screens/practice.html',
  '/dancebudpwa/screens/summary.html',
  '/dancebudpwa/screens/history.html',
  '/dancebudpwa/screens/routines.html',
  '/dancebudpwa/screens/settings.html',
  '/dancebudpwa/screens/notifications.html',
  
  // Icons
  '/dancebudpwa/asset/icons/icon-72x72.png',
  '/dancebudpwa/asset/icons/icon-96x96.png',
  '/dancebudpwa/asset/icons/icon-128x128.png',
  '/dancebudpwa/asset/icons/icon-144x144.png',
  '/dancebudpwa/asset/icons/icon-152x152.png',
  '/dancebudpwa/asset/icons/icon-192x192.png',
  '/dancebudpwa/asset/icons/icon-384x384.png',
  '/dancebudpwa/asset/icons/icon-512x512.png',
  
  // External Libraries (CDN - will be cached on first load)
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css',
  'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.11.0/dist/tf.min.js',
  'https://cdn.jsdelivr.net/npm/@tensorflow-models/pose-detection@2.1.0/dist/pose-detection.min.js',
  'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js'
];

// ========== INSTALL EVENT ==========
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('[Service Worker] Installation complete');
        // Force the waiting service worker to become the active service worker
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[Service Worker] Installation failed:', error);
      })
  );
});

// ========== ACTIVATE EVENT ==========
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Delete old caches that don't match current version
            if (cacheName !== CACHE_NAME) {
              console.log('[Service Worker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[Service Worker] Activation complete');
        // Take control of all pages immediately
        return self.clients.claim();
      })
  );
});

// ========== FETCH EVENT ==========
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip chrome-extension and other non-http(s) requests
  if (!url.protocol.startsWith('http')) {
    return;
  }
  
  // Different strategies for different types of requests
  
  // Strategy 1: Network First (for API calls, camera, microphone)
  if (
    request.url.includes('/api/') ||
    request.url.includes('getUserMedia') ||
    request.destination === 'video' ||
    request.destination === 'audio'
  ) {
    event.respondWith(networkFirst(request));
    return;
  }
  
  // Strategy 2: Cache First (for static assets)
  event.respondWith(cacheFirst(request));
});

// ========== CACHING STRATEGIES ==========

/**
 * Cache First Strategy
 * Try cache first, fallback to network if not found
 * Good for: Static assets (CSS, JS, images, fonts)
 */
async function cacheFirst(request) {
  try {
    // Try to get from cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // If not in cache, fetch from network
    const networkResponse = await fetch(request);
    
    // Cache the new response for future use
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('[Service Worker] Fetch failed:', error);
    
    // Return offline page if available
    return caches.match('/dancebudpwa/index.html');
  }
}

/**
 * Network First Strategy
 * Try network first, fallback to cache if offline
 * Good for: Dynamic content, API calls
 */
async function networkFirst(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    // Update cache with fresh data
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // If network fails, try cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // If both fail, return error
    throw error;
  }
}

// ========== MESSAGE EVENT (for manual cache updates) ==========
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            return caches.delete(cacheName);
          })
        );
      })
    );
  }
});

// ========== PUSH NOTIFICATION (optional) ==========
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New notification from DanceBud',
    icon: '/dancebudpwa/assets/icons/icon-192x192.png',
    badge: '/dancebudpwa/assets/icons/icon-72x72.png',
    vibrate: [200, 100, 200],
    tag: 'dancebud-notification',
    requireInteraction: false
  };
  
  event.waitUntil(
    self.registration.showNotification('DanceBud', options)
  );
});

// ========== NOTIFICATION CLICK ==========
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow('/dancebudpwa/')
  );
});

console.log('[Service Worker] Loaded successfully - Version:', CACHE_VERSION);
