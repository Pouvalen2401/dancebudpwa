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
      
      // Wait for video to load
      await new Promise((resolve) => {
        this.video.onloadedmetadata = () => {
          this.video.play();
          resolve();
        };
      });
      
      // Match canvas size to video
      this.canvas.width = this.video.videoWidth;
      this.canvas.height = this.video.videoHeight;
      
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
      await this.initPoseDetector();
    }
    
    this.isDetecting = true;
    console.log('🤖 Starting pose detection...');
    
    const detectPose = async () => {
      if (!this.isDetecting || !this.video || this.video.paused) {
        return;
      }
      
      try {
        // Detect poses
        const poses = await this.detector.estimatePoses(this.video);
        
        if (poses && poses.length > 0) {
          const pose = poses[0];
          
          // Draw skeleton
          this.drawSkeleton(pose);
          
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
    
    // Return average score
    return checks > 0 ? Math.round(score / checks * 100 / 100) : 0;
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

