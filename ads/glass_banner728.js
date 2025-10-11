(function() {
  var container = document.getElementById('ad-container');
  if (!container) return;

  // Clean container
  container.innerHTML = '';

  // Create Adsterra iframe manually
  var iframe = document.createElement('iframe');
  iframe.src = 'https://www.highperformanceformat.com/7f8292d63d798b97c503a0b40480244f/invoke.html';
  iframe.width = '728';
  iframe.height = '90';
  iframe.frameBorder = '0';
  iframe.scrolling = 'no';
  iframe.style.border = 'none';
  iframe.style.overflow = 'hidden';
  iframe.style.width = '728px';
  iframe.style.height = '90px';
  iframe.setAttribute('allow', 'autoplay; fullscreen');

  container.appendChild(iframe);
})();
