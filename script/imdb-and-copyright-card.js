    // Full Script for IMDb Card, Copyright, and Slider
window.addEventListener("DOMContentLoaded", function () {
  
  // ===== IMDb Card Script =====
  const ratingElement = document.querySelector('#rating-value');
  const progressFill = document.querySelector('#progress-fill');
  const ratingLabel = document.querySelector('#rating-label');

  if (ratingElement && progressFill && ratingLabel) {
    const rating = parseFloat(ratingElement.textContent.trim());
    const percentage = (rating / 10) * 100; // Convert rating to percentage
    progressFill.style.width = `${percentage}%`;

    // Update rating label
    let labelText = 'NotBad';
    if (rating >= 9) labelText = 'Perfect';
    else if (rating >= 7) labelText = 'Great';
    else if (rating >= 5) labelText = 'Superb';
    else if (rating >= 3) labelText = 'Better';

    ratingLabel.textContent = labelText;
  }

  // ===== Slider Drag Script =====
  const scrollContainer = document.getElementById('scrollableContainer1');
  if (scrollContainer) {
    let isDragging = false;
    let startX;
    let scrollLeft;

    scrollContainer.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return; // Only left click
      isDragging = true;
      scrollContainer.style.cursor = 'grabbing';
      startX = e.pageX - scrollContainer.offsetLeft;
      scrollLeft = scrollContainer.scrollLeft;
    });

    scrollContainer.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const x = e.pageX - scrollContainer.offsetLeft;
      const walk = x - startX;
      scrollContainer.scrollLeft = scrollLeft - walk;
    });

    scrollContainer.addEventListener('mouseup', () => {
      isDragging = false;
      scrollContainer.style.cursor = 'grab';
    });

    scrollContainer.addEventListener('mouseleave', () => {
      isDragging = false;
      scrollContainer.style.cursor = 'grab';
    });
  }

});
