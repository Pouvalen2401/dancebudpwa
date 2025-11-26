/**
 * Storage Utilities Module
 * Helper functions for localStorage operations
 * Member 3's responsibility
 */

const Storage = {
  /**
   * Set item in localStorage
   */
  set(key, value) {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);
      return true;
    } catch (error) {
      console.error('Storage.set error:', error);
      return false;
    }
  },
  
  /**
   * Get item from localStorage
   */
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Storage.get error:', error);
      return defaultValue;
    }
  },
  
  /**
   * Remove item from localStorage
   */
  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Storage.remove error:', error);
      return false;
    }
  },
  
  /**
   * Clear all localStorage
   */
  clear() {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Storage.clear error:', error);
      return false;
    }
  },
  
  /**
   * Check if key exists
   */
  has(key) {
    return localStorage.getItem(key) !== null;
  },
  
  /**
   * Get all keys
   */
  keys() {
    return Object.keys(localStorage);
  },
  
  /**
   * Get storage size in bytes
   */
  getSize() {
    let total = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length;
      }
    }
    return total;
  },
  
  /**
   * Get storage size in human-readable format
   */
  getSizeFormatted() {
    const bytes = this.getSize();
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / 1048576).toFixed(2) + ' MB';
  }
};

// Export for global use
window.Storage = Storage;