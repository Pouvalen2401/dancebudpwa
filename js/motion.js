/**
 * Motion Module
 * Handles accelerometer and gyroscope for step and turn detection
 * Member 2's responsibility
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
  turnThreshold: 150, // degrees per second
  lastTurnTime: 0,
  
  // Energy calculation
  energyLevel: 0,
  activityBuffer: [],
  
  // Calibration
  calibrationData: null,
  
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
      throw new Error('Motion sensors not available');
    }
    
    // iOS 13+ requires permission
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
      try {
        const response = await DeviceMotionEvent.requestPermission();
        
        if (response === 'granted') {
          console.log('✅ Motion permission granted');
          return true;
        } else {
          throw new Error('Motion permission denied');
        }
      } catch (error) {
        console.error('❌ Motion permission error:', error);
        throw error;
      }
    } else {
      // Non-iOS or older iOS - no permission needed
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
    
    // Add event listeners
    window.addEventListener('devicemotion', this.handleMotion.bind(this));
    window.addEventListener('deviceorientation', this.handleOrientation.bind(this));
    
    console.log('✅ Motion tracking started');
    return true;
  },
  
  /**
   * Handle device motion (accelerometer)
   */
  handleMotion(event) {
    if (!this.isTracking) return;
    
    const acceleration = event.accelerationIncludingGravity;
    
    if (!acceleration || !acceleration.x) {
      return; // No data
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
      
      // Step detected if:
      // 1. Acceleration change exceeds threshold
      // 2. At least 300ms since last step (max 200 steps/min)
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
   * Handle device orientation (gyroscope)
   */
  handleOrientation(event) {
    if (!this.isTracking) return;
    
    // Note: DeviceOrientationEvent doesn't give rotation rate on all devices
    // We use DeviceMotionEvent.rotationRate instead
    // This is just for reference
  },
  
  /**
   * Update energy level based on movement
   */
  updateEnergy(movementIntensity) {
    // Add to activity buffer
    this.activityBuffer.push(movementIntensity);
    
    // Keep last 20 readings (about 10 seconds at 2 readings/sec)
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
        
        // Collect 30 readings (about 1 second)
        if (readings.length >= 30) {
          window.removeEventListener('devicemotion', calibrationHandler);
          
          // Calculate baseline
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
    });
  },
  
  /**
   * Stop tracking
   */
  stopTracking() {
    console.log('📱 Stopping motion tracking...');
    
    this.isTracking = false;
    
    window.removeEventListener('devicemotion', this.handleMotion);
    window.removeEventListener('deviceorientation', this.handleOrientation);
    
    console.log('✅ Motion tracking stopped');
  }
};

// Export
window.MotionModule = MotionModule;