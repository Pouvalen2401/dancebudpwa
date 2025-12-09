/**
 * PermissionsManager
 * Centralize permission requests for camera, microphone and motion sensors
 */

const PermissionsManager = {
  async requestAll() {
    console.log('🔐 Requesting required permissions...');

    // Camera
    try {
      if (typeof CameraModule !== 'undefined' && CameraModule.requestPermission) {
        await CameraModule.requestPermission();
      }
    } catch (e) {
      console.warn('Camera permission request failed or denied:', e);
    }

    // Microphone
    try {
      if (typeof AudioModule !== 'undefined' && AudioModule.requestPermission) {
        await AudioModule.requestPermission();
      }
    } catch (e) {
      console.warn('Microphone permission request failed or denied:', e);
    }

    // Motion
    try {
      if (typeof MotionModule !== 'undefined' && MotionModule.requestPermission) {
        await MotionModule.requestPermission();
      }
    } catch (e) {
      console.warn('Motion permission request failed or denied:', e);
    }

    console.log('🔐 Permissions request completed');
    return Promise.resolve();
  }
};

window.PermissionsManager = PermissionsManager;
