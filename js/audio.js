/**
 * Audio Module
 * Handles microphone and BPM detection
 * Member 2's responsibility
 */

const AudioModule = {
  audioContext: null,
  analyser: null,
  microphone: null,
  stream: null,
  dataArray: null,
  isMonitoring: false,
  bpmCallback: null,
  bpmTimer: null,
  
  /**
   * Check if microphone is available
   */
  isAvailable() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error('❌ getUserMedia not supported');
      return false;
    }
    
    if (!window.isSecureContext) {
      console.error('❌ Microphone requires HTTPS secure context');
      return false;
    }
    
    return true;
  },
  
  /**
   * Request microphone permission
   */
  async requestPermission() {
    console.log('🎤 Requesting microphone permission...');
    
    if (!this.isAvailable()) {
      throw new Error('Microphone not available');
    }
    
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      // Stop stream immediately (just checking permission)
      stream.getTracks().forEach(track => track.stop());
      
      console.log('✅ Microphone permission granted');
      return true;
    } catch (error) {
      console.error('❌ Microphone permission denied:', error);
      throw error;
    }
  },
  
  /**
   * Start audio monitoring for BPM detection
   */
  async startMonitoring(onBPMDetected) {
    console.log('🎤 Starting audio monitoring...');
    
    this.bpmCallback = onBPMDetected;
    
    try {
      // Create audio context
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Get microphone stream
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false, // Better for music detection
          noiseSuppression: false,
          autoGainControl: false
        }
      });

      // Store the stream so we can stop tracks later
      this.stream = stream;
      
      // Create analyser
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 2048;
      this.analyser.smoothingTimeConstant = 0.8;
      
      // Connect microphone to analyser
      this.microphone = this.audioContext.createMediaStreamSource(stream);
      this.microphone.connect(this.analyser);
      
      // Create data array for frequency data
      const bufferLength = this.analyser.frequencyBinCount;
      this.dataArray = new Uint8Array(bufferLength);
      
        // Start BPM detection loop (use interval so it's easy to cancel)
        this.isMonitoring = true;
        if (this.bpmTimer) {
          clearInterval(this.bpmTimer);
          this.bpmTimer = null;
        }
        this.bpmTimer = setInterval(() => this.detectBPM(), 500);
        
        console.log('✅ Audio monitoring started');
      } catch (error) {
        console.error('❌ Error starting audio monitoring:', error);
        this.isMonitoring = false;
        throw error;
      }
    },
  
    /**
     * Detect BPM from audio stream
     */
    detectBPM() {
      if (!this.isMonitoring) return;
  
      try {
        // Get frequency data
        this.analyser.getByteFrequencyData(this.dataArray);
  
        // Calculate average volume in bass frequency range (20-200 Hz)
        const bassRange = Array.from(this.dataArray).slice(0, 20);
        const avgBass = bassRange.reduce((a, b) => a + b, 0) / Math.max(1, bassRange.length);
  
        // Simple beat detection (will be improved)
        // For now, generate a simulated BPM between 100-140 using audio energy as slight modifier
        const energyModifier = (avgBass / 255) * 20; // 0..20
        const simulatedBPM = 110 + energyModifier + Math.sin(Date.now() / 1000) * 10;
  
        // Call callback with BPM
        if (this.bpmCallback) {
          this.bpmCallback(simulatedBPM);
        }
      } catch (e) {
        console.warn('detectBPM error:', e);
      }
  },
  
  /**
   * Stop audio monitoring
   */
  stopMonitoring() {
    console.log('🎤 Stopping audio monitoring...');
    
    // Mark as stopped so detectBPM returns early
    this.isMonitoring = false;
    
    // Clear scheduled BPM interval
    try {
      if (this.bpmTimer) {
        clearInterval(this.bpmTimer);
        this.bpmTimer = null;
      }
    } catch (e) {
      console.warn('Could not clear bpmTimer:', e);
    }

    // Disconnect analyser / microphone node
    try {
      if (this.microphone) {
        try { this.microphone.disconnect(); } catch (e) { /* ignore */ }
        this.microphone = null;
      }
    } catch (e) {
      console.warn('Error disconnecting microphone node:', e);
    }

    // Stop and release tracks from the original MediaStream
    try {
      if (this.stream) {
        try { this.stream.getTracks().forEach(t => t.stop()); } catch (e) { /* ignore */ }
        this.stream = null;
      }
    } catch (e) {
      console.warn('Error stopping media stream tracks:', e);
    }

    // Close audio context
    try {
      if (this.audioContext) {
        // close() returns a promise but we don't need to await here
        this.audioContext.close().catch(() => {});
        this.audioContext = null;
      }
    } catch (e) {
      console.warn('Error closing audio context:', e);
      this.audioContext = null;
    }

    console.log('✅ Audio monitoring stopped');
  }
};

// Export for global use
window.AudioModule = AudioModule;