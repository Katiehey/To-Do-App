const CACHE_NAME = 'taskmaster-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Handle push messages sent by the backend via web-push
self.addEventListener('push', (event) => {
  let data = { title: 'TaskMaster', body: 'You have a task reminder.' };
  try {
    if (event.data) data = event.data.json();
  } catch (_) {}

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icons/Appimages/android/android-launchericon-192-192.png',
      badge: '/icons/Appimages/android/android-launchericon-72-72.png',
      tag: data.tag || 'taskmaster-push',
      data: { url: data.url || '/', taskId: data.taskId || null },
      vibrate: [200, 100, 200],
      requireInteraction: true,
    })
  );
});

// Open/focus the app when notification is clicked
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/';
  const taskId = event.notification.data?.taskId || null;
  
  console.log('[SW] Notification clicked, taskId:', taskId, 'targetUrl:', targetUrl);
  
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      console.log('[SW] Found', clients.length, 'clients');
      for (const client of clients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          console.log('[SW] Focusing existing client');
          client.focus();
          // Post message to client with taskId instead of navigate, for better iOS PWA support
          client.postMessage({ type: 'NOTIFICATION_CLICK', taskId, targetUrl });
          return;
        }
      }
      console.log('[SW] Opening new window with:', targetUrl);
      return self.clients.openWindow(targetUrl).then((newClient) => {
        if (newClient) {
          newClient.postMessage({ type: 'NOTIFICATION_CLICK', taskId, targetUrl });
        }
      });
    })
  );
});