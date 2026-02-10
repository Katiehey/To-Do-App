// frontend/src/utils/registerSW.js
export const registerServiceWorker = () => {
  // DO NOT REGISTER - only unregister existing ones
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      registrations.forEach(registration => {
        registration.unregister();
        console.log('🚫 Service Worker disabled:', registration.scope);
      });
    });
    
    // Clear all caches
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          console.log('🧹 Deleting cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    });
  }
};

export const unregisterServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      registrations.forEach(registration => {
        registration.unregister();
        console.log('🗑️ Service Worker unregistered');
      });
    });
  }
};