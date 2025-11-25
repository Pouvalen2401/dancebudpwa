git /**
 * Audio Module
 * Handles microphone and BPM detection
 * Member 2's responsibility
 */

const AudioModule = {
  audioContext: null,
  analyser: null,
  microphone: null,
  dataArray: null,
  isMonitoring: false,
  bpmCallback: null,
  
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
      
      // Start BPM detection loop
      this.isMonitoring = true;
      this.detectBPM();
      
      console.log('✅ Audio monitoring started');
      return true;
    } catch (error) {
      console.error('❌ Failed to start audio monitoring:', error);
      throw error;
    }
  },
  
  /**
   * Detect BPM from audio
   */
  detectBPM() {
    if (!this.isMonitoring) return;
    
    // Get frequency data
    this.analyser.getByteFrequencyData(this.dataArray);
    
    // Calculate average volume in bass frequency range (20-200 Hz)
    const bassRange = this.dataArray.slice(0, 20);
    const avgBass = bassRange.reduce((a, b) => a + b, 0) / bassRange.length;
    
    // Simple beat detection (will be improved)
    // For now, generate a simulated BPM between 100-140
    const simulatedBPM = 120 + Math.sin(Date.now() / 1000) * 20;
    
    // Call callback with BPM
    if (this.bpmCallback) {
      this.bpmCallback(simulatedBPM);
    }
    
    // Continue monitoring
    setTimeout(() => this.detectBPM(), 500);
  },
  
  /**
   * Stop audio monitoring
   */
  stopMonitoring() {
    console.log('🎤 Stopping audio monitoring...');
    
    this.isMonitoring = false;
    
    if (this.microphone) {
      this.microphone.disconnect();
      this.microphone = null;
    }
    
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    
    console.log('✅ Audio monitoring stopped');
  }
};

// Export for global use
window.AudioModule = AudioModule;