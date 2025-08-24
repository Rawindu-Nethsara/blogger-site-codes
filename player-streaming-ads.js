import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getDatabase, ref, onValue, set, onDisconnect, increment, update, remove } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyD_t_TMaHO9Ei3oYK8ebzgstiZ_dWLmp9w",
  authDomain: "video-player-count.firebaseapp.com",
  projectId: "video-player-count",
  storageBucket: "video-player-count.firebasestorage.app",
  messagingSenderId: "668890351373",
  appId: "1:668890351373:web:48de5a6ccede3f8fe5d244",
  measurementId: "G-PDP0S0XNYB"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

class ModernVideoPlayer {
  constructor() {
    this.video = document.getElementById('video');
    this.loading = document.getElementById('loading');
    this.centerPlay = document.getElementById('centerPlay');
    this.playPauseBtn = document.getElementById('playPauseBtn');
    this.volumeBtn = document.getElementById('volumeBtn');
    this.fullscreenBtn = document.getElementById('fullscreenBtn');
    this.speedBtn = document.getElementById('speedBtn');
    this.subtitleBtn = document.getElementById('subtitleBtn');
    this.progressTrack = document.getElementById('progressTrack');
    this.progressBars = document.getElementById('progressBars');
    this.topProgress = document.getElementById('topProgress');
    this.timeDisplay = document.getElementById('timeDisplay');
    this.volumeSlider = document.getElementById('volumeSlider');
    this.volumeFill = document.getElementById('volumeFill');
    this.speedMenu = document.getElementById('speedMenu');
    this.subtitleMenu = document.getElementById('subtitleMenu');
    this.seekLeft = document.getElementById('seekLeft');
    this.seekRight = document.getElementById('seekRight');
    this.controlsOverlay = document.querySelector('.controls-overlay');
    this.watchOnlineBtn = document.getElementById('watchOnlineBtn');
    this.watchOnlineText = document.getElementById('watchOnlineText');
    this.videoContainer = document.getElementById('videoContainer');
    this.blurOverlay = document.getElementById('blurOverlay');
    this.closeBtn = document.getElementById('closeBtn');
    this.adContainer = document.getElementById('adContainer');
    this.adVideo = document.getElementById('adVideo');
    this.adCountdown = document.getElementById('adCountdown');
    this.skipAdBtn = document.getElementById('skipAdBtn');
    this.viewerInfo = document.getElementById('viewerInfo');
    this.notification = document.getElementById('custom-notification');
    this.notifyCloseBtn = document.getElementById('notifyCloseBtn');

    this.isDragging = false;
    this.hideControlsTimeout = null;
    this.lastTap = 0;
    this.tapTimeout = null;
    this.adShown = false;
    this.adSrc = 'https://www.w3schools.com/html/mov_bbb.mp4';
    this.mainTime = 0;
    this.countdownInterval = null;
    this.userId = Math.random().toString(36).substr(2, 9);
    this.liveCount = 0;
    this.pageViews = 0;
    this.liveCountSpan = document.getElementById('liveCount');
    this.totalViewsSpan = document.getElementById('totalViews');
    this.pageId = window.location.pathname.split('/').pop() || 'default';
    this.isMobile = window.innerWidth <= 768;
    this.isLandscape = false;

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.video.volume = 0.8;
    this.updateVolumeDisplay();
    this.loading.style.display = 'none';
    this.checkOrientation();
    this.adjustSubtitlePosition();

    // Ensure viewerInfo starts with animation
    this.viewerInfo.classList.add('animate-slideInRight');

    // Initialize subtitles when video metadata is loaded
    this.video.addEventListener('loadedmetadata', () => {
      this.initializeSubtitles();
      this.updateSubtitleMenu();
      this.adjustSubtitlePosition();
    });

    // Create live indicator dot
    this.createLiveIndicator();

    // Listen to all live viewers across all pages
    const viewersRef = ref(db, 'viewers');
    onValue(viewersRef, (snap) => {
      this.liveCount = snap.exists() ? Object.keys(snap.val()).length : 0;
      this.liveCountSpan.textContent = this.liveCount;
    });

    // Listen to page-specific views
    const pageViewsRef = ref(db, `pageViews/${this.pageId}`);
    onValue(pageViewsRef, (snap) => {
      this.pageViews = snap.val() || 0;
      this.totalViewsSpan.textContent = this.pageViews;
    });
  }

