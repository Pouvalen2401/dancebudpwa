/**
 * Database Module - IndexedDB Wrapper
 * Handles all local data storage
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
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);
      
      request.onerror = () => {
        console.error('Database failed to open');
        reject(request.error);
      };
      
      request.onsuccess = () => {
        this.db = request.result;
        console.log('✅ Database opened successfully');
        resolve(this.db);
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Create object stores
        if (!db.objectStoreNames.contains('sessions')) {
          const sessionsStore = db.createObjectStore('sessions', { 
            keyPath: 'id', 
            autoIncrement: true 
          });
          sessionsStore.createIndex('date', 'date', { unique: false });
          sessionsStore.createIndex('routineName', 'routineName', { unique: false });
        }
        
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
        
        if (!db.objectStoreNames.contains('statistics')) {
          db.createObjectStore('statistics', { keyPath: 'key' });
        }
        
        console.log('✅ Database setup complete');
      };
    });
  },
  
  /**
   * Save a session
   */
  async saveSession(sessionData) {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['sessions'], 'readwrite');
      const store = transaction.objectStore('sessions');
      
      const session = {
        ...sessionData,
        date: new Date().toISOString(),
        id: Date.now()
      };
      
      const request = store.add(session);
      
      request.onsuccess = () => {
        console.log('✅ Session saved:', session.id);
        // Update statistics
        this.updateStatistics(session);
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
    async getAllSessions() {{
    if (!this.db) await this.init();
  }    
},

/**
 * Get selected routine
 */
  async getSelectedRoutine() {
  if (!this.db) await this.init();
  
  try {
    const result = await this.getSetting('selectedRoutine');
    return result || 'Freestyle';
  } catch (error) {
    return 'Freestyle';
  }
},

/**
 * Set selected routine
 */
async setSelectedRoutine(routineName) {
  if (!this.db) await this.init();
  
  return this.saveSetting('selectedRoutine', routineName);
},

/**
 * Get permission status
 */
async getPermissionStatus() {
  if (!this.db) await this.init();
  
  try {
    const result = await this.getSetting('permissions');
    return result || null;
  } catch (error) {
    return null;
  }
},

/**
 * Save permission status
 */
async savePermissionStatus(permissions) {
  if (!this.db) await this.init();
  
  return this.saveSetting('permissions', permissions);
}};
