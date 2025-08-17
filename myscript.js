    <script>
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
    this.progressFill = document.getElementById('progressFill');
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

    this.isDragging = false;
    this.hideControlsTimeout = null;
    this.lastTap = 0;
    this.tapTimeout = null;
    this.adShown = false;
    this.adSrc = 'https://www.w3schools.com/html/mov_bbb.mp4'; // Add your .mp4 ad link here
    this.mainTime = 0;
    this.countdownInterval = null;

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.video.volume = 0.8;
    this.updateVolumeDisplay();
    this.loading.style.display = 'none';
    this.setVideoSource();
  }

  setVideoSource() {
    const videoSource = 'your-video-source.mp4';
    const source = document.createElement('source');
    source.src = videoSource;
    source.type = 'video/mp4';
    this.video.appendChild(source);
    this.video.load();
  }

  setupEventListeners() {
    // Disable right-click context menu
    this.video.addEventListener('contextmenu', (e) => e.preventDefault());
    this.videoContainer.addEventListener('contextmenu', (e) => e.preventDefault());

    // Disable common keyboard shortcuts
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

    // Watch Online button and text
    this.watchOnlineBtn.addEventListener('click', () => this.openPopup());
    this.watchOnlineText.addEventListener('click', () => this.openPopup());

    // Close button
    this.closeBtn.addEventListener('click', () => this.closePopup());

    // Prevent closing when clicking video or controls
    this.videoContainer.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    // Close on blur overlay click
    this.blurOverlay.addEventListener('click', () => this.closePopup());

    // Video events
    this.video.addEventListener('loadstart', () => {
      this.loading.style.display = 'flex';
    });

    this.video.addEventListener('canplay', () => {
      this.loading.style.display = 'none';
    });

    this.video.addEventListener('timeupdate', () => this.updateProgress());
    this.video.addEventListener('loadedmetadata', () => this.updateTimeDisplay());

    // Play/pause
    this.centerPlay.addEventListener('click', () => this.togglePlayPause());
    this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());

    // Touch events for double tap seek and play/pause
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
        }
      } else {
        this.tapTimeout = setTimeout(() => {
          this.togglePlayPause();
        }, 300);
      }
    });

    // Volume
    this.volumeBtn.addEventListener('click', () => this.toggleMute());
    this.volumeSlider.addEventListener('click', (e) => this.setVolume(e));

    // Progress
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

    // Fullscreen
    this.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());

    // Speed menu
    this.speedBtn.addEventListener('click', () => this.toggleMenu(this.speedMenu));
    this.speedMenu.querySelectorAll('.dropdown-item').forEach(item => {
      item.addEventListener('click', (e) => this.changeSpeed(e));
    });

    // Subtitle menu
    this.subtitleBtn.addEventListener('click', () => this.toggleMenu(this.subtitleMenu));
    this.subtitleMenu.querySelectorAll('.dropdown-item').forEach(item => {
      item.addEventListener('click', (e) => this.toggleSubtitles(e));
    });

    // Hide menus on outside click
    document.addEventListener('click', (e) => {
      if (!this.speedBtn.contains(e.target) && !this.speedMenu.contains(e.target)) {
        this.speedMenu.classList.remove('show');
      }
      if (!this.subtitleBtn.contains(e.target) && !this.subtitleMenu.contains(e.target)) {
        this.subtitleMenu.classList.remove('show');
      }
    });

    // Show/hide controls and close button on mouse move
    this.videoContainer.addEventListener('mousemove', () => {
      this.showControls();
    });

    // Show controls on video play
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

    // Mobile progress bar
    if (window.innerWidth <= 768) {
      this.topProgress.classList.add('visible');
    }

    // Keyboard controls
    document.addEventListener('keydown', (e) => this.handleKeyboard(e));

    // Skip ad button
    this.skipAdBtn.addEventListener('click', () => this.skipAd());

    // Ad ended
    this.adVideo.addEventListener('ended', () => this.skipAd());
  }

  showAd() {
    this.adShown = true;
    this.mainTime = this.video.currentTime;
    this.video.pause();
    this.adVideo.src = this.adSrc;
    this.adVideo.play();
    this.adContainer.style.display = 'block';
    this.controlsOverlay.style.display = 'none';

    // 10s countdown for skip button
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
    this.video.currentTime = this.mainTime;
    this.video.play();
    this.adVideo.pause();
    this.adVideo.src = '';
    this.showControls();
  }

  openPopup() {
    this.videoContainer.classList.add('active');
    this.blurOverlay.classList.add('active');
    this.video.play();
    this.centerPlay.classList.add('hidden');
    this.playPauseBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
    this.showControls();
  }

  closePopup() {
    this.videoContainer.classList.remove('active');
    this.blurOverlay.classList.remove('active');
    this.video.pause();
    this.centerPlay.classList.remove('hidden');
    this.playPauseBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
    this.controlsOverlay.style.opacity = '1';
    this.controlsOverlay.style.transform = 'translateY(0)';
    this.closeBtn.style.opacity = '1';
    clearTimeout(this.hideControlsTimeout);
  }

  showControls() {
    clearTimeout(this.hideControlsTimeout);
    this.controlsOverlay.style.opacity = '1';
    this.controlsOverlay.style.transform = 'translateY(0)';
    this.closeBtn.style.opacity = '1';
    if (this.videoContainer.classList.contains('active') && !this.video.paused) {
      this.hideControlsTimeout = setTimeout(() => {
        this.controlsOverlay.style.opacity = '0';
        this.controlsOverlay.style.transform = 'translateY(20px)';
        this.closeBtn.style.opacity = '0';
      }, 5000);
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
      this.progressFill.style.width = `${percent}%`;
      this.topProgress.querySelector('.progress').style.width = `${percent}%`;
      this.updateTimeDisplay();
    }
  }

  seek(e) {
    if (this.video.duration) {
      const rect = this.progressTrack.getBoundingClientRect();
      const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      this.video.currentTime = percent * this.video.duration;
      this.progressFill.style.width = `${percent * 100}%`;
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
      this.video.parentElement.parentElement.requestFullscreen();
      this.fullscreenBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/></svg>';
      this.showControls();
    } else {
      document.exitFullscreen();
      this.fullscreenBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>';
      this.controlsOverlay.style.opacity = '1';
      this.controlsOverlay.style.transform = 'translateY(0)';
      this.closeBtn.style.opacity = '1';
      clearTimeout(this.hideControlsTimeout);
    }
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

    for (let track of tracks) {
      track.mode = lang === 'off' ? 'disabled' : 'showing';
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
          this.closePopup();
          break;
      }
    }
  }
}

// Initialize player when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ModernVideoPlayer();
});
    </script>