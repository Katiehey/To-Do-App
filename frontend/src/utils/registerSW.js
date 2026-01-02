export const registerServiceWorker = () => {
  // Check if the browser supports Service Workers and if we are in production
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('✅ Service Worker registered');

          // 🔄 Check for updates
          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (installingWorker == null) return;

            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  // At this point, the updated precached content has been fetched,
                  // but the previous service worker will still serve the older
                  // content until all client tabs are closed.
                  console.log('✨ New version available');
                  
                  // Custom Event to trigger a nice UI Toast instead of a blocky confirm
                  window.dispatchEvent(new CustomEvent('swUpdated', { detail: registration }));

                  if (window.confirm('A new version of TaskMaster is available. Reload now to update?')) {
                    // Send message to SW to skipWaiting
                    if (registration.waiting) {
                      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
                    }
                    window.location.reload();
                  }
                } else {
                  // Content is cached for offline use for the first time
                  console.log('📁 Content is cached for offline use.');
                }
              }
            };
          };
        })
        .catch((error) => {
          console.error('❌ Service Worker registration failed:', error);
        });
    });
  }
};

export const unregisterServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
};