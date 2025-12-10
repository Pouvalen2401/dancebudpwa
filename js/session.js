/**
 * Session Module
 * Manages practice session state and data
 * Member 3's responsibility
 */

const Session = {
  isActive: false,
  isPaused: false,
  startTime: null,
  pausedTime: 0,
  timerInterval: null,
  // callbacks provided by screens
  onTick: null,
  onPosture: null,
  onBPM: null,
  onMotion: null,
  
  data: {
    routineName: null,
    duration: 0,
    steps: 0,
    turns: 0,
    energy: 0,
    postureReadings: [],
    bpmReadings: [],
    timestamps: []
  },
  
  /**
   * Start a new session
   */
  async start(routineName = 'Freestyle') {
    console.log('🎬 Starting session:', routineName);

    this.isActive = true;
    this.isPaused = false;
    this.startTime = Date.now();
    this.pausedTime = 0;

    // Reset data
    this.data = {
      routineName: routineName,
      duration: 0,
      steps: 0,
      turns: 0,
      energy: 0,
      postureReadings: [],
      bpmReadings: [],
      timestamps: []
    };

    // Start timer tick
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.timerInterval = setInterval(() => {
      if (!this.isPaused) {
        this.data.duration = Math.floor((Date.now() - this.startTime) / 1000);
        if (this.onTick) this.onTick(this.getFormattedTime(), this.data.duration);
      }
    }, 1000);

    // Start sensors if available and callbacks set
    // Return after sensors attempt to start so callers can await ready state
    try {
      // Request permissions in one flow if PermissionsManager exists
      if (typeof PermissionsManager !== 'undefined' && PermissionsManager.requestAll) {
        await PermissionsManager.requestAll();
      }

      if (typeof CameraModule !== 'undefined' && this.onPosture) {
        await CameraModule.startPoseDetection((pose, score) => {
          this.data.postureReadings.push(score);
          if (this.onPosture) this.onPosture(score);
        });
      }

      if (typeof AudioModule !== 'undefined' && this.onBPM) {
        await AudioModule.startMonitoring((bpm) => {
          this.data.bpmReadings.push(bpm);
          if (this.onBPM) this.onBPM(bpm);
        });
      }

      if (typeof MotionModule !== 'undefined' && this.onMotion) {
        await MotionModule.startTracking((data) => {
          if (data.steps !== undefined) this.data.steps = data.steps;
          if (data.turns !== undefined) this.data.turns = data.turns;
          if (data.energy !== undefined) this.data.energy = data.energy;
          if (this.onMotion) this.onMotion(data);
        });
      }
    } catch (e) {
      console.warn('Session: one or more sensors failed to start:', e);
    }

    // Start background music for the routine if available
    try {
      const vol = (window.AppConfig && window.AppConfig.MUSIC_VOLUME) || 0.8;
      if (typeof MusicPlayer !== 'undefined') {
        // If the user has loaded a local file (uploaded), do not override it.
        if (MusicPlayer.loadedObjectUrl) {
          // Ensure the loaded file continues playing if already playing; otherwise leave control to user
          if (MusicPlayer.isPlaying) {
            // already playing user's track — keep it
          } else {
            // Do not auto-play the user's file here (respect user gesture/autoplay rules)
          }
        } else if (!MusicPlayer.isPlaying) {
          // Try to play by routine name (resolved via AppConfig.AUDIO_MAP inside MusicPlayer)
          MusicPlayer.play(this.data.routineName, { loop: true, volume: vol }).catch(err => {
            // If autoplay blocked, keep silent and user can unmute later
            console.warn('MusicPlayer.play error (likely autoplay blocked):', err);
          });
        }
      }
    } catch (e) {
      console.warn('Session: MusicPlayer start error:', e);
    }

    console.log('✅ Session started');
    return Promise.resolve();
  },
  
  /**
   * Pause session
   */
  pause() {
    if (!this.isActive || this.isPaused) return;

    console.log('⏸️ Session paused');
    this.isPaused = true;
    this.pausedTime = Date.now();

    // stop sensors
    try { if (typeof CameraModule !== 'undefined') CameraModule.stopPoseDetection(); } catch (e) { console.warn(e); }
    try { if (typeof AudioModule !== 'undefined') AudioModule.stopMonitoring(); } catch (e) { console.warn(e); }
    try { if (typeof MotionModule !== 'undefined') MotionModule.stopTracking(); } catch (e) { console.warn(e); }

    // stop timer ticks
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    // Pause music
    try { if (typeof MusicPlayer !== 'undefined') MusicPlayer.pause(); } catch (e) {}
  },
  
  /**
   * Resume session
   */
  resume() {
    if (!this.isActive || !this.isPaused) return;

    console.log('▶️ Session resumed');

    // Adjust start time to account for paused duration
    const pauseDuration = Date.now() - this.pausedTime;
    this.startTime += pauseDuration;

    this.isPaused = false;
    this.pausedTime = 0;

    // restart timer
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.timerInterval = setInterval(() => {
      if (!this.isPaused) {
        this.data.duration = Math.floor((Date.now() - this.startTime) / 1000);
        if (this.onTick) this.onTick(this.getFormattedTime(), this.data.duration);
      }
    }, 1000);

    // restart sensors using stored callbacks
    (async () => {
      try { if (typeof CameraModule !== 'undefined' && this.onPosture) await CameraModule.startPoseDetection((pose, score) => { this.data.postureReadings.push(score); if (this.onPosture) this.onPosture(score); }); } catch (e) { console.warn('Session resume camera:', e); }
      try { if (typeof AudioModule !== 'undefined' && this.onBPM) await AudioModule.startMonitoring((bpm) => { this.data.bpmReadings.push(bpm); if (this.onBPM) this.onBPM(bpm); }); } catch (e) { console.warn('Session resume audio:', e); }
      try { if (typeof MotionModule !== 'undefined' && this.onMotion) await MotionModule.startTracking((data) => { if (data.steps !== undefined) this.data.steps = data.steps; if (data.turns !== undefined) this.data.turns = data.turns; if (data.energy !== undefined) this.data.energy = data.energy; if (this.onMotion) this.onMotion(data); }); } catch (e) { console.warn('Session resume motion:', e); }
    })();
    // Resume music if available
    try {
      const vol = (window.AppConfig && window.AppConfig.MUSIC_VOLUME) || 0.8;
      if (typeof MusicPlayer !== 'undefined') {
        // Do not override a user's uploaded track on resume
        if (MusicPlayer.loadedObjectUrl) {
          // If user's file was playing before pause, try to resume it
          if (!MusicPlayer.isPlaying) {
            try { MusicPlayer.playLoaded({ loop: true, volume: vol }).catch(() => {}); } catch(e) {}
          }
        } else if (!MusicPlayer.isPlaying) {
          MusicPlayer.play(this.data.routineName, { loop: true, volume: vol }).catch(() => {});
        }
      }
    } catch (e) {
      console.warn('Session: MusicPlayer resume error:', e);
    }
  },
  
  /**
   * Update session data
   */
  update(dataType, value) {
    if (!this.isActive || this.isPaused) return;
    
    switch(dataType) {
      case 'posture':
        this.data.postureReadings.push(value);
        break;
      case 'bpm':
        this.data.bpmReadings.push(value);
        break;
      case 'steps':
        this.data.steps = value;
        break;
      case 'turns':
        this.data.turns = value;
        break;
      case 'energy':
        this.data.energy = value;
        break;
    }
    
    // Update duration
    if (!this.isPaused) {
      this.data.duration = Math.floor((Date.now() - this.startTime) / 1000);
      if (this.onTick) this.onTick(this.getFormattedTime(), this.data.duration);
    }
  },
  
  /**
   * Get current session duration
   */
  getDuration() {
    if (!this.isActive) return 0;
    
    if (this.isPaused) {
      return Math.floor((this.pausedTime - this.startTime) / 1000);
    }
    
    return Math.floor((Date.now() - this.startTime) / 1000);
  },
  
  /**
   * Calculate session summary
   */
  getSummary() {
    const avgPosture = this.data.postureReadings.length > 0
      ? this.data.postureReadings.reduce((a, b) => a + b) / this.data.postureReadings.length
      : 0;
    
    const avgBPM = this.data.bpmReadings.length > 0
      ? this.data.bpmReadings.reduce((a, b) => a + b) / this.data.bpmReadings.length
      : 0;
    
    return {
      routineName: this.data.routineName,
      date: new Date().toISOString(),
      duration: this.formatDuration(this.data.duration),
      durationSeconds: this.data.duration,
      score: Math.round(avgPosture),
      avgBPM: Math.round(avgBPM),
      steps: this.data.steps,
      turns: this.data.turns,
      energy: Math.round(this.data.energy),
      postureReadings: this.data.postureReadings,
      bpmReadings: this.data.bpmReadings
    };
  },
  
  /**
   * End session and save
   */
  async end() {
    if (!this.isActive) return null;
    
    console.log('🏁 Ending session...');
    
    // Get summary
    const summary = this.getSummary();
    
    // Save to database
    try {
      await Database.saveSession(summary);
      console.log('✅ Session saved to database');
    } catch (error) {
      console.error('❌ Failed to save session:', error);
    }
    
    // stop timers and sensors
    try { if (this.timerInterval) { clearInterval(this.timerInterval); this.timerInterval = null; } } catch (e) {}
    try { if (typeof CameraModule !== 'undefined') CameraModule.stopPoseDetection(); } catch (e) {}
    try { if (typeof AudioModule !== 'undefined') AudioModule.stopMonitoring(); } catch (e) {}
    try { if (typeof MotionModule !== 'undefined') MotionModule.stopTracking(); } catch (e) {}
    try { if (typeof MusicPlayer !== 'undefined') MusicPlayer.stop(); } catch (e) {}

    this.isActive = false;
    this.isPaused = false;
    this.startTime = null;
    
    return summary;
  },
  
  /**
   * Format duration as MM:SS
   */
  formatDuration(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  },
  
  /**
   * Get formatted time for display
   */
  getFormattedTime() {
    return this.formatDuration(this.getDuration());
  }
};

// Export for global use
window.Session = Session;