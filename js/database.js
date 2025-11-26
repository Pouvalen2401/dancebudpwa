/**
 * Database Module - IndexedDB Wrapper
 * Complete implementation with all CRUD operations
 * Member 3's responsibility
 */

const Database = {
  dbName: 'DanceBudDB',
  dbVersion: 1,
  db: null,
  
  /**
   * Initialize database
   */
  async init() {
    if (this.db) return this.db;
    
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);
      
      request.onerror = () => {
        console.error('❌ Database failed to open');
        reject(request.error);
      };
      
      request.onsuccess = () => {
        this.db = request.result;
        console.log('✅ Database opened successfully');
        resolve(this.db);
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        console.log('🔄 Database upgrade needed...');
        
        // Create sessions store
        if (!db.objectStoreNames.contains('sessions')) {
          const sessionsStore = db.createObjectStore('sessions', { 
            keyPath: 'id', 
            autoIncrement: true 
          });
          sessionsStore.createIndex('date', 'date', { unique: false });
          sessionsStore.createIndex('routineName', 'routineName', { unique: false });
          sessionsStore.createIndex('score', 'score', { unique: false });
          console.log('✅ Sessions store created');
        }
        
        // Create settings store
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
          console.log('✅ Settings store created');
        }
        
        // Create statistics store
        if (!db.objectStoreNames.contains('statistics')) {
          db.createObjectStore('statistics', { keyPath: 'key' });
          console.log('✅ Statistics store created');
        }
        
        console.log('✅ Database setup complete');
      };
    });
  },
  
  // ==================== SESSION OPERATIONS ====================
  
  /**
   * Save a new session
   */
  async saveSession(sessionData) {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['sessions'], 'readwrite');
      const store = transaction.objectStore('sessions');
      
      const session = {
        ...sessionData,
        date: sessionData.date || new Date().toISOString(),
        timestamp: Date.now()
      };
      
      const request = store.add(session);
      
      request.onsuccess = async () => {
        session.id = request.result;
        console.log('✅ Session saved:', session.id);
        
        // Update statistics
        await this.updateStatistics();
        
        resolve(session);
      };
      
      request.onerror = () => {
        console.error('❌ Failed to save session');
        reject(request.error);
      };
    });
  },
  
  /**
   * Get all sessions
   */
  async getAllSessions() {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['sessions'], 'readonly');
      const store = transaction.objectStore('sessions');
      const request = store.getAll();
      
      request.onsuccess = () => {
        const sessions = request.result;
        // Sort by date descending (newest first)
        sessions.sort((a, b) => new Date(b.date) - new Date(a.date));
        resolve(sessions);
      };
      
      request.onerror = () => {
        console.error('❌ Failed to get sessions');
        reject(request.error);
      };
    });
  },
  
  /**
   * Get recent sessions (limit)
   */
  async getRecentSessions(limit = 5) {
    const allSessions = await this.getAllSessions();
    return allSessions.slice(0, limit);
  },
  
  /**
   * Get session by ID
   */
  async getSession(id) {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['sessions'], 'readonly');
      const store = transaction.objectStore('sessions');
      const request = store.get(id);
      
      request.onsuccess = () => {
        resolve(request.result);
      };
      
      request.onerror = () => {
        console.error('❌ Failed to get session');
        reject(request.error);
      };
    });
  },
  
  /**
   * Delete session
   */
  async deleteSession(id) {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['sessions'], 'readwrite');
      const store = transaction.objectStore('sessions');
      const request = store.delete(id);
      
      request.onsuccess = async () => {
        console.log('✅ Session deleted:', id);
        // Update statistics
        await this.updateStatistics();
        resolve(true);
      };
      
      request.onerror = () => {
        console.error('❌ Failed to delete session');
        reject(request.error);
      };
    });
  },
  
  /**
   * Clear all sessions
   */
  async clearAllSessions() {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['sessions'], 'readwrite');
      const store = transaction.objectStore('sessions');
      const request = store.clear();
      
      request.onsuccess = async () => {
        console.log('✅ All sessions cleared');
        // Reset statistics
        await this.resetStatistics();
        resolve(true);
      };
      
      request.onerror = () => {
        console.error('❌ Failed to clear sessions');
        reject(request.error);
      };
    });
  },
  
  // ==================== STATISTICS OPERATIONS ====================
  
  /**
   * Calculate and update statistics
   */
  async updateStatistics() {
    const sessions = await this.getAllSessions();
    
    if (sessions.length === 0) {
      return this.resetStatistics();
    }
    
    // Calculate statistics
    const totalSessions = sessions.length;
    
    const totalScore = sessions.reduce((sum, s) => sum + (s.score || 0), 0);
    const avgScore = totalScore / totalSessions;
    
    const totalTime = sessions.reduce((sum, s) => {
      const duration = s.durationSeconds || this.parseDuration(s.duration);
      return sum + duration;
    }, 0);
    
    const totalSteps = sessions.reduce((sum, s) => sum + (s.steps || 0), 0);
    const totalTurns = sessions.reduce((sum, s) => sum + (s.turns || 0), 0);
    
    const stats = {
      totalSessions,
      avgScore,
      totalTime,
      totalSteps,
      totalTurns,
      lastUpdated: new Date().toISOString()
    };
    
    return this.saveStatistic('overall', stats);
  },
  
  /**
   * Get statistics
   */
  async getStatistics() {
    if (!this.db) await this.init();
    
    try {
      const stats = await this.getStatistic('overall');
      
      if (!stats) {
        // Calculate if not exists
        await this.updateStatistics();
        return await this.getStatistic('overall');
      }
      
      return stats;
    } catch (error) {
      console.error('Error getting statistics:', error);
      return {
        totalSessions: 0,
        avgScore: 0,
        totalTime: 0,
        totalSteps: 0,
        totalTurns: 0
      };
    }
  },
  
  /**
   * Save statistic
   */
  async saveStatistic(key, value) {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['statistics'], 'readwrite');
      const store = transaction.objectStore('statistics');
      
      const data = { key, value, updated: Date.now() };
      const request = store.put(data);
      
      request.onsuccess = () => {
        resolve(value);
      };
      
      request.onerror = () => {
        console.error('❌ Failed to save statistic');
        reject(request.error);
      };
    });
  },
  
  /**
   * Get statistic
   */
  async getStatistic(key) {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['statistics'], 'readonly');
      const store = transaction.objectStore('statistics');
      const request = store.get(key);
      
      request.onsuccess = () => {
        resolve(request.result ? request.result.value : null);
      };
      
      request.onerror = () => {
        console.error('❌ Failed to get statistic');
        reject(request.error);
      };
    });
  },
  
  /**
   * Reset statistics
   */
  async resetStatistics() {
    return this.saveStatistic('overall', {
      totalSessions: 0,
      avgScore: 0,
      totalTime: 0,
      totalSteps: 0,
      totalTurns: 0,
      lastUpdated: new Date().toISOString()
    });
  },
  
  // ==================== SETTINGS OPERATIONS ====================
  
  /**
   * Save setting
   */
  async saveSetting(key, value) {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['settings'], 'readwrite');
      const store = transaction.objectStore('settings');
      
      const data = { key, value, updated: Date.now() };
      const request = store.put(data);
      
      request.onsuccess = () => {
        console.log('✅ Setting saved:', key);
        resolve(value);
      };
      
      request.onerror = () => {
        console.error('❌ Failed to save setting');
        reject(request.error);
      };
    });
  },
  
  /**
   * Get setting
   */
  async getSetting(key, defaultValue = null) {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['settings'], 'readonly');
      const store = transaction.objectStore('settings');
      const request = store.get(key);
      
      request.onsuccess = () => {
        resolve(request.result ? request.result.value : defaultValue);
      };
      
      request.onerror = () => {
        console.error('❌ Failed to get setting');
        resolve(defaultValue);
      };
    });
  },
  
  /**
   * Get all settings
   */
  async getSettings() {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['settings'], 'readonly');
      const store = transaction.objectStore('settings');
      const request = store.getAll();
      
      request.onsuccess = () => {
        const settings = {};
        request.result.forEach(item => {
          settings[item.key] = item.value;
        });
        resolve(settings);
      };
      
      request.onerror = () => {
        console.error('❌ Failed to get settings');
        reject(request.error);
      };
    });
  },
  
  /**
   * Save multiple settings
   */
  async saveSettings(settingsObj) {
    const promises = Object.entries(settingsObj).map(([key, value]) => 
      this.saveSetting(key, value)
    );
    return Promise.all(promises);
  },
  
  /**
   * Delete setting
   */
  async deleteSetting(key) {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['settings'], 'readwrite');
      const store = transaction.objectStore('settings');
      const request = store.delete(key);
      
      request.onsuccess = () => {
        console.log('✅ Setting deleted:', key);
        resolve(true);
      };
      
      request.onerror = () => {
        console.error('❌ Failed to delete setting');
        reject(request.error);
      };
    });
  },
  
  // ==================== USER PREFERENCES ====================
  
  /**
   * Get user name
   */
  async getUserName() {
    return this.getSetting('userName', 'Dancer');
  },
  
  /**
   * Save user name
   */
  async saveUserName(name) {
    return this.saveSetting('userName', name);
  },
  
  /**
   * Get selected routine
   */
  async getSelectedRoutine() {
    return this.getSetting('selectedRoutine', 'Freestyle');
  },
  
  /**
   * Set selected routine
   */
  async setSelectedRoutine(routineName) {
    return this.saveSetting('selectedRoutine', routineName);
  },
  
  /**
   * Get permission status
   */
  async getPermissionStatus() {
    return this.getSetting('permissions', null);
  },
  
  /**
   * Save permission status
   */
  async savePermissionStatus(permissions) {
    return this.saveSetting('permissions', permissions);
  },
  
  // ==================== UTILITY FUNCTIONS ====================
  
  /**
   * Parse duration string (MM:SS) to seconds
   */
  parseDuration(durationStr) {
    if (!durationStr) return 0;
    const parts = durationStr.split(':');
    const minutes = parseInt(parts[0]) || 0;
    const seconds = parseInt(parts[1]) || 0;
    return minutes * 60 + seconds;
  },
  
  /**
   * Export all data as JSON
   */
  async exportAllData() {
    const sessions = await this.getAllSessions();
    const settings = await this.getSettings();
    const statistics = await this.getStatistics();
    
    return {
      exportDate: new Date().toISOString(),
      appVersion: '1.0.0',
      sessions,
      settings,
      statistics
    };
  },
  
  /**
   * Import data from JSON
   */
  async importData(data) {
    if (!data || !data.sessions) {
      throw new Error('Invalid import data');
    }
    
    // Clear existing data
    await this.clearAllData();
    
    // Import sessions
    for (const session of data.sessions) {
      delete session.id; // Remove old IDs
      await this.saveSession(session);
    }
    
    // Import settings
    if (data.settings) {
      await this.saveSettings(data.settings);
    }
    
    console.log('✅ Data imported successfully');
  },
  
  /**
   * Clear all data
   */
  async clearAllData() {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['sessions', 'settings', 'statistics'], 'readwrite');
      
      const sessionsStore = transaction.objectStore('sessions');
      const settingsStore = transaction.objectStore('settings');
      const statisticsStore = transaction.objectStore('statistics');
      
      sessionsStore.clear();
      settingsStore.clear();
      statisticsStore.clear();
      
      transaction.oncomplete = () => {
        console.log('✅ All data cleared');
        resolve(true);
      };
      
      transaction.onerror = () => {
        console.error('❌ Failed to clear data');
        reject(transaction.error);
      };
    });
  },
  
  /**
   * Get database info
   */
  async getDatabaseInfo() {
    const sessions = await this.getAllSessions();
    const settings = await this.getSettings();
    const stats = await this.getStatistics();
    
    return {
      dbName: this.dbName,
      dbVersion: this.dbVersion,
      sessionCount: sessions.length,
      settingCount: Object.keys(settings).length,
      statistics: stats
    };
  }
};

// Initialize database on load
Database.init().then(() => {
  console.log('✅ Database ready');
}).catch(error => {
  console.error('❌ Database initialization failed:', error);
});

// Export for global use
window.Database = Database;