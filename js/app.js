/**
 * DanceBud Main Application
 * Entry point for the app
 */

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
  console.log('🎉 DanceBud App Started!');
  console.log('📅 Date:', new Date().toLocaleString());
  
  // Initialize app
  initializeApp();
});

/**
 * Initialize the application
 */
function initializeApp() {
  console.log('⚙️ Initializing DanceBud...');
  
  // Check if Navigation module is loaded
  if (typeof Navigation === 'undefined') {
    console.error('❌ Navigation module not loaded!');
    showFallbackError();
    return;
  }
  
  // Start with splash screen
  Navigation.navigate('splash');
  
  // Register service worker for PWA
  registerServiceWorker();
  
  // Check for stored sessions
  checkStoredData();
  
  console.log('✅ App initialization complete!');
}

/**
 * Register Service Worker
 */
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => {
        console.log('✅ Service Worker registered:', reg.scope);
      })
      .catch(err => {
        console.log('⚠️ Service Worker registration failed:', err);
      });
  } else {
    console.log('⚠️ Service Workers not supported');
  }
}

/**
 * Check for stored data
 */
function checkStoredData() {
  try {
    const sessions = localStorage.getItem('sessions');
    if (sessions) {
      const parsedSessions = JSON.parse(sessions);
      console.log(`📊 Found ${parsedSessions.length} stored sessions`);
    } else {
      console.log('📊 No sessions found - Fresh start!');
    }
  } catch (error) {
    console.error('❌ Error checking stored data:', error);
  }
}

/**
 * Show fallback error if navigation fails
 */
function showFallbackError() {
  const appContainer = document.getElementById('app-container');
  if (appContainer) {
    appContainer.innerHTML = `
      <div class="min-vh-100 d-flex align-items-center justify-content-center p-4">
        <div class="text-center">
          <i class="bi bi-exclamation-triangle-fill text-warning" style="font-size: 4rem;"></i>
          <h2 class="mt-4 mb-3">Initialization Error</h2>
          <p class="text-muted mb-4">Failed to load required modules</p>
          <button class="btn btn-primary" onclick="location.reload()">
            <i class="bi bi-arrow-clockwise me-2"></i>Reload App
          </button>
        </div>
      </div>
    `;
  }
}

// Log app version and info
console.log('%c DanceBud v1.0.0 ', 
  'background: linear-gradient(135deg, #06b6d4, #a855f7); color: white; font-size: 16px; padding: 8px 16px; border-radius: 8px; font-weight: bold;'
);
console.log('%c Built with ❤️ by Team DanceBud ', 
  'color: #a855f7; font-size: 12px; font-weight: bold;'
);
console.log('%c Stack: Bootstrap 5, TensorFlow.js, Chart.js, Web APIs ', 
  'color: #10b981; font-size: 11px;'
);