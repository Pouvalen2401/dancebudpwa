/**
 * Notifications Module
 * Handles notification system and permission management
 */
const NotificationSystem = {
    permission: 'default',
    notifications: [],
    unreadCount: 0,
    
    /**
     * Initialize notification system
     */
    async init() {
        console.log('Initializing notification system...');
        
        if (!('Notification' in window)) {
            console.warn('Notifications not supported in this browser');
            return false;
        }
        
        this.permission = Notification.permission;
        console.log('Notification permission:', this.permission);
        
        this.loadNotifications();
        
        console.log('Notification system initialized');
        return true;
    },
    
    /**
     * Request notification permission
     */
    async requestPermission() {
        if (!('Notification' in window)) {
            alert('Notifications are not supported on this device');
            return false;
        }
        
        if (Notification.permission === 'granted') {
            console.log('Notification permission already granted');
            this.permission = 'granted';
            return true;
        }
        
        try {
            const permission = await Notification.requestPermission();
            this.permission = permission;
            
            if (permission === 'granted') {
                console.log('Notification permission granted');
                
                this.sendNotification({
                    title: 'Notifications Enabled!',
                    body: "You'll receive updates and practice reminders",
                    icon: '/assets/icons/icon-192x192.png'
                });
                
                return true;
            } else {
                console.log('Notification permission denied');
                return false;
            }
        } catch (error) {
            console.error('Error requesting notification permission:', error);
            return false;
        }
    },
    
    /**
     * Send a notification
     */
    sendNotification(options) {
        if (this.permission !== 'granted') {
            console.log('Cannot send notification - permission not granted');
            
            this.saveNotification({
                title: options.title,
                body: options.body,
                timestamp: new Date().toISOString(),
                read: false
            });
            
            return null;
        }
        
        try {
            const notification = new Notification(options.title, {
                body: options.body,
                icon: options.icon || '/assets/icons/icon-192x192.png',
                badge: '/assets/icons/icon-72x72.png',
                vibrate: options.vibrate || [200, 100, 200],
                tag: options.tag || 'dancebudpwa',
                requireInteraction: options.requireInteraction || false
            });
            
            notification.onclick = () => {
                window.focus();
                notification.close();
                
                if (options.onClick) {
                    options.onClick();
                }
            };
            
            this.saveNotification({
                title: options.title,
                body: options.body,
                timestamp: new Date().toISOString(),
                read: false
            });
            
            console.log('Notification sent:', options.title);
            return notification;
            
        } catch (error) {
            console.error('Error sending notification:', error);
            return null;
        }
    },
    
    /**
     * Save notification to localStorage
     */
    saveNotification(notification) {
        this.notifications.unshift(notification);
        this.unreadCount++;
        
        if (this.notifications.length > 50) {
            this.notifications = this.notifications.slice(0, 50);
        }
        
        try {
            localStorage.setItem('notifications', JSON.stringify(this.notifications));
            localStorage.setItem('unreadCount', this.unreadCount.toString());
            
            this.updateBadge();
        } catch (error) {
            console.error('Error saving notification:', error);
        }
    },
    
    /**
     * Load notifications from localStorage
     */
    loadNotifications() {
        try {
            const saved = localStorage.getItem('notifications');
            if (saved) {
                this.notifications = JSON.parse(saved);
            }
            
            const unreadCount = localStorage.getItem('unreadCount');
            if (unreadCount) {
                this.unreadCount = parseInt(unreadCount);
            }
            
            this.updateBadge();
            console.log('Loaded', this.notifications.length, 'notifications');
        } catch (error) {
            console.error('Error loading notifications:', error);
            this.notifications = [];
            this.unreadCount = 0;
        }
    },
    
    /**
     * Get unread count
     */
    getUnreadCount() {
        return this.unreadCount;
    },
    
    /**
     * Mark all as read
     */
    markAllAsRead() {
        this.notifications.forEach(n => n.read = true);
        this.unreadCount = 0;
        
        try {
            localStorage.setItem('notifications', JSON.stringify(this.notifications));
            localStorage.setItem('unreadCount', '0');
            
            this.updateBadge();
            console.log('All notifications marked as read');
        } catch (error) {
            console.error('Error marking notifications as read:', error);
        }
    },
    
    /**
     * Update notification badge
     */
    updateBadge() {
        const badge = document.getElementById('notificationBadge');
        if (badge) {
            if (this.unreadCount > 0) {
                badge.textContent = this.unreadCount > 9 ? '9+' : this.unreadCount;
                badge.style.display = 'inline-block';
            } else {
                badge.style.display = 'none';
            }
        }
    },
    
    /**
     * Show notification list
     */
    showNotificationList() {
        if (this.notifications.length === 0) {
            alert('No notifications yet!\n\nYou\'ll receive notifications when:\n- You come back online\n- Updates are available\n- Practice reminders are due');
            return;
        }
        
        const list = this.notifications.slice(0, 5).map((n, i) => {
            const status = n.read ? 'Read' : 'New';
            return `[${status}] ${n.title}\n   ${n.body}\n   ${this.formatDate(n.timestamp)}`;
        }).join('\n\n');
        
        const total = this.notifications.length;
        const showing = Math.min(5, total);
        
        alert(`Notifications (${showing} of ${total}):\n\n${list}\n\n${total > 5 ? '(Showing latest 5)' : ''}`);
        
        this.markAllAsRead();
    },
    
    /**
     * Format date
     */
    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} min ago`;
        
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        
        const diffDays = Math.floor(diffHours / 24);
        if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        
        return date.toLocaleDateString();
    },
    
    /**
     * Clear all notifications
     */
    clearAll() {
        if (confirm('Clear all notifications?')) {
            this.notifications = [];
            this.unreadCount = 0;
            
            try {
                localStorage.removeItem('notifications');
                localStorage.removeItem('unreadCount');
                this.updateBadge();
                console.log('All notifications cleared');
                alert('Notifications cleared');
            } catch (error) {
                console.error('Error clearing notifications:', error);
            }
        }
    },
    
    /**
     * Send practice reminder
     */
    sendPracticeReminder() {
        this.sendNotification({
            title: 'Time to Practice!',
            body: "Let's dance! Open DanceBud and start a session.",
            vibrate: [200, 100, 200, 100, 200],
            onClick: () => {
                console.log('Practice reminder clicked');
            }
        });
    },
    
    /**
     * Send back online notification
     */
    sendBackOnlineNotification() {
        this.sendNotification({
            title: 'You\'re Back Online!',
            body: 'Your connection has been restored.',
            vibrate: [200]
        });
    },
    
    /**
     * Send update available notification
     */
    sendUpdateNotification() {
        this.sendNotification({
            title: 'Update Available!',
            body: 'A new version of DanceBud is ready. Refresh to update.',
            requireInteraction: true,
            onClick: () => {
                if (confirm('Update DanceBud now? This will refresh the page.')) {
                    window.location.reload();
                }
            }
        });
    },
    
    /**
     * Send offline mode notification
     */
    sendOfflineNotification() {
        this.sendNotification({
            title: 'You\'re Offline',
            body: 'Some features may be limited. Your data will sync when online.',
            vibrate: [100, 50, 100]
        });
    },
    
    /**
     * Test notification
     */
    sendTestNotification() {
        this.sendNotification({
            title: 'Test Notification',
            body: 'This is a test notification from DanceBud!',
            onClick: () => {
                alert('Test notification clicked!');
            }
        });
    }
};

// Auto-initialize when script loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        NotificationSystem.init();
    });
} else {
    NotificationSystem.init();
}

console.log('Notification module loaded');