/**
 * Motion Module (Hybrid Version)
 * Real sensors on mobile + Stub for testing/desktop
 */

const MotionModule = {
  isTracking: false,
  callback: null,
  
  // Step detection
  lastAcceleration: null,
  stepCount: 0,
  stepThreshold: 1.2,
  lastStepTime: 0,
  
  // Turn detection
  turnCount: 0,
  lastRotationRate: null,
  turnThreshold: 150,
  lastTurnTime: 0,
  
  // Energy calculation
  energyLevel: 0,
  activityBuffer: [],
  
  // Calibration
  calibrationData: null,
  
  // Fallback mode (when real sensors don't work)
  useFallbackMode: false,
  fallbackInterval: null,
  
  /**
   * Check if motion sensors available
   */
  isAvailable() {
    return 'DeviceMotionEvent' in window && 'DeviceOrientationEvent' in window;
  },
  
  /**
   * Request motion permission (iOS 13+)
   */
  async requestPermission() {
    console.log('📱 Requesting motion sensor permission...');
    
    if (!this.isAvailable()) {
      console.warn('⚠️ Motion sensors not available - will use fallback');
      this.useFallbackMode = true;
      return true;
    }
    
    // iOS 13+ requires permission
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
      try {
        const response = await DeviceMotionEvent.requestPermission();
        
        if (response === 'granted') {
          console.log('✅ Motion permission granted');
          return true;
        } else {
          console.warn('⚠️ Motion permission denied - using fallback');
          this.useFallbackMode = true;
          return true;
        }
      } catch (error) {
        console.error('❌ Motion permission error:', error);
        this.useFallbackMode = true;
        return true;
      }
    } else {
      // Non-iOS or older iOS
      console.log('✅ Motion sensors available (no permission needed)');
      return true;
    }
  },
  
  /**
   * Start tracking motion
   */
  async startTracking(onMotionUpdate) {
    console.log('📱 Starting motion tracking...');
    
    this.callback = onMotionUpdate;
    this.isTracking = true;
    
    // Reset counters
    this.stepCount = 0;
    this.turnCount = 0;
    this.energyLevel = 0;
    this.activityBuffer = [];
    
    // Try to use real sensors first
    if (this.isAvailable() && !this.useFallbackMode) {
      console.log('📱 Attempting to use real device sensors...');
      
      // Add event listeners
      window.addEventListener('devicemotion', this.handleMotion.bind(this));
      window.addEventListener('deviceorientation', this.handleOrientation.bind(this));
      
      // Check if sensors are actually working after 2 seconds
      setTimeout(() => {
        if (this.stepCount === 0 && this.lastAcceleration === null) {
          console.warn('⚠️ Real sensors not responding - switching to fallback mode');
          this.useFallbackMode = true;
          this.startFallbackMode();
        } else {
          console.log('✅ Real motion sensors working!');
        }
      }, 2000);
    } else {
      console.log('📱 Using fallback mode (simulated motion)');
      this.useFallbackMode = true;
      this.startFallbackMode();
    }
    
    console.log('✅ Motion tracking started');
    return true;
  },
  
  /**
   * Start fallback mode (simulated motion for testing)
   */
  startFallbackMode() {
    console.log('🎮 Fallback mode activated - simulating motion...');
    
    this.fallbackInterval = setInterval(() => {
      if (this.isTracking && this.callback) {
        // Simulate realistic motion patterns
        
        // Steps: increment occasionally (simulate walking/dancing)
        if (Math.random() > 0.4) {
          this.stepCount += Math.floor(Math.random() * 2) + 1;
        }
        
        // Turns: increment rarely (simulate turns/spins)
        if (Math.random() > 0.92) {
          this.turnCount += 1;
        }
        
        // Energy: fluctuate between 50-95
        this.energyLevel = 50 + Math.random() * 45;
        
        // Send data to callback
        this.callback({
          steps: this.stepCount,
          turns: this.turnCount,
          energy: Math.round(this.energyLevel)
        });
      }
    }, 800); // Update every 800ms
  },
  
  /**
   * Handle device motion (accelerometer) - REAL SENSOR
   */
  handleMotion(event) {
    if (!this.isTracking || this.useFallbackMode) return;
    
    const acceleration = event.accelerationIncludingGravity;
    
    if (!acceleration || !acceleration.x) {
      return;
    }
    
    // Calculate magnitude of acceleration
    const magnitude = Math.sqrt(
      acceleration.x ** 2 +
      acceleration.y ** 2 +
      acceleration.z ** 2
    );
    
    // Detect steps
    if (this.lastAcceleration !== null) {
      const delta = Math.abs(magnitude - this.lastAcceleration);
      const now = Date.now();
      
      // Step detected
      if (delta > this.stepThreshold && (now - this.lastStepTime) > 300) {
        this.stepCount++;
        this.lastStepTime = now;
        
        // Update energy level
        this.updateEnergy(delta);
        
        // Call callback
        if (this.callback) {
          this.callback({
            steps: this.stepCount,
            turns: this.turnCount,
            energy: this.energyLevel
          });
        }
      }
    }
    
    this.lastAcceleration = magnitude;
  },
  
  /**
   * Handle device orientation (gyroscope) - REAL SENSOR
   */
  handleOrientation(event) {
    if (!this.isTracking || this.useFallbackMode) return;
    
    // Rotation detection logic here
    // (simplified for now)
  },
  
  /**
   * Update energy level based on movement
   */
  updateEnergy(movementIntensity) {
    // Add to activity buffer
    this.activityBuffer.push(movementIntensity);
    
    // Keep last 20 readings
    if (this.activityBuffer.length > 20) {
      this.activityBuffer.shift();
    }
    
    // Calculate energy as average recent activity
    const avgActivity = this.activityBuffer.reduce((a, b) => a + b, 0) / this.activityBuffer.length;
    
    // Scale to 0-100
    this.energyLevel = Math.min(100, avgActivity * 30);
  },
  
  /**
   * Calibrate sensors
   */
  async calibrate() {
    console.log('🔧 Calibrating motion sensors...');
    
    if (this.useFallbackMode) {
      console.log('⚠️ Calibration skipped (fallback mode)');
      return { x: 0, y: 0, z: 10 };
    }
    
    return new Promise((resolve) => {
      const readings = [];
      
      const calibrationHandler = (event) => {
        const acc = event.accelerationIncludingGravity;
        if (acc && acc.x) {
          readings.push({
            x: acc.x,
            y: acc.y,
            z: acc.z
          });
        }
        
        if (readings.length >= 30) {
          window.removeEventListener('devicemotion', calibrationHandler);
          
          this.calibrationData = {
            x: readings.reduce((sum, r) => sum + r.x, 0) / readings.length,
            y: readings.reduce((sum, r) => sum + r.y, 0) / readings.length,
            z: readings.reduce((sum, r) => sum + r.z, 0) / readings.length
          };
          
          console.log('✅ Calibration complete:', this.calibrationData);
          resolve(this.calibrationData);
        }
      };
      
      window.addEventListener('devicemotion', calibrationHandler);
      
      // Timeout after 3 seconds
      setTimeout(() => {
        window.removeEventListener('devicemotion', calibrationHandler);
        if (readings.length === 0) {
          console.warn('⚠️ Calibration failed - no sensor data');
          resolve({ x: 0, y: 0, z: 10 });
        }
      }, 3000);
    });
  },
  
  /**
   * Stop tracking
   */
  stopTracking() {
    console.log('📱 Stopping motion tracking...');
    
    this.isTracking = false;
    
    // Stop real sensors
    window.removeEventListener('devicemotion', this.handleMotion);
    window.removeEventListener('deviceorientation', this.handleOrientation);
    
    // Stop fallback mode
    if (this.fallbackInterval) {
      clearInterval(this.fallbackInterval);
      this.fallbackInterval = null;
    }
    
    console.log('✅ Motion tracking stopped');
  }
};

// Make globally available
window.MotionModule = MotionModule;

console.log('✅ Motion module loaded (HYBRID VERSION - Real + Fallback)');