/**
 * DanceBud Main Application
 * Entry point for the app
 */

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', async () => {
  console.log('🎉 DanceBud App Started!');
  
  // Initialize theme system FIRST
  await ThemeSystem.init();
  
  // Initialize database
  await Database.init();
  
  // Start with splash screen
  Navigation.navigate('splash');
  
  // Service worker registration is handled in index.html
});

// Log app version (désactivé en production)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  console.log('%c DanceBud v1.0.0 ', 'background: linear-gradient(135deg, #06b6d4, #a855f7); color: white; font-size: 16px; padding: 10px;');
  console.log('Built with ❤️ by Team DanceBud');
}