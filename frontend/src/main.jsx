// frontend/src/main.jsx - SIMPLIFIED
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

// ⚠️ Clean up any existing service workers quietly
if ('serviceWorker' in navigator) {
  // Unregister without console logs to avoid errors
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(registration => registration.unregister());
  });
  
  // Clear caches quietly
  if (caches && caches.keys) {
    caches.keys().then(cacheNames => {
      cacheNames.forEach(cacheName => caches.delete(cacheName));
    });
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);