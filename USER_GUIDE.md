# 📱 DanceBud User Guide

Complete guide to using DanceBud for dance practice and performance tracking.

## 🚀 Getting Started

### Installation

#### Web Browser
1. Visit: [DanceBud Web App URL]
2. Browser may prompt "Install DanceBud"
3. Click **Install** to add to home screen

#### PWA Installation
1. Open DanceBud in Chrome, Firefox, Edge, or Safari 15+
2. Look for the **Install** button in the browser
3. Select **Install app**
4. App appears on home screen/app drawer
5. Launch like any native app

### First Launch

1. **Splash Screen** - Shows DanceBud branding (2-3 seconds)
2. **Permissions Screen** - Grant access to:
   - 📷 Camera (for pose detection)
   - 🎤 Microphone (for BPM detection)
   - 📱 Motion Sensors (for energy tracking)
3. **Home Screen** - View stats and start practicing

---

## 🏠 Home Screen

Your central hub for all DanceBud features.

### Statistics Cards (Top)

```
Total Sessions    |    Avg Score    |    Total Time
     [0]          |      [0%]       |      [0m]
```

- **Total Sessions**: Number of practice sessions completed
- **Avg Score**: Average posture score across all sessions
- **Total Time**: Cumulative practice time

### Quick Actions

#### 🎬 Start Practice
- Primary button to begin a practice session
- Leads to routine selection or practice screen
- Main entry point for training

#### 📋 Browse Routines
- View available dance styles
- Styles: Hip Hop, Ballet, Contemporary, Freestyle
- Select one to customize your session

#### 📊 Session History
- View all past practice sessions
- See duration, score, BPM, metrics
- Track progress over time

#### ⚙️ Settings
- Camera calibration
- Display preferences
- Data export/import
- Notification settings

### Daily Pro Tip
- Random coaching tip changes daily
- Suggestions for better technique
- Examples: lighting, distance, warm-up

---

## 🎬 Practice Screen

Where the magic happens - your live dance practice interface.

### Top-Left: Posture Badge

```
Posture
███░░░░░░ 75%
↳ Stand straighter
```

- **Score (0-100%)**: Real-time posture analysis
- **Feedback**: Actionable coaching cues
- **Examples**:
  - "Stand straight" - Improve spinal alignment
  - "Keep shoulders back" - Better posture
  - "Extend legs" - Full body engagement

### Top-Right: Timer

```
⏱️ 05:32
```

- Session duration in MM:SS format
- Updates every second
- Shows total time dancing

### Bottom: BPM Detector

```
🎵 Tap Sync
135 BPM
[████░░░░░░░░░░░░]
```

- **BPM Display**: Detected music tempo
- **Tap Sync Button**: Manually set tempo (tap to the beat)
- **Beat Visualizer**: Animated bars showing rhythm

### Center: Video Feed

- Live camera feed with body skeleton overlay
- 17-point pose detection (head, arms, torso, legs)
- Skeleton highlights in cyan/green based on confidence

### Stats Row (Below Video)

```
👣 Steps    🔄 Turns    ⚡ Energy
  125         8           72%
```

- **Steps**: Count of footsteps detected
- **Turns**: Body rotation/spin count
- **Energy**: Movement intensity (0-100%)

### Bottom Controls

| Button | Function |
|--------|----------|
| **Pause** | Pause tracking (yellow) |
| **End Session** | Stop and save (red) |
| **Close** | Exit to home (dark) |

---

## 📋 Routines Screen

Browse and select dance routines.

### Available Routines

1. **Hip Hop**
   - Level: Beginner to Advanced
   - Duration: 10 min
   - Vibe: Urban, energetic

2. **Ballet Basics**
   - Level: Beginner
   - Duration: 8 min
   - Vibe: Classic, graceful

3. **Contemporary**
   - Level: Advanced
   - Duration: 20 min
   - Vibe: Expressive, modern

4. **Freestyle**
   - Level: All Levels
   - Duration: Custom
   - Vibe: Your choice

### Selecting a Routine

1. Tap any routine card
2. App navigates to practice screen
3. Camera and sensors initialize
4. Start dancing!

---

## 📊 History Screen

Track your dance journey.

### Session List

Each session shows:
- **Date & Time** - When practiced
- **Duration** - Practice length
- **Score** - Posture quality (%)
- **BPM** - Average tempo
- **Routine** - Style selected

### Session Details

Click any session to see:
- Posture readings over time (graph)
- Step and turn counts
- Energy level progression
- Detailed metrics

### Filtering & Sorting

- **By Date**: Today, This Week, This Month, All Time
- **By Score**: Highest, Lowest, Recent
- **By Routine**: Filter by dance style

