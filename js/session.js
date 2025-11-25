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
  start(routineName = 'Freestyle') {
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
    
    console.log('✅ Session started');
  },
  
  /**
   * Pause session
   */
  pause() {
    if (!this.isActive || this.isPaused) return;
    
    console.log('⏸️ Session paused');
    this.isPaused = true;
    this.pausedTime = Date.now();
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
    
    // Reset state
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