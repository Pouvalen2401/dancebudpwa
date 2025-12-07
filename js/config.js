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
 };
 // Make globally available
 window.AppConfig = AppConfig;