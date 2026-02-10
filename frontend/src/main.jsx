// frontend/src/main.jsx - UPDATED WITH VERSION
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Version for cache busting
const APP_VERSION = '2.0.1';

// Clear all service workers and caches
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(registration => registration.unregister());
    console.log(`🔄 Cleared ${registrations.length} service workers (v${APP_VERSION})`);
  });
  
  if (caches && caches.keys) {
    caches.keys().then(cacheNames => {
      cacheNames.forEach(name => caches.delete(name));
      console.log(`🗑️ Cleared ${cacheNames.length} caches (v${APP_VERSION})`);
    });
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);