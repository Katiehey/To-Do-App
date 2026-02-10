const CACHE_NAME = 'taskmaster-v8'; 
const DYNAMIC_CACHE = 'taskmaster-dynamic-v1';
const OFFLINE_URL = '/offline.html';

// Corrected paths for your Appimages structure
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html',
  '/screenshots/desktop.png',
  '/screenshots/mobile.png',
  '/icons/Appimages/android/android-launchericon-192-192.png',
  '/icons/Appimages/android/android-launchericon-512-512.png',
  '/icons/Appimages/ios/180.png',
  '/icons/Appimages/ios/32.png',
];

// Install - Pre-cache core UI
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-caching static assets');
      // Using Promise.all to ensure if one file fails, others still cache
      return Promise.all(
        STATIC_ASSETS.map(url => {
          return cache.add(url).catch(err => console.warn(`[SW] Skip caching: ${url}`));
        })
      );
    })
  );
  self.skipWaiting();
});

// Activate - Cleanup old versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME && key !== DYNAMIC_CACHE) {
            console.log('[SW] Deleting old cache:', key);
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Listen for "SKIP_WAITING" message from the frontend
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Fetch Handler
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle GET requests for caching
  if (request.method !== 'GET') return;

  // 1. API Strategy: Network First (Fresh data, fallback to cache)
  if (url.pathname.startsWith('/api')) {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const clone = res.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => cache.put(request, clone));
          return res;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          return cached || new Response(JSON.stringify({ error: 'Offline' }), { 
            status: 503, 
            headers: { 'Content-Type': 'application/json' } 
          });
        })
    );
    return;
  }

  // 2. Static Assets & Navigation Strategy: Cache-First
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      // Return from cache if found
      if (cachedResponse) {
        return cachedResponse;
      }

      // Otherwise fetch from network
      return fetch(request)
        .then((networkResponse) => {
          // Cache Vite hashed assets (js/css) dynamically as they are discovered
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => cache.put(request, clone));
          }
          return networkResponse;
        })
        .catch(() => {
          // If network fails and we are navigating to a new page
          if (request.mode === 'navigate') {
            return caches.match(OFFLINE_URL) || caches.match('/index.html') || caches.match('/');
          }
          
          // Return a valid empty response instead of 'undefined' to prevent crashes
          return new Response('Resource unavailable offline', { status: 503 });
        });
    })
  );
});

// --- Notifications ---
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const options = {
    body: data.body || 'Task Reminder!',
    icon: '/icons/Appimages/android/android-launchericon-192-192.png',
    badge: '/icons/Appimages/ios/32.png',
    vibrate: [100, 50, 100],
    data: { url: data.url || '/tasks' },
  };
  event.waitUntil(self.registration.showNotification(data.title || 'TaskMaster', options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === event.notification.data.url && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(event.notification.data.url);
    })
  );
});