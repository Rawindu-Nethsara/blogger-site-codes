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
