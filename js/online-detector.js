/**
 * Online Detector Module
 * Handles online/offline detection and notifications
 */
const OnlineDetector = {
    isOnline: navigator.onLine,
    wasOffline: false,
    checkInterval: null,
    
    /**
     * Initialize online/offline detection
     */
    init() {
        console.log('Initializing online detector...');
        
        this.isOnline = navigator.onLine;
        console.log('Initial status:', this.isOnline ? 'ONLINE' : 'OFFLINE');
        
        this.updateUI();
        
        window.addEventListener('online', () => {
            console.log('Connection restored - ONLINE');
            this.handleOnline();
        });
        
        window.addEventListener('offline', () => {
            console.log('Connection lost - OFFLINE');
            this.handleOffline();
        });
        
        this.startBackupCheck();
        
        console.log('Online detector initialized');
        return this.isOnline;
    },
    
    /**
     * Start backup connectivity check
     */
    startBackupCheck() {
        this.checkInterval = setInterval(() => {
            const currentStatus = navigator.onLine;
            
            if (currentStatus !== this.isOnline) {
                console.log('Status changed:', currentStatus ? 'ONLINE' : 'OFFLINE');
                
                if (currentStatus) {
                    this.handleOnline();
                } else {
                    this.handleOffline();
                }
            }
        }, 30000);
    },
    
    /**
     * Stop backup check
     */
    stopBackupCheck() {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
            this.checkInterval = null;
            console.log('Backup check stopped');
        }
    },
    
    /**
     * Handle online event
     */
    handleOnline() {
        this.isOnline = true;
        
        if (this.wasOffline) {
            console.log('Back online after being offline');
            
            if (typeof NotificationSystem !== 'undefined') {
                NotificationSystem.sendBackOnlineNotification();
            }
            
            this.showToast('You\'re back online!', 'success');
            
            this.wasOffline = false;
        }
        
        this.updateUI();
    },
    
    /**
     * Handle offline event
     */
    handleOffline() {
        this.isOnline = false;
        this.wasOffline = true;
        
        console.log('Offline mode activated');
        
        this.showToast('You\'re offline. Some features may be limited.', 'warning');
        
        if (typeof NotificationSystem !== 'undefined') {
            NotificationSystem.sendOfflineNotification();
        }
        
        this.updateUI();
    },
    
    /**
     * Update UI elements
     */
    updateUI() {
        if (this.isOnline) {
            document.body.classList.remove('offline-mode');
            document.body.classList.add('online-mode');
        } else {
            document.body.classList.remove('online-mode');
            document.body.classList.add('offline-mode');
        }
        
        const statusElements = document.querySelectorAll('.online-status');
        statusElements.forEach(el => {
            if (this.isOnline) {
                el.innerHTML = '<i class="bi bi-wifi text-success"></i>';
                el.title = 'Online';
            } else {
                el.innerHTML = '<i class="bi bi-wifi-off text-danger"></i>';
                el.title = 'Offline';
            }
        });
        
        console.log('UI updated with connection status');
    },
    
    /**
     * Show toast message
     */
    showToast(message, type = 'info') {
        const existingToast = document.getElementById('connectionToast');
        if (existingToast) {
            existingToast.remove();
        }
        
        const toast = document.createElement('div');
        toast.id = 'connectionToast';
        toast.className = `toast-notification toast-${type}`;
        toast.textContent = message;
        
        let bgColor = '#3b82f6';
        if (type === 'success') bgColor = '#10b981';
        if (type === 'warning') bgColor = '#f59e0b';
        if (type === 'error') bgColor = '#ef4444';
        
        toast.style.cssText = `
            position: fixed;
            top: 80px;
            left: 50%;
            transform: translateX(-50%);
            background: ${bgColor};
            color: white;
            padding: 14px 24px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.4);
            z-index: 99999;
            font-size: 15px;
            font-weight: 500;
            animation: slideDown 0.3s ease-out;
            max-width: 90%;
            text-align: center;
        `;
        
        if (!document.getElementById('toastAnimation')) {
            const style = document.createElement('style');
            style.id = 'toastAnimation';
            style.textContent = `
                @keyframes slideDown {
                    from { 
                        transform: translateX(-50%) translateY(-100%); 
                        opacity: 0; 
                    }
                    to { 
                        transform: translateX(-50%) translateY(0); 
                        opacity: 1; 
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideDown 0.3s ease-out reverse';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
        
        console.log('Toast shown:', message);
    },
    
    /**
     * Check if online
     */
    checkStatus() {
        return this.isOnline;
    },
    
    /**
     * Get connection info
     */
    getConnectionInfo() {
        if ('connection' in navigator || 'mozConnection' in navigator || 'webkitConnection' in navigator) {
            const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            
            return {
                online: this.isOnline,
                type: connection.effectiveType || 'unknown',
                downlink: connection.downlink || 0,
                rtt: connection.rtt || 0,
                saveData: connection.saveData || false
            };
        }
        
        return {
            online: this.isOnline,
            type: 'unknown',
            downlink: 0,
            rtt: 0,
            saveData: false
        };
    },
    
    /**
     * Show connection info
     */
    showConnectionInfo() {
        const info = this.getConnectionInfo();
        const infoText = `
Connection Status:
------------------
Status: ${info.online ? 'ONLINE' : 'OFFLINE'}
Type: ${info.type}
Downlink: ${info.downlink} Mbps
RTT: ${info.rtt} ms
Data Saver: ${info.saveData ? 'ON' : 'OFF'}
        `.trim();
        
        alert(infoText);
    }
};

// Auto-initialize when script loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        OnlineDetector.init();
    });
} else {
    OnlineDetector.init();
}

console.log('Online detector module loaded');