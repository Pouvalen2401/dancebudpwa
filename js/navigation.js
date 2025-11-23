/**
 * Navigation Module
 * Handles screen routing and transitions
 */
const Navigation = {
  currentScreen: 'splash',

  /**
   * Navigate to a specific screen
   * @param {string} screenName - Name of the screen to load
   */
  async navigate(screenName) {
    console.log(`🧭 Navigating to: ${screenName}`);
    
    try {
      // Load screen HTML
      const screenContent = await this.loadScreen(screenName);
      
      // Update app container with fade transition
      const appContainer = document.getElementById('app-container');
      appContainer.style.opacity = '0';
      
      setTimeout(() => {
        appContainer.innerHTML = screenContent;
        appContainer.style.opacity = '1';
        appContainer.style.transition = 'opacity 0.3s ease';
      }, 300);
      
      // Initialize screen-specific functionality
      this.initializeScreen(screenName);
      
      // Update current screen
      this.currentScreen = screenName;
      
      // Announce to screen readers
      if (window.announceToScreenReader) {
        window.announceToScreenReader(`Navigated to ${screenName} screen`);
      }
      
    } catch (error) {
      console.error('❌ Navigation error:', error);
      this.showError(screenName);
    }
  },

  /**
   * Load screen HTML from file
   * @param {string} screenName - Name of the screen file
   * @returns {Promise<string>} Screen HTML content
   */
  async loadScreen(screenName) {
    const response = await fetch(`screens/${screenName}.html`);
    
    if (!response.ok) {
      throw new Error(`Screen not found: ${screenName}`);
    }
    
    return await response.text();
  },

  /**
   * Initialize screen-specific functionality
   * @param {string} screenName - Name of the current screen
   */
  initializeScreen(screenName) {
    console.log(`🎬 Initializing screen: ${screenName}`);
    
    switch(screenName) {
      case 'splash':
        // Auto-navigate to home after 3 seconds
        setTimeout(() => this.navigate('home'), 3000);
        break;
        
      case 'home':
        // Home screen is ready
        console.log('🏠 Home screen loaded');
        break;
        
      case 'permissions':
        // Request permissions
        console.log('🔐 Permissions screen loaded');
        break;
        
      case 'practice':
        // Start camera, audio, motion sensors
        console.log('💃 Practice screen loaded');
        if (typeof CameraModule !== 'undefined' && CameraModule.start) {
          // CameraModule.start();
        }
        break;
        
      case 'summary':
        // Display session results
        console.log('📊 Summary screen loaded');
        break;
        
      case 'routines':
        console.log('📋 Routines screen loaded');
        break;
        
      case 'history':
        console.log('📜 History screen loaded');
        break;
        
      case 'settings':
        console.log('⚙️ Settings screen loaded');
        break;
        
      default:
        console.log(`ℹ️ No specific initialization for ${screenName}`);
    }
  },

  /**
   * Show error screen
   * @param {string} screenName - Name of the screen that failed
   */
  showError(screenName) {
    const appContainer = document.getElementById('app-container');
    appContainer.innerHTML = `
      <div class="min-vh-100 d-flex align-items-center justify-content-center p-4">
        <div class="text-center">
          <i class="bi bi-exclamation-triangle-fill text-warning" style="font-size: 4rem;"></i>
          <h2 class="mt-4 mb-3">Screen Not Found</h2>
          <p class="text-muted mb-4">Could not load: ${screenName}.html</p>
          <button class="btn btn-primary" onclick="Navigation.navigate('home')">
            <i class="bi bi-house-fill me-2"></i>Go Home
          </button>
        </div>
      </div>
    `;
  }
};

// Make Navigation globally available
window.Navigation = Navigation;