  createLiveIndicator() {
    // Create CSS for live indicator dot
    if (!this.liveIndicatorStyle) {
      this.liveIndicatorStyle = document.createElement('style');
      document.head.appendChild(this.liveIndicatorStyle);
    }

    this.liveIndicatorStyle.textContent = `
      .live-indicator-dot {
        display: inline-block;
        width: 8px;
        height: 8px;
        background-color: #ff3333;
        border-radius: 50%;
        margin-right: 3px;
        animation: liveBlink 1.5s ease-in-out infinite;
        box-shadow: 0 0 4px rgba(255, 51, 51, 0.6);
      }

      @keyframes liveBlink {
        0% {
          opacity: 1;
          box-shadow: 0 0 4px rgba(255, 51, 51, 0.6);
        }
        50% {
          opacity: 0.3;
          box-shadow: 0 0 8px rgba(255, 51, 51, 0.8);
        }
        100% {
          opacity: 1;
          box-shadow: 0 0 4px rgba(255, 51, 51, 0.6);
        }
      }

      .stat-item.live-stat {
        display: flex;
        align-items: center;
      }
    `;

    // Add the dot to the live count span
    const liveStatItem = this.liveCountSpan.closest('.stat-item');
    if (liveStatItem) {
      liveStatItem.classList.add('live-stat');
      
      // Create and insert the dot before "Live:"
      const dot = document.createElement('span');
      dot.className = 'live-indicator-dot';
      
      // Insert the dot at the beginning of the stat item
      liveStatItem.insertBefore(dot, liveStatItem.firstChild);
    }
  }

  checkOrientation() {
    this.isMobile = window.innerWidth <= 768;
    this.isLandscape = window.innerHeight < window.innerWidth && window.innerHeight <= 500;
  }

  adjustSubtitlePosition() {
    // Create or update subtitle positioning
    if (!this.subtitleStyle) {
      this.subtitleStyle = document.createElement('style');
      document.head.appendChild(this.subtitleStyle);
    }

    if (this.isMobile && window.innerWidth >= 320 && window.innerWidth <= 768) {
      // Tablet view (320px to 768px), subtitles at bottom
      this.subtitleStyle.textContent = `
        video::cue {
          background: rgba(0, 0, 0, 0.8) !important;
          color: #fff !important;
          font-size: 16px !important;
          font-family: Arial, sans-serif !important;
          padding: 4px 8px !important;
          border-radius: 4px !important;
          line-height: 1.3 !important;
          position: absolute !important;
          bottom: 10px !important;
          top: auto !important;
        }
        
        video::-webkit-media-text-track-display {
          bottom: 10px !important;
          top: auto !important;
        }
        
        video::-webkit-media-text-track-container {
          bottom: 10px !important;
          top: auto !important;
        }
      `;
    } else {
      // Desktop and mobile (< 320px) view, default positioning
      this.subtitleStyle.textContent = `
        video::cue {
          background: rgba(0, 0, 0, 0.7) !important;
          color: #fff !important;
          font-size: 18px !important;
          font-family: Arial, sans-serif !important;
          padding: 2px 6px !important;
          border-radius: 3px !important;
        }
      `;
    }
  }

  initializeSubtitles() {
    const tracks = this.video.textTracks;
    
    // Enable the default track or first available track
    for (let i = 0; i < tracks.length; i++) {
      const track = tracks[i];
      if (track.kind === 'subtitles') {
        // Check if track has default attribute or is the first subtitle track
        const trackElement = this.video.querySelector(`track[srclang="${track.language}"]`);
        if (trackElement && trackElement.hasAttribute('default')) {
          track.mode = 'showing';
        } else if (i === 0 && !this.hasActiveTrack()) {
          track.mode = 'showing';
        } else {
          track.mode = 'disabled';
        }
      }
    }
  }

  hasActiveTrack() {
    const tracks = this.video.textTracks;
    for (let i = 0; i < tracks.length; i++) {
      if (tracks[i].mode === 'showing') {
        return true;
      }
    }
    return false;
  }

