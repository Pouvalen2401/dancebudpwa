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
    console.log(`📂 Looking for: screens/${screenName}.html`);
    
    try {
      // Load screen HTML
      const screenContent = await this.loadScreen(screenName);
      
      // Update app container with fade effect
      const appContainer = document.getElementById('app-container');
      
      if (!appContainer) {
        console.error('❌ #app-container not found!');
        return;
      }
      
      console.log('✅ Updating app container...');
      
      // Smooth transition
      appContainer.style.opacity = '0';
      appContainer.style.transition = 'opacity 0.3s ease';
      
      setTimeout(async () => {
        appContainer.innerHTML = screenContent;
        appContainer.style.opacity = '1';

        // Execute any <script> tags that were part of the loaded HTML
        try {
          await this._executeInlineScripts(appContainer);
        } catch (err) {
          console.warn('⚠️ Error executing inline scripts:', err);
        }

        // Initialize screen-specific functionality
        this.initializeScreen(screenName);

        // Update current screen
        this.currentScreen = screenName;

        console.log('✅ Navigation complete!');
      }, 300);
      
    } catch (error) {
      console.error('❌ Navigation error:', error);
      this.showError(screenName, error);
    }
  },

  /**
   * Load screen HTML from file
   * @param {string} screenName - Name of the screen file
   * @returns {Promise<string>} Screen HTML content
   */
  async loadScreen(screenName) {
    const path = `screens/${screenName}.html`;
    console.log(`📄 Fetching: ${path}`);
    
    try {
      const response = await fetch(path);
      console.log(`📡 Response status: ${response.status}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Cannot load ${path}`);
      }
      
      const content = await response.text();
      console.log(`✅ Loaded ${content.length} characters`);
      
      return content;
      
    } catch (fetchError) {
      console.error('❌ Fetch failed:', fetchError);
      throw fetchError;
    }
  },

  /**
   * Initialize screen-specific functionality
   * @param {string} screenName - Name of the current screen
   */
  initializeScreen(screenName) {
    console.log(`🎬 Initializing: ${screenName}`);
    
    switch(screenName) {
      case 'splash':
        // Auto-navigate to home after 3 seconds
        console.log('⏰ Setting timer for home navigation...');
        setTimeout(() => {
          console.log('⏰ Navigating to home...');
          this.navigate('home');
        }, 3000);
        break;
        
      case 'home':
        console.log('🏠 Home screen ready');
        break;
        
      case 'permissions':
        console.log('🔐 Permissions screen ready');
        break;
        
      case 'practice':
        console.log('💃 Practice screen ready');
        // Initialize camera, audio, motion sensors
        // Ensure the practice initialization function runs every time we navigate here.
        if (typeof window.initPracticeScreen === 'function') {
          try {
            window.initPracticeScreen();
          } catch (e) {
            console.warn('Error running initPracticeScreen():', e);
          }
        } else {
          // Fallback: try to start camera and detector directly if elements exist
          try {
            const video = document.getElementById('practiceVideo');
            const canvas = document.getElementById('poseCanvas');
            if (video && canvas && typeof CameraModule !== 'undefined') {
              CameraModule.startCamera(video, canvas).then(() => {
                if (CameraModule.startPoseDetection) {
                  CameraModule.startPoseDetection((pose, score) => {
                    if (typeof updatePosture === 'function') updatePosture(score);
                    if (typeof sessionData !== 'undefined') sessionData.postureReadings && sessionData.postureReadings.push(score);
                  }).catch(err => console.warn('startPoseDetection failed:', err));
                }
              }).catch(err => console.warn('startCamera failed:', err));
            }
          } catch (e) {
            console.warn('Practice fallback init failed:', e);
          }
        }
        break;
        
      case 'summary':
        console.log('📊 Summary screen ready');
        break;
        
      case 'routines':
        console.log('📋 Routines screen ready');
        break;
        
      case 'history':
        console.log('📜 History screen ready');
        break;
        
      case 'settings':
        console.log('⚙️ Settings screen ready');
        break;
        
      default:
        console.log(`ℹ️ No specific initialization for ${screenName}`);
    }
  },

  /**
   * Show error screen
   * @param {string} screenName - Name of the screen that failed
   * @param {Error} error - The error object
   */
  showError(screenName, error) {
    console.log('🚨 Showing error screen...');
    const appContainer = document.getElementById('app-container');
    
    if (!appContainer) {
      console.error('❌ Cannot show error: app-container not found!');
      return;
    }
    
    // Sanitize error message to prevent XSS
    function escapeHTML(str) {
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }
    const safeMessage = error && error.message ? escapeHTML(error.message) : '';
    appContainer.innerHTML = `
      <div class="min-vh-100 d-flex align-items-center justify-content-center p-4" style="background: #000;">
        <div class="text-center" style="max-width: 600px;">
          <i class="bi bi-exclamation-triangle-fill text-warning" style="font-size: 4rem;"></i>
          <h2 class="mt-4 mb-3 text-white">Screen Not Found</h2>
          <p class="text-muted mb-2">Could not load: <code>screens/${escapeHTML(screenName)}.html</code></p>
          
          <div class="alert alert-danger text-start mt-3">
            <strong>Error Details:</strong><br>
            ${safeMessage}
          </div>
          
          <div class="bg-dark p-3 rounded text-start mt-3 small text-muted">
            <strong>🔍 Debug Info:</strong><br>
            <strong>Current URL:</strong> ${escapeHTML(window.location.href)}<br>
            <strong>Looking for:</strong> ${escapeHTML(window.location.origin + window.location.pathname.replace('index.html', ''))}screens/${escapeHTML(screenName)}.html<br>
            <strong>Protocol:</strong> ${escapeHTML(window.location.protocol)}<br>
            <strong>Tip:</strong> Make sure you're using Live Server (http://) not file://
          </div>
          
          <button class="btn btn-primary mt-4" onclick="location.reload()">
            <i class="bi bi-arrow-clockwise me-2"></i>Reload App
          </button>
          
          <button class="btn btn-outline-secondary mt-2" onclick="Navigation.navigate('home')">
            <i class="bi bi-house-fill me-2"></i>Try Home
          </button>
        </div>
      </div>
    `;
  },

 

  /**
   * Navigate back to previous screen
   */
  goBack() {
    console.log('⬅️ Going back...');
    // You can implement history tracking here
    this.navigate('home');
  }
};

