// ads.js - Ad Configuration for Video Player
// Host this at: https://rawindu-nethsara.github.io/blogger-site-codes/ads.js

window.VIDEO_ADS_CONFIG = {
  // Add as many ad URLs as you want
  urls: [
    "https://res.cloudinary.com/dyqw58yqs/video/upload/v1751187957/132140-752588954_small_o41b7g.mp4",
    "https://res.cloudinary.com/dyqw58yqs/video/upload/v1751187957/132140-752588954_small_o41b7g.mp4",
    "https://res.cloudinary.com/dyqw58yqs/video/upload/v1751187957/132140-752588954_small_o41b7g.mp4"
    // Add more ad URLs here as needed
  ],
  
  // Main ad times in seconds (when ads MUST show)
  // Example: [300, 2280, 3540, 6840] = 5min, 38min, 59min, 1h54min
  mainTimes: [300, 2280, 3540, 6840],
  
  // Seconds before "Skip Ad" button appears
  skipDelay: 10,
  
  // Minimum seconds between ads
  extraAdCooldown: 120,
  
  // Minimum seek distance to trigger extra ad
  seekThreshold: 5,
  
  // Probability (0-1) of showing extra ad on seek
  extraAdChance: 0.5
};
