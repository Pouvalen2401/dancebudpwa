/**
 * DanceBud Main Application
 * Entry point for the app
 */

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
  console.log('🎉 DanceBud App Started!');
  
  // Start with splash screen
  Navigation.navigate('splash');
  
  // Register service worker for PWA (will be implemented later)
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('Service Worker registered', reg))
      .catch(err => console.log('Service Worker registration failed', err));
  }
});

// Log app version
console.log('%c DanceBud v1.0.0 ', 'background: linear-gradient(135deg, #06b6d4, #a855f7); color: white; font-size: 16px; padding: 10px;');
console.log('Built with ❤️ by Team DanceBud');