/**
 * Execute scripts that were added via innerHTML (they don't run automatically)
 * Copies each <script> into a new element so the browser executes it.
 * Supports both inline and external scripts and waits for external scripts to load.
 */
Navigation._executeInlineScripts = function(container) {
  const scripts = Array.from(container.querySelectorAll('script'));
  const promises = scripts.map((oldScript) => {
    return new Promise((resolve, reject) => {
      const newScript = document.createElement('script');
      // Copy attributes
      for (let i = 0; i < oldScript.attributes.length; i++) {
        const attr = oldScript.attributes[i];
        newScript.setAttribute(attr.name, attr.value);
      }
      // Scripts inline : injecter systématiquement sauf si déjà présent dans le head (évite les doublons critiques)
      if (!oldScript.src) {
        if (!Array.from(document.head.querySelectorAll('script')).some(s => s.text === oldScript.textContent)) {
          newScript.text = oldScript.textContent;
          document.head.appendChild(newScript);
        }
        resolve();
      } else if (oldScript.src) {
        // External script: éviter d'injecter deux fois le même src
        if (!document.querySelector(`script[src='${oldScript.src}']`)) {
          newScript.src = oldScript.src;
          newScript.onload = () => resolve();
          newScript.onerror = (e) => reject(e || new Error('Script load error'));
          document.head.appendChild(newScript);
        } else {
          resolve();
        }
      } else {
        // Inline script: éviter d'injecter deux fois le même contenu
        if (!Array.from(document.head.querySelectorAll('script')).some(s => s.text === oldScript.textContent)) {
          newScript.text = oldScript.textContent;
          document.head.appendChild(newScript);
        }
        resolve();
      }
      // Remove the old script node so it doesn't remain duplicated in the DOM
      oldScript.parentNode && oldScript.parentNode.removeChild(oldScript);
    });
  });
  return Promise.all(promises);
};

// Make Navigation globally available
window.Navigation = Navigation;
console.log('✅ Navigation module loaded');
console.log('📂 Current URL:', window.location.href);



// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Navigation;
}

    
