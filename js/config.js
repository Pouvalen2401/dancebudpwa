/**
 * App Configuration
 * Update these values for production
 */
 const AppConfig = {
  // Environment
  ENV: 'production', // 'development' or 'production'
  DEBUG_MODE: false, // Set to false for production
  
  // App Info
  APP_NAME: 'DanceBud',
  VERSION: '1.0.0',
  BUILD_DATE: '2024-12-07',
  
  // URLs
  BASE_URL: 'https://yourusername.github.io/dancebudpwa',
  REPO_URL: 'https://github.com/yourusername/dancebudpwa',
  SUPPORT_EMAIL: 'support@dancebudapp.com',
  
  // Features
  ENABLE_ANALYTICS: false, // Set true if using analytics
  ENABLE_ERROR_REPORTING: false,
  
  // Sensor Settings
  POSE_DETECTION: {
    modelType: 'lightning', // 'lightning' for speed, 'thunder' for accuracy
    minConfidence: 0.3,
    maxPoses: 1
  },
  
  AUDIO: {
    fftSize: 2048,
    smoothingTimeConstant: 0.8,
    minDecibels: -90,
    maxDecibels: -10
  },
  
  MOTION: {
    stepThreshold: 1.2,
    turnThreshold: 45,
    sampleRate: 100
  }
  ,
  // Map genre keys to arrays of audio file paths (place MP3s under assets/audio/)
  // Each genre provides a small curated set of 5 tracks the user can choose from.
  AUDIO_MAP: {
    'hiphop': [
      'asset/icon/audio/hiphop-1.mp3',
      'asset/icon/audio/hiphop-2.mp3',
      'asset/icon/audio/hiphop-3.mp3',
      'asset/icon/audio/hiphop-4.mp3',
      'asset/icon//audio/hiphop-5.mp3'
    ],
    'contemporary': [
      'asset/icon/audio/contemporary-1.mp3',
      'asset/icon/audio/contemporary-2.mp3',
      'asset/icon/audio/contemporary-3.mp3',
      'asset/icon/audio/contemporary-4.mp3',
      'asset/icon/audio/contemporary-5.mp3'
    ],
    'ballet': [
      'asset/audio/ballet-1.mp3',
      'asset/audio/ballet-2.mp3',
      'asset/audio/ballet-3.mp3',
      'asset/audio/ballet-4.mp3',
      'asset/audio/ballet-5.mp3'
    ],
    'latin': [
      'assets/audio/latin-1.mp3',
      'assets/audio/latin-2.mp3',
      'assets/audio/latin-3.mp3',
      'assets/audio/latin-4.mp3',
      'assets/audio/latin-5.mp3'
    ],
    'freestyle': [
      'assets/audio/freestyle-1.mp3',
      'assets/audio/freestyle-2.mp3',
      'assets/audio/freestyle-3.mp3',
      'assets/audio/freestyle-4.mp3',
      'assets/audio/freestyle-5.mp3'
    ],
    'pop': [
      'assets/audio/pop-1.mp3',
      'assets/audio/pop-2.mp3',
      'assets/audio/pop-3.mp3',
      'assets/audio/pop-4.mp3',
      'assets/audio/pop-5.mp3'
    ],
    'salsa': [
      'assets/audio/salsa-1.mp3',
      'assets/audio/salsa-2.mp3',
      'assets/audio/salsa-3.mp3',
      'assets/audio/salsa-4.mp3',
      'assets/audio/salsa-5.mp3'
    ],
    'jazz': [
      'assets/audio/jazz-1.mp3',
      'assets/audio/jazz-2.mp3',
      'assets/audio/jazz-3.mp3',
      'assets/audio/jazz-4.mp3',
      'assets/audio/jazz-5.mp3'
    ]
  }
 };
 // Make globally available
 window.AppConfig = AppConfig;