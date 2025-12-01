/**
 * Camera Module
 * Handles camera feed and pose detection
 */

const CameraModule = {
  stream: null,
  video: null,
  canvas: null,
  ctx: null,
  detector: null,
  isDetecting: false,
  
  /**
   * Check if camera is available
   */
  isAvailable() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error('❌ getUserMedia not supported');
      return false;
    }
    
    if (!window.isSecureContext) {
      console.error('❌ Camera requires HTTPS secure context');
      return false;
    }
    
    return true;
  },
  
  /**
   * Request camera permission
   */
  async requestPermission() {
    console.log('📷 Requesting camera permission...');
    
    if (!this.isAvailable()) {
      throw new Error('Camera not available');
    }
    
    try {
      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user', // Front camera
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      });
      
      // Stop stream immediately (just checking permission)
      stream.getTracks().forEach(track => track.stop());
      
      console.log('✅ Camera permission granted');
      return true;
    } catch (error) {
      console.error('❌ Camera permission denied:', error);
      throw error;
    }
  },
  
  /**
   * Start camera feed
   */
  async startCamera(videoElement, canvasElement) {
    console.log('📷 Starting camera...');
    
    this.video = videoElement;
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');
    
    try {
      // Get camera stream
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 }
        },
        audio: false
      });
      
      // Set video source
      this.video.srcObject = this.stream;

      // Ensure autoplay is allowed by muting video (camera streams don't usually need audio, but some browsers block play)
      try {
        this.video.muted = true;
      } catch (e) {
        // ignore
      }

      // Wait for video metadata then ensure playback has actually started
      await new Promise((resolve) => {
        this.video.onloadedmetadata = () => resolve();
      });

      try {
        // video.play() may return a promise that rejects in some browsers without user gesture
        const playResult = this.video.play();
        if (playResult && playResult.then) {
          await playResult.catch(() => { /* ignore play rejection */ });
        }
      } catch (e) {
        // ignore
      }

      // Match canvas pixel size to video intrinsic size
      this.canvas.width = this.video.videoWidth || this.video.clientWidth || 640;
      this.canvas.height = this.video.videoHeight || this.video.clientHeight || 480;

      // Ensure CSS fills parent so scaling is consistent
      this.canvas.style.width = '100%';
      this.canvas.style.height = '100%';
      
      console.log('✅ Camera started');
      return true;
    } catch (error) {
      console.error('❌ Failed to start camera:', error);
      throw error;
    }
  },
  
  /**
   * Stop camera
   */
  stopCamera() {
    console.log('📷 Stopping camera...');
    
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    
    if (this.video) {
      this.video.srcObject = null;
    }
    
    this.isDetecting = false;
    console.log('✅ Camera stopped');
  },
  
  /**
   * Initialize pose detector
   */
  async initPoseDetector() {
    console.log('🤖 Initializing pose detector...');
    
    try {
      // Check if TensorFlow.js is loaded
      if (typeof poseDetection === 'undefined') {
        throw new Error('TensorFlow.js Pose Detection not loaded');
      }
      // Attendre que tf soit prêt et forcer le backend WebGL si WebGPU non initialisé
      if (typeof tf !== 'undefined' && tf.ready) {
        await tf.ready();
        const backend = tf.getBackend();
        if (backend === 'webgpu') {
          // Si webgpu n'est pas prêt, forcer webgl
          try {
            await tf.setBackend('webgl');
            await tf.ready();
          } catch (e) {
            console.warn('Impossible de forcer le backend webgl:', e);
          }
        }
      }
      // Create detector with MoveNet Lightning (faster model)
      this.detector = await poseDetection.createDetector(
        poseDetection.SupportedModels.MoveNet,
        {
          modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
          enableSmoothing: true,
          minPoseScore: 0.25
        }
      );
      console.log('✅ Pose detector initialized');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize pose detector:', error);
      throw error;
    }
  },
  
  /**
   * Start pose detection loop
   */
  async startPoseDetection(onPoseDetected) {
    if (!this.detector) {
      // try to init detector with a couple of retries in case backend isn't ready yet
      let attempts = 0;
      const maxAttempts = 3;
      while (attempts < maxAttempts && !this.detector) {
        try {
          await this.initPoseDetector();
        } catch (e) {
          attempts++;
          console.warn('Retrying pose detector init...', attempts);
          await new Promise(r => setTimeout(r, 500));
        }
      }
      if (!this.detector) {
        throw new Error('Pose detector could not be initialized');
      }
    }
    
    this.isDetecting = true;
    console.log('🤖 Starting pose detection...');
    
    const detectPose = async () => {
      if (!this.isDetecting || !this.video) {
        requestAnimationFrame(detectPose);
        return;
      }
      if (this.video.paused) {
        // Si la vidéo est en pause, continuer la boucle sans détecter
        requestAnimationFrame(detectPose);
        return;
      }
      
      try {
        // Detect poses
        const poses = await this.detector.estimatePoses(this.video);
        
        if (poses && poses.length > 0) {
          const pose = poses[0];
          
          // Draw skeleton
          this.drawSkeleton(pose);
          // small debug hint
          // console.log('🦴 Drew skeleton with', pose.keypoints.length, 'keypoints');
          
          // Calculate posture score
          const postureScore = this.calculatePostureScore(pose);
          
          // Call callback with pose data
          if (onPoseDetected) {
            onPoseDetected(pose, postureScore);
          }
        }
      } catch (error) {
        console.error('Pose detection error:', error);
      }
      
      // Continue detection loop
      requestAnimationFrame(detectPose);
    };
    
    detectPose();
  },
  
  /**
   * Draw skeleton overlay
   */
  drawSkeleton(pose) {
    if (!this.ctx) return;
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    const keypoints = pose.keypoints;
    const minConfidence = 0.3;
    
    // Draw connections
    const connections = [
      [5, 6],   // shoulders
      [5, 7],   // left arm
      [7, 9],   // left forearm
      [6, 8],   // right arm
      [8, 10],  // right forearm
      [5, 11],  // left torso
      [6, 12],  // right torso
      [11, 12], // hips
      [11, 13], // left thigh
      [13, 15], // left shin
      [12, 14], // right thigh
      [14, 16]  // right shin
    ];
    
    // Set line style
    this.ctx.strokeStyle = '#06b6d4';
    this.ctx.lineWidth = 3;
    this.ctx.shadowBlur = 10;
    this.ctx.shadowColor = '#06b6d4';
    
    // Draw lines
    connections.forEach(([i, j]) => {
      const kp1 = keypoints[i];
      const kp2 = keypoints[j];
      
      if (kp1.score > minConfidence && kp2.score > minConfidence) {
        this.ctx.beginPath();
        this.ctx.moveTo(kp1.x, kp1.y);
        this.ctx.lineTo(kp2.x, kp2.y);
        this.ctx.stroke();
      }
    });
    
    // Draw keypoints
    this.ctx.fillStyle = '#06b6d4';
    this.ctx.shadowBlur = 15;
    
    keypoints.forEach(keypoint => {
      if (keypoint.score > minConfidence) {
        this.ctx.beginPath();
        this.ctx.arc(keypoint.x, keypoint.y, 5, 0, 2 * Math.PI);
        this.ctx.fill();
      }
    });
    
    // Reset shadow
    this.ctx.shadowBlur = 0;
    // restore context state if used
    try { this.ctx.restore && this.ctx.restore(); } catch (e) { }
  },
  
  /**
   * Calculate posture score (0-100)
   */
  calculatePostureScore(pose) {
    const keypoints = pose.keypoints;
    let score = 0;
    let checks = 0;
    
    // Check 1: Shoulders alignment
    const leftShoulder = keypoints[5];
    const rightShoulder = keypoints[6];
    
    if (leftShoulder.score > 0.5 && rightShoulder.score > 0.5) {
      const shoulderDiff = Math.abs(leftShoulder.y - rightShoulder.y);
      const shoulderDistance = Math.abs(leftShoulder.x - rightShoulder.x);
      const shoulderRatio = shoulderDiff / shoulderDistance;
      
      // Good posture if shoulders are level (ratio < 0.2)
      score += (1 - Math.min(shoulderRatio / 0.2, 1)) * 40;
      checks++;
    }
    
    // Check 2: Back straightness
    const leftHip = keypoints[11];
    const rightHip = keypoints[12];
    
    if (leftShoulder.score > 0.5 && leftHip.score > 0.5) {
      const backAngle = Math.abs(leftShoulder.x - leftHip.x) / 
                        Math.abs(leftShoulder.y - leftHip.y);
      
      // Good posture if back is straight (angle < 0.3)
      score += (1 - Math.min(backAngle / 0.3, 1)) * 35;
      checks++;
    }
    
    // Check 3: Hips alignment
    if (leftHip.score > 0.5 && rightHip.score > 0.5) {
      const hipDiff = Math.abs(leftHip.y - rightHip.y);
      const hipDistance = Math.abs(leftHip.x - rightHip.x);
      const hipRatio = hipDiff / hipDistance;
      
      score += (1 - Math.min(hipRatio / 0.2, 1)) * 25;
      checks++;
    }
    
    // Return average score (0-100)
    return checks > 0 ? Math.round(score / checks) : 0;
  },
  
  /**
   * Stop pose detection
   */
  stopPoseDetection() {
    this.isDetecting = false;
    console.log('🤖 Pose detection stopped');
  }
};

// Export for global use
window.CameraModule = CameraModule;

