/**
 * MusicPlayer
 * Lightweight audio helper for background tracks.
 * Exposed as `window.MusicPlayer`.
 */

const MusicPlayer = {
  audio: null,
  currentSrc: null,
  loadedObjectUrl: null,
  isPlaying: false,
  volume: 0.85,

  _ensureAudio() {
    if (!this.audio) {
      this.audio = new Audio();
      this.audio.preload = 'auto';
      this.audio.crossOrigin = 'anonymous';
      this.audio.addEventListener('ended', () => {
        this.isPlaying = false;
      });
    }
  },

  

  // Resolve key through AppConfig.AUDIO_MAP if available. Returns string or array.
  _resolveSrc(keyOrUrl) {
    if (!keyOrUrl) return null;
    try {
      const key = (typeof keyOrUrl === 'string') ? keyOrUrl.toLowerCase() : null;
      if (key && window.AppConfig && window.AppConfig.AUDIO_MAP) {
        const mapVal = window.AppConfig.AUDIO_MAP[key];
        if (mapVal) return mapVal; // could be array or string
      }
    } catch (e) { /* ignore */ }
    return keyOrUrl; // assume direct URL or array provided
  },

  // Get track list for a genre key (returns array)
  getTracksForKey(key) {
    try {
      const mapVal = this._resolveSrc(key);
      if (!mapVal) return [];
      if (Array.isArray(mapVal)) return mapVal.slice();
      return [mapVal];
    } catch (e) { return []; }
  },

  /**
   * Play a key (genre) or direct URL. If the resolved value is an array, play the
   * specified index (options.index) or the first track by default.
   */
  async play(keyOrUrl, { loop = true, volume = null, index = 0 } = {}) {
    this._ensureAudio();
    const resolved = this._resolveSrc(keyOrUrl);

    // If a loaded local file exists and no url/key passed, play that
    if (!resolved && this.loadedObjectUrl) {
      this.audio.src = this.loadedObjectUrl;
      this.currentSrc = this.loadedObjectUrl;
    } else if (Array.isArray(resolved)) {
      const idx = Math.max(0, Math.min(resolved.length - 1, index || 0));
      const chosen = resolved[idx];
      if (!chosen) return Promise.reject(new Error('No track found for index'));
      if (this.loadedObjectUrl && this.loadedObjectUrl !== chosen) {
        try { URL.revokeObjectURL(this.loadedObjectUrl); } catch (e) {}
        this.loadedObjectUrl = null;
      }
      this.audio.src = chosen;
      this.currentSrc = chosen;
    } else {
      const src = resolved || keyOrUrl;
      if (!src) return Promise.reject(new Error('No audio source provided'));
      if (this.loadedObjectUrl && this.loadedObjectUrl !== src) {
        try { URL.revokeObjectURL(this.loadedObjectUrl); } catch (e) {}
        this.loadedObjectUrl = null;
      }
      this.audio.src = src;
      this.currentSrc = src;
    }

    this.audio.loop = !!loop;
    if (volume !== null) this.volume = volume;
    this.audio.volume = Math.max(0, Math.min(1, this.volume));

    try {
      const p = this.audio.play();
      if (p && p.then) {
        await p;
      }
      this.isPlaying = true;
      return true;
    } catch (err) {
      console.warn('MusicPlayer.play blocked or failed:', err);
      this.isPlaying = false;
      return Promise.reject(err);
    }
  },

  pause() {
    if (!this.audio) return;
    try {
      this.audio.pause();
    } catch (e) {}
    this.isPlaying = false;
  },

  stop() {
    if (!this.audio) return;
    try {
      this.audio.pause();
      this.audio.currentTime = 0;
    } catch (e) {}
    this.isPlaying = false;
  },

  preload(keyOrUrl) {
    const resolved = this._resolveSrc(keyOrUrl);
    this._ensureAudio();
    const url = Array.isArray(resolved) ? resolved[0] : resolved;
    if (url) {
      if (this.currentSrc !== url) {
        this.audio.src = url;
        this.currentSrc = url;
      }
    }
    // best-effort; browsers may ignore preload until user gesture
    return Promise.resolve();
  },

  setVolume(v) {
    this.volume = Math.max(0, Math.min(1, v));
    if (this.audio) this.audio.volume = this.volume;
  },

  // Load a File object selected by the user (file input). Returns object URL.
  loadFile(file) {
    if (!file) return null;
    try {
      const url = URL.createObjectURL(file);
      // revoke previous loaded url if exists
      if (this.loadedObjectUrl && this.loadedObjectUrl !== url) {
        try { URL.revokeObjectURL(this.loadedObjectUrl); } catch (e) {}
      }
      this.loadedObjectUrl = url;
      this.currentSrc = url;
      this._ensureAudio();
      this.audio.src = url;
      return url;
    } catch (e) {
      console.warn('MusicPlayer.loadFile failed:', e);
      return null;
    }
  },

  // Convenience: play the currently loaded file (if any)
  async playLoaded(options = { loop: true, volume: null }) {
    if (!this.loadedObjectUrl) return Promise.reject(new Error('No loaded file'));
    return this.play(this.loadedObjectUrl, options);
  },
    /**
   * Stop playback, revoke loaded object URL and clear state
   */
  async unload() {
    try {
      if (this.audio) {
        this.audio.pause();
        this.audio.src = '';
      }
      if (this.loadedObjectUrl) {
        try { URL.revokeObjectURL(this.loadedObjectUrl); } catch (e) {}
        this.loadedObjectUrl = null;
      }
      this.currentSrc = null;
      this.isPlaying = false;
      return true;
    } catch (e) {
      console.warn('MusicPlayer.unload failed:', e);
      return false;
    }
  },

}

// Convenience: play a specific track index for a genre key
MusicPlayer.playTrack = function(key, index, options = {}) {
  return this.play(key, Object.assign({ index }, options));
};

window.MusicPlayer = MusicPlayer;
