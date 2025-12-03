# 🔗 QR Code & Access Instructions

Quick access methods for DanceBud demo and installation.

---

## 📱 QR Code Generation

### Using QR Code Generator (Online)

1. **Visit**: https://www.qr-code-generator.com/
2. **Select**: URL mode
3. **Enter URL**: Your DanceBud deployment URL
   - Development: `http://localhost:8000`
   - Production: `https://dancebudpwa.com` (example)
4. **Generate**: Click "Create QR Code"
5. **Download**: Save as PNG (for presentation slides)
6. **Size**: Recommend 500x500px minimum for clarity

### Using Node.js (Automated)

```bash
npm install qrcode-cli
qrcode "https://your-domain.com" > qrcode.png
```

### Using Python

```bash
pip install qrcode[pil]
python -c "import qrcode; qr = qrcode.QRCode(); qr.add_data('https://your-domain.com'); qr.make(); qr.make_image().save('qrcode.png')"
```

### Using Terminal (Linux/macOS)

```bash
# Install qrencode
brew install qrencode  # macOS
sudo apt install qrencode  # Linux

# Generate QR code
qrencode -o qrcode.png "https://your-domain.com"
```

---

## 🌐 Deployment URLs

### Development Environment

```
Local Testing: http://localhost:8000
HTTPS Local: https://localhost:8000 (with certificates)
```

### Production Deployments

**Option 1: GitHub Pages**
```
URL: https://Pouvalen2401.github.io/dancebudpwa
QR: [Generate from above URL]
```

**Option 2: Netlify**
```
URL: https://dancebudpwa.netlify.app
QR: [Generate from above URL]
```

**Option 3: Vercel**
```
URL: https://dancebudpwa.vercel.app
QR: [Generate from above URL]
```

**Option 4: Custom Domain**
```
URL: https://dancebudpwa.com (example)
QR: [Generate from above URL]
```

---

## 📋 Installation Instructions

### For Presentation Slides

**Slide Layout** (last slide):
```
┌─────────────────────────────────────────┐
│                                         │
│       Try DanceBud Today! 🎵            │
│                                         │
│       [QR CODE HERE - 300x300px]        │
│                                         │
│       dancebudpwa.com                   │
│       or scan QR code above             │
│                                         │
│       Questions? team@dancebudpwa.com   │
│       GitHub: Pouvalen2401/dancebudpwa  │
│                                         │
└─────────────────────────────────────────┘
```

### Step-by-Step User Instructions

```
1️⃣  SCAN THE QR CODE
   - Use any phone camera or QR code reader
   - Will open DanceBud in browser

2️⃣  GRANT PERMISSIONS
   - Camera (for pose detection)
   - Microphone (for BPM detection)
   - Motion Sensors (for energy tracking)

3️⃣  INSTALL AS APP (Optional)
   - Browser shows "Install" button
   - Tap "Install"
   - App appears on home screen
   - Tap to launch anytime

4️⃣  START PRACTICING
   - Click "Start Practice"
   - Select a routine
   - Dance and track performance!
```

---

## 📱 Browser Installation Guide

### Chrome (Android & Desktop)

1. Visit DanceBud URL in Chrome
2. Look for install icon (arrow pointing down in address bar)
3. Tap "Install"
4. App installs to device

### Edge (Windows & Android)

1. Visit DanceBud URL in Edge
2. Click app install button (top right)
3. Click "Install"
4. App installs to device

### Firefox (Android & Desktop)

1. Visit DanceBud URL
2. Tap menu (three dots)
3. Tap "Install" or "Add to Home Screen"
4. Confirm installation

### Safari (iOS & macOS)

1. Visit DanceBud URL in Safari
2. Tap Share button (box with arrow)
3. Scroll and tap "Add to Home Screen"
4. Enter app name
5. Tap "Add"
6. App appears on home screen

---

## 🖨️ QR Code Printing Guide

### For Physical Posters

```
SIZE RECOMMENDATIONS:
- Small (business card): 1" x 1" (254x254px)
- Medium (flyer): 2" x 2" (508x508px)
- Large (poster): 4" x 4" (1016x1016px)
- Extra-large (banner): 8" x 8" (2032x2032px)

RESOLUTION:
- Minimum DPI: 72 DPI (screen display)
- Recommended DPI: 300 DPI (print)
- Format: PNG (lossless), PDF (scalable)
```

### For Digital Display

```
SCREEN SIZES:
- Phone: 200x200px to 400x400px
- Tablet: 400x400px to 800x800px
- Desktop: 500x500px to 1000x1000px
- Projector: 800x800px to 2000x2000px

FORMAT: PNG with transparent background
COLORS: High contrast (black QR on white background)
```

---

## 🔐 QR Code Best Practices