  updateSubtitleMenu() {
    // Clear existing menu items except "Off"
    const offButton = this.subtitleMenu.querySelector('[data-lang="off"]');
    this.subtitleMenu.innerHTML = '';
    
    // Re-add "Off" button
    const newOffButton = document.createElement('button');
    newOffButton.className = 'dropdown-item';
    newOffButton.setAttribute('data-lang', 'off');
    newOffButton.textContent = 'Off';
    newOffButton.addEventListener('click', (e) => this.toggleSubtitles(e));
    this.subtitleMenu.appendChild(newOffButton);

    // Add menu items for each available track
    const tracks = this.video.textTracks;
    let hasActiveTrack = false;

    for (let i = 0; i < tracks.length; i++) {
      const track = tracks[i];
      if (track.kind === 'subtitles') {
        const button = document.createElement('button');
        button.className = 'dropdown-item';
        button.setAttribute('data-lang', track.language);
        button.textContent = track.label || this.getLanguageLabel(track.language);
        
        if (track.mode === 'showing') {
          button.classList.add('active');
          hasActiveTrack = true;
        }

        button.addEventListener('click', (e) => this.toggleSubtitles(e));
        this.subtitleMenu.appendChild(button);
      }
    }

    // If no track is active, mark "Off" as active
    if (!hasActiveTrack) {
      newOffButton.classList.add('active');
    }
  }

  getLanguageLabel(langCode) {
    const labels = {
      'si': 'Sinhala',
      'en': 'English',
      'ta': 'Tamil',
      'hi': 'Hindi',
      'ar': 'Arabic',
      'fr': 'French',
      'es': 'Spanish',
      'de': 'German',
    };
    return labels[langCode] || langCode.toUpperCase();
  }

  setupEventListeners() {
    this.video.addEventListener('contextmenu', (e) => e.preventDefault());
    this.videoContainer.addEventListener('contextmenu', (e) => e.preventDefault());

    document.addEventListener('keydown', (e) => {
      if (
        e.ctrlKey &&
        (e.key === 's' || e.key === 'S' || e.key === 'i' || e.key === 'I' || e.key === 'j' || e.key === 'J')
      ) {
        e.preventDefault();
      }
      if (e.key === 'F12') {
        e.preventDefault();
      }
    });

    this.watchOnlineBtn.addEventListener('click', () => this.openPopup());
    this.watchOnlineText.addEventListener('click', () => this.openPopup());
    this.closeBtn.addEventListener('click', () => this.closePopup());
    this.videoContainer.addEventListener('click', (e) => {
      e.stopPropagation();
    });
    this.blurOverlay.addEventListener('click', () => this.closePopup());

    this.video.addEventListener('loadstart', () => {
      this.loading.style.display = 'flex';
    });

    this.video.addEventListener('canplay', () => {
      this.loading.style.display = 'none';
    });

    this.video.addEventListener('timeupdate', () => this.updateProgress());
    this.video.addEventListener('loadedmetadata', () => {
      this.updateTimeDisplay();
      this.initializeSubtitles();
      this.updateSubtitleMenu();
      this.adjustSubtitlePosition();
    });

    this.centerPlay.addEventListener('click', () => this.togglePlayPause());
    this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());

    this.video.addEventListener('touchend', (e) => {
      const currentTime = new Date().getTime();
      const tapLength = currentTime - this.lastTap;
      this.lastTap = currentTime;

      clearTimeout(this.tapTimeout);

      if (tapLength < 300 && tapLength > 0) {
        const rect = this.video.getBoundingClientRect();
        const x = e.changedTouches[0].clientX - rect.left;

        if (x < rect.width / 3) {
          this.video.currentTime = Math.max(0, this.video.currentTime - 10);
          this.showSeekIndicator('left');
        } else if (x > rect.width * 2 / 3) {
          this.video.currentTime = Math.min(this.video.duration, this.video.currentTime + 10);
          this.showSeekIndicator('right');
        } else {
          this.toggleControls();
        }
      } else {
        this.tapTimeout = setTimeout(() => {
          this.togglePlayPause();
        }, 300);
      }
    });

    this.volumeBtn.addEventListener('click', () => this.toggleMute());
    this.volumeSlider.addEventListener('click', (e) => this.setVolume(e));

    this.progressTrack.addEventListener('click', (e) => this.seek(e));
    this.progressTrack.addEventListener('mousedown', () => {
      this.isDragging = true;
    });

    document.addEventListener('mousemove', (e) => {
      if (this.isDragging) this.seek(e);
    });

