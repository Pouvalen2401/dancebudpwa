# 🔧 DanceBud Technical Documentation

Complete technical reference for DanceBud architecture, modules, and APIs.

## 📚 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Module Reference](#module-reference)
3. [Data Models](#data-models)
4. [API Documentation](#api-documentation)
5. [Database Schema](#database-schema)
6. [Contributing Guidelines](#contributing-guidelines)

---

## 🏗️ Architecture Overview

### Project Structure

```
dancebudpwa/
├── index.html                 # Main entry point
├── manifest.json              # PWA manifest
├── sw.js                      # Service Worker
├── css/
│   ├── style.css             # Main styles & theme
│   └── animations.css        # Keyframes & transitions
├── js/
│   ├── storage.js            # LocalStorage wrapper
│   ├── database.js           # IndexedDB management
│   ├── notifications.js      # Notification system
│   ├── theme.js              # Dark/light theme
│   ├── camera.js             # Pose detection
│   ├── audio.js              # BPM detection
│   ├── motion.js             # Motion sensors
│   ├── online-detector.js    # Offline detection
│   ├── session.js            # Session state
│   ├── navigation.js         # Screen routing
│   └── app.js                # Initialization
├── screens/
│   ├── splash.html           # Loading screen
│   ├── permissions.html      # Permission requests
│   ├── home.html             # Dashboard
│   ├── practice.html         # Main practice interface
│   ├── routines.html         # Routine selection
│   ├── history.html          # Session history
│   ├── settings.html         # Settings panel
│   └── summary.html          # Session summary
├── asset/
│   ├── icons/                # PWA icons
│   └── images/               # Graphics
└── https/                     # HTTPS certificates (dev)
```

### Module Initialization Order

```javascript
// 1. Storage (needed by all)
↓
// 2. Database (uses storage)
↓
// 3. Notifications (uses storage)
↓
// 4. Theme System (uses storage)
↓
// 5. Sensor Modules (camera, audio, motion, online-detector)
↓
// 6. Session Manager (uses all sensors + storage)
↓
// 7. Navigation System (loads screens)
↓
// 8. Main App (initializes everything)
```

### Data Flow

```
User Interaction
     ↓
Navigation.navigate(screen)
     ↓
Load Screen HTML
     ↓
Execute Screen Scripts
     ↓
Modules (Camera, Audio, Database, Session)
     ↓
Update UI
     ↓
Persist to IndexedDB
     ↓
Display Results
```

---

## 📦 Module Reference

### 1. Storage Module (`storage.js`)

LocalStorage wrapper for key-value data.

```javascript
// Get value
const theme = Storage.get('theme', 'dark');

// Set value
Storage.set('theme', 'light');

// Remove value
Storage.remove('theme');

// Clear all
Storage.clear();

// Get all keys
const keys = Storage.getAllKeys();
```

**Usage**: Theme, preferences, temporary state

---

### 2. Database Module (`database.js`)

IndexedDB wrapper for structured data (sessions, settings, history).

```javascript
// Initialize
await Database.init();

// Sessions
await Database.saveSession(sessionData);
const sessions = await Database.getAllSessions();
const recentSessions = await Database.getRecentSessions(5);
const session = await Database.getSession(id);
await Database.deleteSession(id);
await Database.clearAllSessions();

// Settings
await Database.saveSetting(key, value);
const value = await Database.getSetting(key, defaultValue);
await Database.deleteSetting(key);

// User Preferences
await Database.saveUserName(name);
const name = await Database.getUserName();
await Database.setSelectedRoutine(routineName);
const routine = await Database.getSelectedRoutine();

// Import/Export
const data = await Database.exportAllData();
await Database.importData(jsonData);
await Database.clearAllData();

// Statistics
const stats = await Database.getStatistics();
const info = await Database.getDatabaseInfo();
```

**Database Structure**:
- `sessions` - Practice session records
- `settings` - User settings and preferences
- `routines` - Available dance routines

---

### 3. Camera Module (`camera.js`)

Real-time pose detection using TensorFlow.js + MoveNet.

```javascript
// Initialize
await CameraModule.initPoseDetector();

// Start camera feed
await CameraModule.startCamera(videoElement, canvasElement);

// Start pose detection
await CameraModule.startPoseDetection((pose, score) => {
  console.log('Detected pose:', pose);
  console.log('Posture score:', score);
});

// Draw skeleton on canvas
CameraModule.drawSkeleton(pose);

// Calculate posture score (0-100)
const score = CameraModule.calculatePostureScore(pose);

// Stop detection
CameraModule.stopPoseDetection();

// Stop camera
CameraModule.stopCamera();
```

**Pose Format**:
```javascript
{
  keypoints: [
    { x: 100, y: 200, score: 0.95 },  // 0: nose
    { x: 110, y: 190, score: 0.92 },  // 1: left eye
    // ... 17 total keypoints
  ],
  score: 0.87  // Overall confidence
}
```

**Keypoint Indices**:
```
0: nose
1: left_eye, 2: right_eye
3: left_ear, 4: right_ear
5: left_shoulder, 6: right_shoulder
7: left_elbow, 8: right_elbow
9: left_wrist, 10: right_wrist
11: left_hip, 12: right_hip
13: left_knee, 14: right_knee
15: left_ankle, 16: right_ankle
```

---

### 4. Audio Module (`audio.js`)

BPM (tempo) detection from microphone input.

```javascript
// Check microphone availability
const available = AudioModule.isAvailable();

// Request permission
const granted = await AudioModule.requestPermission();

// Start monitoring
await AudioModule.startMonitoring((bpm) => {
  console.log('Detected BPM:', bpm);
});

// Detect BPM
const bpm = AudioModule.detectBPM();

// Stop monitoring
AudioModule.stopMonitoring();
```

**BPM Range**: 60-180 BPM (typical music range)

---

### 5. Motion Module (`motion.js`)

Accelerometer and gyroscope integration.

```javascript
// Check availability
const available = MotionModule.isAvailable();

// Request permission (iOS 13+)
const granted = await MotionModule.requestPermission();

// Start tracking
await MotionModule.startTracking((motion) => {
  console.log('Motion data:', motion);
});

// Calibrate sensors
const calibration = await MotionModule.calibrate();

// Update energy from movement
MotionModule.updateEnergy(intensityLevel);

// Stop tracking
MotionModule.stopTracking();
```

**Motion Data**:
```javascript
{
  x: -0.5,      // Acceleration X
  y: 9.8,       // Acceleration Y
  z: 0.2,       // Acceleration Z
  intensity: 45 // Movement intensity (0-100)
}
```

---

### 6. Session Module (`session.js`)

Session state management and data collection.

```javascript
// Start session
Session.start('Hip Hop');

// Pause session
Session.pause();

// Resume session
Session.resume();

// Update session data
Session.update('steps', 10);
Session.update('turns', 2);
Session.update('energy', 75);

// Get current duration (seconds)
const duration = Session.getDuration();

// Get formatted duration
const formatted = Session.formatDuration(duration);

// Get session summary
const summary = Session.getSummary();

// End session and save
await Session.end();
```

**Session Data Structure**:
```javascript
{
  routineName: string,
  duration: number,           // seconds
  steps: number,
  turns: number,
  energy: number,             // 0-100
  score: number,              // 0-100 (posture avg)
  avgBPM: number,
  postureReadings: [number],  // Array of posture scores
  bpmReadings: [number],      // Array of BPM samples
  timestamps: [number],       // Recording times
  date: ISO8601 timestamp
}
```

---

### 7. Theme Module (`theme.js`)

Dark/light mode management.

```javascript
// Initialize theme
await ThemeSystem.init();

// Toggle theme
const newTheme = await ThemeSystem.toggle();

// Set theme explicitly
await ThemeSystem.setTheme('light'); // or 'dark'

// Get current theme
const current = ThemeSystem.getCurrentTheme();

// Listen for theme changes
ThemeSystem.onThemeChange((theme) => {
  console.log('Theme changed to:', theme);
});
```

**CSS Variables**:
```css
:root {
  --bg-primary: #000000;
  --bg-secondary: #0a0a0a;
  --text-primary: #ffffff;
  --neon-cyan: #06b6d4;
  --neon-purple: #a855f7;
  --neon-pink: #ec4899;
}
```

---

### 8. Navigation Module (`navigation.js`)

Screen routing and management.

```javascript
// Navigate to screen
await Navigation.navigate('practice');

// Load screen HTML
const html = await Navigation.loadScreen('home');

// Initialize screen
Navigation.initializeScreen('practice');

// Go back to previous screen
Navigation.goBack();

// Get current screen
const screen = Navigation.currentScreen;
```

**Available Screens**:
- `splash`
- `permissions`
- `home`
- `practice`
- `routines`
- `history`
- `settings`
- `summary`

---

### 9. Notifications Module (`notifications.js`)

Push notifications and notification history.

```javascript
// Check permission status
const permission = NotificationManager.permission;

// Request permission
await NotificationManager.requestPermission();

// Send notification
NotificationManager.sendNotification({
  title: 'Practice Complete!',
  body: 'Great session! 87% posture score.',
  icon: '/assets/icons/icon-192x192.png',
  onClick: () => Navigation.navigate('summary')
});

// Get notification history
const history = await NotificationManager.getHistory();

// Save notification
await NotificationManager.saveNotification({
  title: 'Test',
  body: 'Test notification',
  timestamp: new Date().toISOString(),
  read: false
});
```

---

## 📊 Data Models

### Session Data

```javascript
{
  id: 'session_1701590400000',
  routineName: 'Hip Hop',
  durationSeconds: 600,
  score: 87,
  avgBPM: 128,
  steps: 450,
  turns: 22,
  energy: 78,
  postureReadings: [85, 86, 87, 88, ...],
  bpmReadings: [125, 128, 130, ...],
  date: '2025-12-03T10:30:00Z'
}
```

### Settings Data

```javascript
{
  userName: 'Dancer Name',
  selectedRoutine: 'freestyle',
  darkMode: true,
  showSkeleton: true,
  showFeedback: true,
  showBPM: true,
  practiceReminders: true,
  reminderTime: '18:00',
  cameraResolution: 'auto'
}
```

### Pose Data

```javascript
{
  keypoints: [
    { x: number, y: number, score: number },  // 17 points
    ...
  ],
  score: number  // Overall confidence (0-1)
}
```

---

## 🗄️ Database Schema

### IndexedDB Structure

```javascript
Database: 'DanceBudDB'

Object Stores:
  ├── sessions
  │   ├── keyPath: 'id'
  │   ├── indexes: ['date', 'routineName', 'score']
  │   └── records: Session objects
  │
  ├── settings
  │   ├── keyPath: 'key'
  │   └── records: { key, value, lastModified }
  │
  └── routines
      ├── keyPath: 'id'
      └── records: { id, name, level, duration, description }
```

### Example Queries

```javascript
// Get all sessions
const allSessions = await Database.getAllSessions();

// Get recent 5 sessions
const recent = await Database.getRecentSessions(5);

// Get specific session
const session = await Database.getSession('session_123');

// Save session
await Database.saveSession(sessionData);

// Delete session
await Database.deleteSession('session_123');

// Export all data
const backup = await Database.exportAllData();

// Import data
await Database.importData(backupData);
```

---

## 🔌 API Endpoints (Optional - Supabase)

### Sessions Endpoint

```
POST /sessions
GET /sessions
GET /sessions/:id
PUT /sessions/:id
DELETE /sessions/:id
```

### Analytics Endpoint

```
GET /analytics/summary
GET /analytics/progress
POST /analytics/export
```

---

## 🛠️ Contributing Guidelines

### Code Style

- **Naming**: camelCase for variables/functions, PascalCase for classes
- **Comments**: JSDoc style for functions
- **Indentation**: 2 spaces
- **Quotes**: Single quotes for strings

### Example Function

```javascript
/**
 * Calculate posture score based on keypoints
 * @param {Array} keypoints - Pose keypoints
 * @returns {number} Score 0-100
 */
function calculatePostureScore(keypoints) {
  // Implementation
  return score;
}
```

### Branch Naming

- Feature: `feature/camera-optimization`
- Bug fix: `fix/pose-detection-lag`
- Docs: `docs/api-reference`

### Commit Messages

```
feat: Add pose detection smoothing
fix: Resolve database corruption on export
docs: Update API documentation
refactor: Simplify theme module
```

### Testing

```bash
# Manual testing checklist
- [ ] Camera initializes on practice screen
- [ ] Pose detection works with good lighting
- [ ] BPM detection responds to tempo changes
- [ ] Session data saves correctly
- [ ] Offline mode works (SW loaded)
- [ ] Theme toggle persists
- [ ] History displays previous sessions
- [ ] Settings calibration works
```

---

## 🚀 Performance Optimization

### Key Metrics

- **First Paint**: < 2s
- **Pose Detection**: 30 FPS
- **BPM Detection**: Real-time (< 100ms)
- **Bundle Size**: < 5MB (including TensorFlow)

### Optimization Tips

1. **Lazy Load Models**: Load TensorFlow only when needed
2. **Use WebWorkers**: Offload pose detection to background
3. **Cache Aggressively**: Service Worker caching strategy
4. **Optimize Images**: Use WebP with fallbacks
5. **Minify Code**: Production build process

---

## 📝 Environment Variables

```bash
# .env (if using build process)
VITE_API_URL=https://api.dancebudpwa.com
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_KEY=xxx
```

---

## 🔐 Security Considerations

- ✅ All data stored locally (IndexedDB) - no cloud required
- ✅ No personal data transmitted
- ✅ HTTPS required for PWA
- ✅ Service Worker only caches app files
- ✅ Camera/microphone only accessed with user permission

---

**Last Updated**: December 3, 2025

For questions or contributions, open an issue on GitHub.
