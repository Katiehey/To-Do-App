// frontend/src/main.jsx - UPDATED
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// ⚠️ COMPLETELY block service worker registration
if ('serviceWorker' in navigator) {
  // Unregister immediately
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(registration => {
      registration.unregister();
      console.log('🗑️ Service Worker unregistered');
    });
  });
  
  // Block future registration attempts
  const originalRegister = navigator.serviceWorker.register;
  navigator.serviceWorker.register = function() {
    console.log('🚫 Service Worker registration blocked');
    return Promise.reject(new Error('Service Worker disabled'));
  };
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);