    document.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    this.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());

    this.speedBtn.addEventListener('click', () => this.toggleMenu(this.speedMenu));
    this.speedMenu.querySelectorAll('.dropdown-item').forEach(item => {
      item.addEventListener('click', (e) => this.changeSpeed(e));
    });

    this.subtitleBtn.addEventListener('click', () => this.toggleMenu(this.subtitleMenu));

    document.addEventListener('click', (e) => {
      if (!this.speedBtn.contains(e.target) && !this.speedMenu.contains(e.target)) {
        this.speedMenu.classList.remove('show');
      }
      if (!this.subtitleBtn.contains(e.target) && !this.subtitleMenu.contains(e.target)) {
        this.subtitleMenu.classList.remove('show');
      }
    });

    // Handle mouse/touch events for showing controls
    if (this.isMobile) {
      let touchStartX = 0;
      let touchStartY = 0;
      this.videoContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      });

      this.videoContainer.addEventListener('touchmove', (e) => {
        const touchX = e.touches[0].clientX;
        const touchY = e.touches[0].clientY;
        const deltaX = Math.abs(touchX - touchStartX);
        const deltaY = Math.abs(touchY - touchStartY);

        // Detect slide gesture (horizontal or vertical)
        if (deltaX > 30 || deltaY > 30) {
          this.showControls();
        }
      });
    } else {
      this.videoContainer.addEventListener('mousemove', () => {
        this.showControls();
      });
      this.videoContainer.addEventListener('mouseenter', () => {
        this.showControls();
      });
    }

    this.video.addEventListener('play', () => {
      this.showControls();
      if (!this.adShown) {
        setTimeout(() => {
          if (!this.video.paused) {
            this.showAd();
          }
        }, 10000);
      }
    });

    this.video.addEventListener('pause', () => {
      this.showControls();
      this.controlsOverlay.style.opacity = '1';
      this.controlsOverlay.style.transform = 'translateY(0)';
      this.closeBtn.style.opacity = '1';
      this.viewerInfo.style.opacity = '1';
      this.viewerInfo.classList.add('animate-slideInRight');
      clearTimeout(this.hideControlsTimeout);
    });

    this.video.addEventListener('ended', () => {
      this.showControls();
      this.controlsOverlay.style.opacity = '1';
      this.controlsOverlay.style.transform = 'translateY(0)';
      this.closeBtn.style.opacity = '1';
      this.viewerInfo.style.opacity = '1';
      this.viewerInfo.classList.add('animate-slideInRight');
      clearTimeout(this.hideControlsTimeout);
    });

    if (window.innerWidth <= 768) {
      this.topProgress.classList.add('visible');
    }

    document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    this.skipAdBtn.addEventListener('click', () => this.skipAd());
    this.adVideo.addEventListener('ended', () => this.skipAd());

    // Orientation change listener for landscape adjustments
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        this.checkOrientation();
        this.adjustControlsForOrientation();
        this.adjustSubtitlePosition();
      }, 100);
    });

    // Resize listener for responsive adjustments
    window.addEventListener('resize', () => {
      this.checkOrientation();
      this.adjustControlsForOrientation();
      this.adjustSubtitlePosition();
    });

    // Fullscreen change listener
    document.addEventListener('fullscreenchange', () => {
      this.adjustControlsForFullscreen();
    });

    // Notification close button
    this.notifyCloseBtn.addEventListener('click', () => {
      this.notification.style.display = 'none';
    });
  }

  adjustControlsForOrientation() {
    if (this.isMobile && this.isLandscape) {
      this.controlsOverlay.style.opacity = '1';
      this.controlsOverlay.style.transform = 'translateY(0)';
      this.controlsOverlay.style.position = 'fixed';
      this.controlsOverlay.style.bottom = '0';
      this.controlsOverlay.style.left = '0';
      this.controlsOverlay.style.right = '0';
      this.controlsOverlay.style.zIndex = '30';
      this.viewerInfo.style.opacity = '1';
      this.closeBtn.style.opacity = '1';
    }
  }

  adjustControlsForFullscreen() {
    if (document.fullscreenElement) {
      this.controlsOverlay.style.opacity = '1';
      this.controlsOverlay.style.transform = 'translateY(0)';
      this.controlsOverlay.style.position = 'fixed';
      this.controlsOverlay.style.bottom = '0';
      this.controlsOverlay.style.left = '0';
      this.controlsOverlay.style.right = '0';
      this.controlsOverlay.style.zIndex = '30';
      this.showControls();
    } else {
      this.controlsOverlay.style.position = 'absolute';
      this.controlsOverlay.style.bottom = '10px';
      this.controlsOverlay.style.left = '10px';
      this.controlsOverlay.style.right = '10px';
      this.showControls();
    }
  }

  showAd() {
    this.adShown = true;
    this.mainTime = this.video.currentTime;
    this.video.pause();
    this.adVideo.src = this.adSrc;
    this.adVideo.play();
    this.adContainer.style.display = 'block';
    this.controlsOverlay.style.display = 'none';
    this.viewerInfo.style.display = 'none';

    this.countdown = 10;
    this.adCountdown.textContent = `Skip in ${this.countdown}s`;
    this.adCountdown.style.display = 'block';
    this.skipAdBtn.style.display = 'none';

    this.countdownInterval = setInterval(() => {
      this.countdown--;
      if (this.countdown > 0) {
        this.adCountdown.textContent = `Skip in ${this.countdown}s`;
      } else {
        clearInterval(this.countdownInterval);
        this.adCountdown.style.display = 'none';
        this.skipAdBtn.style.display = 'block';
      }
    }, 1000);
  }

  skipAd() {
    clearInterval(this.countdownInterval);
    this.adContainer.style.display = 'none';
    this.controlsOverlay.style.display = '';
    this.viewerInfo.style.display = '';
    this.video.currentTime = this.mainTime;
    this.video.play();
    this.adVideo.pause();
    this.adVideo.src = '';
    this.showControls();
  }

  openPopup() {
    this.checkOrientation();
    this.videoContainer.classList.add('active');
    this.blurOverlay.classList.add('active');
    this.video.play();
    this.centerPlay.classList.add('hidden');
    this.playPauseBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
    this.showControls();
    this.adjustSubtitlePosition();

    // Show notification
    this.notification.style.display = 'flex';
    setTimeout(() => {
      this.notification.style.display = 'none';
    }, 7000);

    const presenceRef = ref(db, 'viewers/' + this.userId);
    set(presenceRef, {
      timestamp: Date.now(),
      userAgent: navigator.userAgent
    });
    onDisconnect(presenceRef).remove();

    // Increment page-specific views
    const pageViewsRef = ref(db, `pageViews/${this.pageId}`);
    update(ref(db), { [`pageViews/${this.pageId}`]: increment(1) });
  }

  closePopup() {
    const presenceRef = ref(db, 'viewers/' + this.userId);
    remove(presenceRef);

    this.videoContainer.classList.remove('active');
    this.blurOverlay.classList.remove('active');
    this.video.pause();
    this.centerPlay.classList.remove('hidden');
    this.playPauseBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
    this.controlsOverlay.style.opacity = '1';
    this.controlsOverlay.style.transform = 'translateY(0)';
    this.closeBtn.style.opacity = '1';
    this.viewerInfo.style.opacity = '1';
    this.viewerInfo.classList.add('animate-slideInRight');
    clearTimeout(this.hideControlsTimeout);

    // Hide notification when closing popup
    this.notification.style.display = 'none';
  }

  showControls() {
    clearTimeout(this.hideControlsTimeout);
    this.controlsOverlay.style.opacity = '1';
    this.controlsOverlay.style.transform = 'translateY(0)';
    this.closeBtn.style.opacity = '1';
    this.viewerInfo.style.opacity = '1';
    this.viewerInfo.classList.add('animate-slideInRight');
    
    // Hide controls after 5 seconds when playing, for both mobile and PC
    if (this.videoContainer.classList.contains('active') && !this.video.paused && !this.adContainer.style.display.includes('block')) {
      this.hideControlsTimeout = setTimeout(() => {
        this.controlsOverlay.style.opacity = '0';
        this.controlsOverlay.style.transform = 'translateY(20px)';
        this.closeBtn.style.opacity = '0';
        this.viewerInfo.style.opacity = '0';
        this.viewerInfo.classList.remove('animate-slideInRight');
      }, 5000);
    }
  }

  toggleControls() {
    if (this.controlsOverlay.style.opacity === '1') {
      this.controlsOverlay.style.opacity = '0';
      this.controlsOverlay.style.transform = 'translateY(20px)';
      this.closeBtn.style.opacity = '0';
      this.viewerInfo.style.opacity = '0';
      this.viewerInfo.classList.remove('animate-slideInRight');
      clearTimeout(this.hideControlsTimeout);
    } else {
      this.showControls();
    }
  }

  togglePlayPause() {
    if (this.video.paused) {
      this.video.play();
      this.centerPlay.classList.add('hidden');
      this.playPauseBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
    } else {
      this.video.pause();
      this.centerPlay.classList.remove('hidden');
      this.playPauseBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
    }
    this.showControls();
  }

  toggleMute() {
    this.video.muted = !this.video.muted;
    this.updateVolumeDisplay();
  }

  updateVolumeDisplay() {
    const volume = this.video.muted ? 0 : this.video.volume;
    this.volumeFill.style.width = `${volume * 100}%`;

    if (this.video.muted || volume === 0) {
      this.volumeBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.77 3l2.83-2.83-1.41-1.41L15.36 10.6l-2.83-2.83-1.41 1.41L13.95 12l-2.83 2.83 1.41 1.41 2.83-2.83 2.83 2.83 1.41-1.41L16.77 12z"/></svg>';
    } else {
      this.volumeBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0014 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>';
    }
  }

  setVolume(e) {
    const rect = this.volumeSlider.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    this.video.volume = percent;
    this.video.muted = false;
    this.updateVolumeDisplay();
  }

  updateProgress() {
    if (!this.isDragging && this.video.duration) {
      const percent = (this.video.currentTime / this.video.duration) * 100;
      this.progressBars.style.width = `${percent}%`;
      this.topProgress.querySelector('.progress').style.width = `${percent}%`;
      this.updateTimeDisplay();
    }
  }

  seek(e) {
    if (this.video.duration) {
      const rect = this.progressTrack.getBoundingClientRect();
      const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      this.video.currentTime = percent * this.video.duration;
      this.progressBars.style.width = `${percent * 100}%`;
      this.topProgress.querySelector('.progress').style.width = `${percent * 100}%`;
    }
  }

  updateTimeDisplay() {
    const current = this.formatTime(this.video.currentTime || 0);
    const duration = this.formatTime(this.video.duration || 0);
    this.timeDisplay.textContent = `${current} / ${duration}`;
  }

  formatTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return h > 0 ? `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}` : `${m}:${s.toString().padStart(2, '0')}`;
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      this.videoContainer.requestFullscreen();
      this.fullscreenBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/></svg>';
      this.showControls();
    } else {
      document.exitFullscreen();
      this.fullscreenBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>';
      this.controlsOverlay.style.opacity = '1';
      this.controlsOverlay.style.transform = 'translateY(0)';
      this.closeBtn.style.opacity = '1';
      this.viewerInfo.style.opacity = '1';
      this.viewerInfo.classList.add('animate-slideInRight');
      clearTimeout(this.hideControlsTimeout);
    }
    this.adjustControlsForFullscreen();
  }

  toggleMenu(menu) {
    menu.classList.toggle('show');
  }

  changeSpeed(e) {
    const speed = parseFloat(e.target.dataset.speed);
    this.video.playbackRate = speed;
    this.speedMenu.querySelectorAll('.dropdown-item').forEach(item => {
      item.classList.remove('active');
    });
    e.target.classList.add('active');
    this.speedMenu.classList.remove('show');
  }

  toggleSubtitles(e) {
    const lang = e.target.dataset.lang;
    const tracks = this.video.textTracks;

    for (let i = 0; i < tracks.length; i++) {
      const track = tracks[i];
      if (lang === 'off') {
        track.mode = 'disabled';
      } else if (track.language === lang) {
        track.mode = 'showing';
      } else {
        track.mode = 'disabled';
      }
    }

    this.subtitleMenu.querySelectorAll('.dropdown-item').forEach(item => {
      item.classList.remove('active');
    });
    e.target.classList.add('active');
    this.subtitleMenu.classList.remove('show');
  }

  showSeekIndicator(side) {
    const indicator = side === 'left' ? this.seekLeft : this.seekRight;
    indicator.classList.add('show');
    setTimeout(() => {
      indicator.classList.remove('show');
    }, 1000);
  }

  handleKeyboard(e) {
    if (e.target.tagName !== 'INPUT') {
      switch (e.code) {
        case 'Space':
          e.preventDefault();
          this.togglePlayPause();
          break;
        case 'KeyM':
          this.toggleMute();
          break;
        case 'KeyF':
          this.toggleFullscreen();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          this.video.currentTime = Math.max(0, this.video.currentTime - 10);
          this.showSeekIndicator('left');
          break;
        case 'ArrowRight':
          e.preventDefault();
          this.video.currentTime = Math.min(this.video.duration, this.video.currentTime + 10);
          this.showSeekIndicator('right');
          break;
        case 'ArrowUp':
          e.preventDefault();
          this.video.volume = Math.min(1, this.video.volume + 0.1);
          this.updateVolumeDisplay();
          break;
        case 'ArrowDown':
          e.preventDefault();
          this.video.volume = Math.max(0, this.video.volume - 0.1);
          this.updateVolumeDisplay();
          break;
        case 'Escape':
          if (document.fullscreenElement) {
            this.toggleFullscreen();
          } else {
            this.closePopup();
          }
          break;
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new ModernVideoPlayer();
});
