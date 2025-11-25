/**
 * Theme Management System
 * Handles dark/light mode switching across the app
 */

const ThemeSystem = {
  currentTheme: 'dark',
  
  /**
   * Initialize theme system
   */
  async init() {
    console.log('🎨 Initializing theme system...');
    
    try {
      // Load saved theme preference
      const settings = await Database.getSettings();
      const savedTheme = settings?.darkMode !== false ? 'dark' : 'light';
      
      this.setTheme(savedTheme);
      console.log('✅ Theme loaded:', savedTheme);
    } catch (error) {
      console.error('Theme init error:', error);
      // Default to dark theme
      this.setTheme('dark');
    }
  },
  
  /**
   * Set theme
   */
  setTheme(theme) {
    this.currentTheme = theme;
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
      root.style.colorScheme = 'dark';
    } else {
      root.setAttribute('data-theme', 'light');
      root.style.colorScheme = 'light';
    }
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#000000' : '#ffffff');
    }
  },
  
  /**
   * Toggle theme
   */
  async toggle() {
    const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
    
    // Save preference
    try {
      await Database.saveSetting('darkMode', newTheme === 'dark');
    } catch (error) {
      console.error('Error saving theme:', error);
    }
    
    return newTheme;
  },
  
  /**
   * Get current theme
   */
  getTheme() {
    return this.currentTheme;
  },
  
  /**
   * Check if dark mode
   */
  isDark() {
    return this.currentTheme === 'dark';
  }
};

// Export for use in other modules
window.ThemeSystem = ThemeSystem;