### Export Data

```
Settings > Data Management > Export
```

Downloads JSON file with all sessions for backup.

---

## ⚙️ Settings Screen

Customize your experience.

### Camera Settings

- **Show Skeleton**: Toggle pose overlay
- **Show Posture**: Real-time feedback toggle
- **Resolution**: Auto/High/Low (affects performance)

### Motion Sensor

- **Calibrate Sensors**: Reset accelerometer baseline
- Recommended before first use
- Takes 2-3 seconds

### Display Options

- **Show BPM**: Display tempo detection
- **Show Feedback**: Real-time coaching cues
- **Dark Mode**: Toggle theme

### Notifications

- **Practice Reminders**: Set daily notification time
- **Session Alerts**: Notify when session ends
- **Achievement Badges**: Celebrate milestones

### Data Management

- **Export All Data**: Save sessions as JSON
- **Import Data**: Restore from backup
- **Clear All Data**: Reset database (⚠️ Irreversible)

### About

- App version
- Developer info
- License information

---

## 📈 Summary Screen

After each practice session.

### Key Metrics

```
Score: 87%        Duration: 10:32
Avg BPM: 128      Posture: 85%
Steps: 450        Turns: 22
Energy: 78%
```

### Feedback

- **Great job!** Messages based on performance
- **Tips** for improvement
- **Achievements** unlocked
- **Streak counter** for consistency

### Next Steps

- **Practice Again** - Start new session
- **Share Results** - Send to friends
- **Home** - Return to dashboard

---

## 🎯 Tips for Best Results

### Optimal Setup

- ✅ **Lighting**: Natural light or well-lit room
- ✅ **Distance**: Stand 3-4 feet from camera
- ✅ **Space**: Clear area (at least 6x6 feet)
- ✅ **Camera**: Eye-level or slightly above
- ✅ **Device**: Landscape mode for better view

### Improving Posture Score

1. **Stand tall** - Full spine extension
2. **Shoulders back** - Avoid hunching
3. **Core engaged** - Maintain balance
4. **Chest open** - Breathe deeply
5. **Legs aligned** - Knees over ankles

### Improving BPM Detection

1. **Turn up volume** - Ensure app can hear music
2. **Tap sync** - If auto-detection fails
3. **Consistent tempo** - Steady music helps
4. **Close other apps** - Reduce CPU load

### Session Tips

- **Warm up** (2 min) before starting
- **Stay hydrated** during practice
- **Practice daily** for best results
- **Mix routines** to work different styles
- **Track trends** over weeks/months

---

## 🐛 Common Issues & Solutions

### "Camera access denied"
1. Check phone Settings > Camera > DanceBud
2. Grant camera permission
3. Reload app
4. Try different browser

### "No pose detected"
1. Increase lighting in room
2. Move closer to camera (3-4 feet)
3. Wear contrasting colors
4. Clear background clutter
5. Update browser

### "Slow/Jittery performance"
1. Close other browser tabs
2. Clear browser cache
3. Reduce screen brightness
4. Close background apps
5. Try incognito mode

### "Can't save session"
1. Check storage quota (Settings > Storage)
2. Clear browser cache
3. Restart browser
4. Try export to backup data
5. Try different browser

### "App crashes on startup"
1. Clear browser cache and data
2. Check HTTPS (if PWA)
3. Try incognito mode
4. Update browser
5. Check browser console (F12) for errors

---

## 📱 Device Support

### Recommended Devices

- **Phones**: iOS 15+, Android 8+
- **Tablets**: iPad 5th gen+, Android tablets
- **Laptops**: Windows 10+, macOS 10.12+

### Browsers

- ✅ Chrome 88+ (Recommended)
- ✅ Firefox 87+
- ✅ Edge 88+
- ✅ Safari 15+

### Hardware Requirements

- Camera (front or rear)
- Microphone (for BPM detection)
- Motion sensors (accelerometer/gyroscope)
- 100MB storage

---

## ⌨️ Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Play/Pause | `Space` |
| End Session | `Esc` |
| Toggle Theme | `T` |
| Open Settings | `S` |
| Go Home | `H` |

---

## 🆘 Need Help?

### In-App Help
- Tap **?** icon on any screen
- View tooltips and tips
- Contact support form

### Online Resources
- Read documentation: [link]
- Watch tutorials: [link]
- Email support: support@dancebudpwa.com

### Report a Bug
- Settings > Help > Report Issue
- Include device, browser, steps to reproduce

---

**Happy Dancing! 🎵💃🕺**

Last Updated: December 3, 2025
