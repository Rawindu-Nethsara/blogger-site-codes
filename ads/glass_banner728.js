(function() {
  var container = document.getElementById('ad-container');
  if (!container) return;

  // Clear "Ad loading..." message
  container.innerHTML = '';

  // Create Adsterra main script dynamically
  var adScript = document.createElement('script');
  adScript.type = 'text/javascript';
  adScript.innerHTML = `
    atOptions = {
      'key': '7f8292d63d798b97c503a0b40480244f',
      'format': 'iframe',
      'height': 90,
      'width': 728,
      'params': {}
    };
  `;

  // Create Adsterra invoke.js loader
  var invokeScript = document.createElement('script');
  invokeScript.type = 'text/javascript';
  invokeScript.src = '//www.highperformanceformat.com/7f8292d63d798b97c503a0b40480244f/invoke.js';

  // Inject both into the container
  container.appendChild(adScript);
  container.appendChild(invokeScript);
})();
