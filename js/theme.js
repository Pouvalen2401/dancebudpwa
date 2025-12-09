/**
 * Theme Management Module
 * Centralized theme control for the entire app
 */

const ThemeManager = {
  currentTheme: 'dark', // default
  
  /**
   * Initialize theme on app load
   */
  init() {
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('app-theme') || 'dark';
    this.setTheme(savedTheme, false); // false = don't save again
    
    // Update all UI elements
    this.updateAllThemeControls();
    
    console.log('Theme initialized:', savedTheme);
  },
  
  /**
   * Set theme
   */
  setTheme(theme, save = true) {
    this.currentTheme = theme;
    
    // Apply theme to document
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
    }
    
    // Save to localStorage
    if (save) {
      localStorage.setItem('app-theme', theme);
      console.log('Theme saved:', theme);
    }
    
    // Update all theme controls in the UI
    this.updateAllThemeControls();
    
    // Dispatch custom event for other modules
    window.dispatchEvent(new CustomEvent('themeChanged', { 
      detail: { theme } 
    }));
  },
  
  /**
   * Toggle between light and dark
   */
  toggle() {
    const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  },
  
  /**
   * Update all theme controls in the UI
   */
  updateAllThemeControls() {
    // Update home page button
    this.updateHomeButton();
    
    // Update settings toggle
    this.updateSettingsToggle();
    
    // Update settings display
    this.updateSettingsDisplay();
  },
  
  /**
   * Update home page moon/sun button
   */
  updateHomeButton() {
    const themeBtn = document.getElementById('theme-toggle');
    if (!themeBtn) return;
    
    const icon = themeBtn.querySelector('i');
    if (!icon) return;
    
    if (this.currentTheme === 'dark') {
      icon.className = 'bi bi-moon-stars-fill';
      themeBtn.setAttribute('title', 'Switch to Light Mode');
    } else {
      icon.className = 'bi bi-sun-fill';
      themeBtn.setAttribute('title', 'Switch to Dark Mode');
    }
  },
  
  /**
   * Update settings page toggle switch
   */
  updateSettingsToggle() {
    const toggle = document.getElementById('dark-mode-toggle');
    if (!toggle) return;
    
    // Update toggle state
    toggle.checked = (this.currentTheme === 'dark');
  },
  
  /**
   * Update settings page display text
   */
  updateSettingsDisplay() {
    const themeTitle = document.getElementById('current-theme-title');
    const themeSubtitle = document.getElementById('current-theme-subtitle');
    const themeIcon = document.getElementById('current-theme-icon');
    
    if (this.currentTheme === 'dark') {
      if (themeTitle) themeTitle.textContent = 'Dark Theme';
      if (themeSubtitle) themeSubtitle.textContent = 'Current theme';
      if (themeIcon) themeIcon.className = 'bi bi-moon-stars-fill';
    } else {
      if (themeTitle) themeTitle.textContent = 'Light Theme';
      if (themeSubtitle) themeSubtitle.textContent = 'Current theme';
      if (themeIcon) themeIcon.className = 'bi bi-sun-fill';
    }
  },
  
  /**
   * Get current theme
   */
  getTheme() {
    return this.currentTheme;
  }
};

// Make globally available
window.ThemeManager = ThemeManager;

// Initialize theme when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    ThemeManager.init();
  });
} else {
  ThemeManager.init();
}
// (No alias) Backwards compatibility was removed per user request