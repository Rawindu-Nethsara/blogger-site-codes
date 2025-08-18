    // IMDb Card Script
    window.addEventListener("DOMContentLoaded", function () {
      // Update progress bar based on rating value
      const ratingElement = document.querySelector('#rating-value');
      const progressFill = document.querySelector('#progress-fill');
      const ratingLabel = document.querySelector('#rating-label');

      if (ratingElement && progressFill && ratingLabel) {
        const rating = parseFloat(ratingElement.textContent.trim());
        const percentage = (rating / 10) * 100; // Convert rating to percentage (e.g., 5.7/10 = 57%)
        progressFill.style.width = `${percentage}%`;

        // Update rating label based on rating value
        let labelText = 'NotBad';
        if (rating >= 9) {
          labelText = 'Perfect';
        } else if (rating >= 7) {
          labelText = 'Great';
        } else if (rating >= 5) {
          labelText = 'Superb';
        } else if (rating >= 3) {
          labelText = 'Better';
        }
        ratingLabel.textContent = labelText;
      }

      // Copyright Card Script
      const newName = "Marvel Studio";
      const currentYear = new Date().getFullYear();
      const contentDiv = document.querySelector('.content11');
      contentDiv.innerHTML = contentDiv.innerHTML
        .replace(/#name/g, newName)
        .replace(/2025/g, currentYear);

      // Slider Script
      const scrollContainer = document.getElementById('scrollableContainer1');
      let isDragging = false;
      let startX;
      let scrollLeft;

      scrollContainer.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return;
        isDragging = true;
        scrollContainer.style.cursor = 'grabbing';
        startX = e.pageX;
        scrollLeft = scrollContainer.scrollLeft;
      });

      scrollContainer.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const x = e.pageX;
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
    });
