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
    console.log(`Navigating to: ${screenName}`);
    
    try {
      // Load screen HTML
      const screenContent = await this.loadScreen(screenName);
      
      // Update app container
      const appContainer = document.getElementById('app-container');
      appContainer.innerHTML = screenContent;
      
      // Initialize screen-specific functionality
      this.initializeScreen(screenName);
      
      // Update current screen
      this.currentScreen = screenName;
      
    } catch (error) {
      console.error('Navigation error:', error);
      alert('Failed to load screen. Please refresh the page.');
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
    console.log(`Initializing screen: ${screenName}`);
    
    switch(screenName) {
      case 'splash':
        // Auto-navigate to home after 3 seconds
        setTimeout(() => this.navigate('home'), 3000);
        break;
        
      case 'home':
        // Home screen event listeners will be added here
        break;
        
      case 'practice':
        // Start camera, audio, motion sensors
        // Will be implemented by Member 2
        break;
        
      case 'summary':
        // Display session results
        break;
        
      default:
        console.log(`No specific initialization for ${screenName}`);
    }
  }
};