### Do's
✅ Use high contrast (black on white)
✅ Add white border (quiet zone) around QR
✅ Test QR code before publishing
✅ Use unique URL for each use case
✅ Track scans with URL parameters (optional)

### Don'ts
❌ Modify colors (keep black and white)
❌ Rotate or skew the QR code
❌ Add excessive decorations
❌ Make code too small to scan
❌ Use expired URLs

### Scanning Tips for Audience
✅ Good lighting needed for scanning
✅ Hold camera steady
✅ Keep QR code in frame
✅ Allow 2-3 seconds for recognition
✅ Clean camera lens

---

## 📊 QR Code Tracking (Optional)

### Using URL Parameters

```
# Regular URL
https://dancebudpwa.com

# With tracking (Google Analytics)
https://dancebudpwa.com?utm_source=presentation&utm_medium=qrcode&utm_campaign=demo_day

# Short URL service (Bit.ly, TinyURL)
https://bit.ly/dancebudpwa
```

### Bit.ly Setup

1. Visit https://bitly.com
2. Login or create account
3. Enter long URL
4. Get shortened link
5. Generate QR code from short link
6. Track clicks in Bit.ly dashboard

### Analytics Dashboard

```
Track in Google Analytics:
- Source: Direct / QR Code
- Medium: Presentation
- Campaign: Demo Day
- Custom events: Installation, Session Started
```

---

## 🎬 Demo Environment Setup

### Pre-Demo Checklist

```
⚡ 1 HOUR BEFORE
- [ ] Test URL in browser (load page)
- [ ] Test camera/microphone access
- [ ] Refresh to ensure caching works
- [ ] Have backup internet connection
- [ ] Test on smartphone (actual device)

⚡ 15 MINUTES BEFORE
- [ ] Have QR code visible/printed
- [ ] Open URL in browser tab (ready to use)
- [ ] Close other browser tabs (for performance)
- [ ] Enable high brightness (easier to see)
- [ ] Have speaker notes ready

⚡ RIGHT BEFORE DEMO
- [ ] Camera is clean
- [ ] Good lighting in room
- [ ] Microphone tested
- [ ] Demo video backup ready (if needed)
```

### Backup Plans

```
If Live Demo Fails:
1. Show pre-recorded demo video (3-5 min)
2. Show screenshots of all screens
3. Explain features with slides
4. Provide QR code for audience to try later

If Camera Not Available:
1. Use smartphone camera instead
2. Show on secondary screen
3. Provide demo video showing camera usage

If Internet Down:
1. Open offline-cached version (app loaded once)
2. Show data from previous sessions
3. Demonstrate data export feature
```

---

## 🚀 Deployment Checklist

### Before Publishing URL

- [ ] All features tested working
- [ ] No console errors or warnings
- [ ] HTTPS certificate valid
- [ ] PWA manifest configured
- [ ] Service Worker registered
- [ ] Performance tested (Lighthouse 90+)
- [ ] Responsive design verified
- [ ] Accessibility audit passed
- [ ] Security scan passed
- [ ] README complete
- [ ] QR codes generated
- [ ] Analytics configured
- [ ] Error monitoring active

### After Publishing URL

- [ ] Test link from actual QR code
- [ ] Verify PWA installation works
- [ ] Check offline functionality
- [ ] Monitor error logs
- [ ] Gather user feedback
- [ ] Fix critical issues within 24 hours

---

## 📞 Support Information

### For Audience Inquiries

```
Website: dancebudpwa.com
GitHub: github.com/Pouvalen2401/dancebudpwa
Email: team@dancebudpwa.com
Twitter: @DanceBudPWA

Bug Reports: github.com/Pouvalen2401/dancebudpwa/issues
Feature Requests: discussions or issues
```

### Troubleshooting Links

```
Camera Not Working:
→ See TROUBLESHOOTING in README

Installation Issues:
→ See USER_GUIDE.md

Technical Questions:
→ See TECHNICAL.md

General FAQ:
→ See README.md
```

---

## 📱 Sample QR Code Text

For printing or digital display:

```
🎵 DanceBud - AI Dance Coach 🎵

Real-time pose detection
Automatic BPM sync
Track your progress

Scan to try now →  [QR CODE]

Visit: dancebudpwa.com
GitHub: Pouvalen2401/dancebudpwa
```

---

## 📊 Post-Demo Follow-Up

### Email Template

```
Subject: Try DanceBud - Dance Coach PWA 🎵

Hi [Name],

Thank you for attending our presentation!

Try DanceBud here: [URL or QR Code]

Key Features:
✅ AI-powered pose detection
✅ Real-time BPM sync
✅ Complete offline support
✅ Installable as app

Feedback? Questions?
→ Email: team@dancebudpwa.com
→ GitHub: github.com/Pouvalen2401/dancebudpwa

Happy dancing! 💃🕺

Team DanceBud
```

---

**Last Updated**: December 3, 2025

Ready to share! 🚀
