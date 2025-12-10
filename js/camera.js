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
            console.error('Camera requires HTTPS or localhost');
            return false;
        }
        
        return true;
    },
    
    /**
     * Request camera permission
     */
    async requestPermission() {
        console.log('Requesting camera permission...');
        
        if (!this.isAvailable()) {
            throw new Error('Camera not available on this device');
        }
        
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'user',
                    width: { ideal: 640 },
                    height: { ideal: 480 }
                }
            });
            
            stream.getTracks().forEach(track => track.stop());
            
            console.log('Camera permission granted');
            return true;
            
        } catch (error) {
            console.error('Camera permission denied:', error);
            
            if (error.name === 'NotAllowedError') {
                alert('Camera access denied. Please allow camera access in browser settings.');
            } else if (error.name === 'NotFoundError') {
                alert('No camera found on this device.');
            } else {
                alert('Camera error: ' + error.message);
            }
            
            throw error;
        }
    },
    
    /**
     * Start camera feed
     */
    async startCamera(videoElement, canvasElement) {
        console.log('Starting camera...');
        
        this.video = videoElement;
        this.canvas = canvasElement;
        this.ctx = canvasElement.getContext('2d');
        
        try {
            this.stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'user',
                    width: { ideal: 640 },
                    height: { ideal: 480 }
                },
                audio: false
            });
            
            this.video.srcObject = this.stream;
            
            await new Promise((resolve) => {
                this.video.onloadedmetadata = () => {
                    this.video.play();
                    resolve();
                };
            });
            
            this.canvas.width = this.video.videoWidth;
            this.canvas.height = this.video.videoHeight;
            
            console.log('Camera started successfully');
            console.log('Video dimensions:', this.video.videoWidth, 'x', this.video.videoHeight);
            
            return true;
            
        } catch (error) {
            console.error('Failed to start camera:', error);
            throw error;
        }
    },
    
    /**
     * Stop camera
     */
    stopCamera() {
        console.log('Stopping camera...');
        
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
        
        if (this.video) {
            this.video.srcObject = null;
        }
        
        this.isDetecting = false;
        
        console.log('Camera stopped');
    },
    
    /**
     * Initialize pose detector with TensorFlow.js MoveNet
     */
    async initPoseDetector() {
        console.log('Initializing pose detector...');
        
        try {
            if (typeof poseDetection === 'undefined') {
                throw new Error('TensorFlow.js Pose Detection library not loaded. Make sure you included the script tags.');
            }
            
            this.detector = await poseDetection.createDetector(
                poseDetection.SupportedModels.MoveNet,
                {
                    modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
                    enableSmoothing: true,
                    minPoseScore: 0.25
                }
            );
            
            console.log('Pose detector initialized successfully');
            return true;
            
        } catch (error) {
            console.error('Failed to initialize pose detector:', error);
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
        console.log('Starting pose detection loop...');
        
        const detectPose = async () => {
            if (!this.isDetecting || !this.video || this.video.paused) {
                return;
            }
            
            try {
                const poses = await this.detector.estimatePoses(this.video);
                
                if (poses && poses.length > 0) {
                    const pose = poses[0];
                    
                    this.drawSkeleton(pose);
                    
                    const postureScore = this.calculatePostureScore(pose);
                    
                    if (onPoseDetected) {
                        onPoseDetected(pose, postureScore);
                    }
                }
                
            } catch (error) {
                console.error('Pose detection error:', error);
            }
            
            requestAnimationFrame(detectPose);
        };
        
        detectPose();
    },
    
    /**
     * Draw skeleton overlay on canvas
     */
    drawSkeleton(pose) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const keypoints = pose.keypoints;
        const minConfidence = 0.3;
        
        const connections = [
            [5, 6],   // shoulders
            [5, 7],   // left upper arm
            [7, 9],   // left lower arm
            [6, 8],   // right upper arm
            [8, 10],  // right lower arm
            [5, 11],  // left torso
            [6, 12],  // right torso
            [11, 12], // hips
            [11, 13], // left upper leg
            [13, 15], // left lower leg
            [12, 14], // right upper leg
            [14, 16]  // right lower leg
        ];
        
        this.ctx.strokeStyle = '#06b6d4';
        this.ctx.lineWidth = 3;
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = '#06b6d4';
        
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
        
        this.ctx.fillStyle = '#06b6d4';
        this.ctx.shadowBlur = 15;
        
        keypoints.forEach(keypoint => {
            if (keypoint.score > minConfidence) {
                this.ctx.beginPath();
                this.ctx.arc(keypoint.x, keypoint.y, 5, 0, 2 * Math.PI);
                this.ctx.fill();
            }
        });
        
        this.ctx.shadowBlur = 0;
    },
    
    /**
     * Calculate posture score (0-100)
     */
    calculatePostureScore(pose) {
        const keypoints = pose.keypoints;
        let totalScore = 0;
        let checks = 0;
        
        const leftShoulder = keypoints[5];
        const rightShoulder = keypoints[6];
        const leftHip = keypoints[11];
        const rightHip = keypoints[12];
        
        // Check 1: Shoulders alignment (40 points)
        if (leftShoulder.score > 0.5 && rightShoulder.score > 0.5) {
            const shoulderDiff = Math.abs(leftShoulder.y - rightShoulder.y);
            const shoulderDistance = Math.abs(leftShoulder.x - rightShoulder.x);
            
            if (shoulderDistance > 0) {
                const shoulderRatio = shoulderDiff / shoulderDistance;
                const shoulderScore = Math.max(0, 1 - (shoulderRatio / 0.2));
                totalScore += shoulderScore * 40;
                checks++;
            }
        }
        
        // Check 2: Back straightness (35 points)
        if (leftShoulder.score > 0.5 && leftHip.score > 0.5) {
            const backAngleX = Math.abs(leftShoulder.x - leftHip.x);
            const backAngleY = Math.abs(leftShoulder.y - leftHip.y);
            
            if (backAngleY > 0) {
                const backRatio = backAngleX / backAngleY;
                const backScore = Math.max(0, 1 - (backRatio / 0.3));
                totalScore += backScore * 35;
                checks++;
            }
        }
        
        // Check 3: Hips alignment (25 points)
        if (leftHip.score > 0.5 && rightHip.score > 0.5) {
            const hipDiff = Math.abs(leftHip.y - rightHip.y);
            const hipDistance = Math.abs(leftHip.x - rightHip.x);
            
            if (hipDistance > 0) {
                const hipRatio = hipDiff / hipDistance;
                const hipScore = Math.max(0, 1 - (hipRatio / 0.2));
                totalScore += hipScore * 25;
                checks++;
            }
        }
        
        return checks > 0 ? Math.round(totalScore / checks) : 0;
    },
    
    /**
     * Stop pose detection
     */
    stopPoseDetection() {
        this.isDetecting = false;
        console.log('Pose detection stopped');
        
        if (this.ctx && this.canvas) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    },
    
    /**
     * Get permission status
     */
    getPermissionStatus() {
        return this.stream ? 'granted' : 'prompt';
    }
};

window.CameraModule = CameraModule;
console.log('Camera module loaded');