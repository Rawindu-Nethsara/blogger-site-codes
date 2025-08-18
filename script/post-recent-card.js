
// RECENT POSTS
function loadRecentPosts(containerId) {
  const blogUrl = window.location.origin + "/";
  const feedUrl = `${blogUrl}feeds/posts/summary?alt=json&max-results=20`;

  document.getElementById(containerId).innerHTML = "<div class='loading'>Loading posts...</div>";

  fetch(feedUrl)
    .then(response => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    })
    .then(data => {
      const entries = (data.feed.entry || []).filter(entry => {
        const categories = entry.category || [];
        return !categories.some(cat => cat.term.toLowerCase() === "tv series");
      }).slice(0, 10);

      let html = "";

      if (entries.length === 0) {
        html = "<div class='note wr'>No recent posts found.</div>";
      }

      entries.forEach(entry => {
        const title = entry.title?.$t || "No Title";
        const link = entry.link.find(l => l.rel === "alternate")?.href || "#";
        const thumb = entry.media$thumbnail?.url.replace("/s72-c/", "/s320/") || "https://placehold.co/150x200?text=No+Image";

        let imdbRating = null;
        const categories = entry.category || [];
        const qualityTags = [];
        const genreLabels = [];

        categories.forEach(cat => {
          const term = cat.term.toLowerCase();
          if (term.startsWith("imdb-")) imdbRating = term.replace("imdb-", "");

          if (["bluray", "hd", "fhd", "hdrip", "web-dl"].includes(term)) {
            qualityTags.push(`<span class="${term}">${term.toUpperCase()}</span>`);
          }

          if (["thriller", "romance", "action", "drama", "fantasy", "horror", "western film", "comedy", "animation", "others"].includes(term)) {
            genreLabels.push(term.charAt(0).toUpperCase() + term.slice(1));
          }
        });

        const ratingHtml = imdbRating
          ? `<div class="rating"><span class="star-icon"></span>${imdbRating}</div>` : "";

        const new2Html = (imdbRating && parseFloat(imdbRating) >= 6.5)
          ? `<div class="new2"><span></span></div>` : "";

        const publishedDate = new Date(entry.published.$t);
        const now = new Date();
        const diffInDays = Math.floor((now - publishedDate) / (1000 * 60 * 60 * 24));
        let ageLabelHtml = "";

        if (diffInDays < 1) {
          ageLabelHtml = `<div class="best-of-day"><div class="span2">BEST OF DAY</div></div>`;
        } else if (diffInDays < 7) {
          ageLabelHtml = `<div class="best-of-week"><div class="span2">BEST OF WEEK</div></div>`;
        } else {
          ageLabelHtml = `<div class="moovied"><div class="span2">MOOVIED</div></div>`;
        }

        html += `
          <div class="card-wrapper">
            <a class="card" href="${link}" title="${title}">
              <div class="bg1"></div>
              <div class="blob-wrapper"><div class="blob"></div></div>
              ${new2Html}
              <div class="thumb">
                <img src="${thumb}" alt="${title}" loading="lazy">
              </div>
              ${ageLabelHtml}
              <div class="text7">
                <div class="card4-details">
                  ${qualityTags.join("")}
                  <div class="header-genres"><span>${genreLabels.join("/") || "Others"}</span></div>
                  <button6 class="button6"></button6>
                </div>
              </div>
              <div class="card5__content">
                <div class="box">
                  <div class="btn-shine">MOOVIED</div>
                  <div class="icon4-background"></div>
                  ${ratingHtml}
                </div>
              </div>
            </a>
            <div class="movie-title">${title}</div>
          </div>`;
      });

      const container = document.getElementById(containerId);
      container.innerHTML = html;

      const images = container.querySelectorAll("img");
      images.forEach(img => {
        img.addEventListener("error", () => {
          img.src = "https://placehold.co/150x200?text=Image+Failed";
        });
      });

      const spans = document.querySelectorAll(`#${containerId} .new2 span`);
      spans.forEach(span => {
        const shine = document.createElement('div');
        shine.className = 'badge-shine';
        span.appendChild(shine);
      });

      // Ensure cards are visible by forcing a reflow
      container.style.display = 'none';
      container.offsetHeight; // Trigger reflow
      container.style.display = 'flex';
    })
    .catch(error => {
      console.error("Error fetching posts:", error);
      document.getElementById(containerId).innerHTML = "<div class='note wr'>Failed to load posts :(</div>";
    });
}

function enableDragScroll(slider) {
  let isDown = false;
  let startX, scrollLeft;
  let touchStartY;
  let lastTouchY;
  let isDragging = false;

  const preventDefault = (e) => {
    if (isDragging) {
      e.preventDefault();
    }
  };

  slider.addEventListener("mousedown", (e) => {
    if (e.button !== 0) return;
    isDown = true;
    isDragging = true;
    slider.classList.add("dragging");
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
  });

  slider.addEventListener("mouseleave", () => {
    isDown = false;
    isDragging = false;
    slider.classList.remove("dragging");
  });

  slider.addEventListener("mouseup", () => {
    isDown = false;
    isDragging = false;
    slider.classList.remove("dragging");
  });

  slider.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 2;
    slider.scrollLeft = scrollLeft - walk;
  });

  slider.addEventListener("touchstart", (e) => {
    isDown = true;
    startX = e.touches[0].pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
    touchStartY = e.touches[0].pageY;
    lastTouchY = touchStartY;
  });

  slider.addEventListener("touchmove", (e) => {
    if (!isDown) return;
    const x = e.touches[0].pageX - slider.offsetLeft;
    const walk = (x - startX) * 2;
    const currentTouchY = e.touches[0].pageY;
    const deltaY = Math.abs(currentTouchY - touchStartY);
    const deltaX = Math.abs(x - startX);

    if (deltaX > deltaY && deltaX > 10) {
      isDragging = true;
      e.preventDefault();
      slider.scrollLeft = scrollLeft - walk;
    } else if (deltaY > deltaX && deltaY > 10) {
      isDragging = false;
    }
    lastTouchY = currentTouchY;
  });

  slider.addEventListener("touchend", () => {
    isDown = false;
    isDragging = false;
  });

  slider.addEventListener("touchcancel", () => {
    isDown = false;
    isDragging = false;
  });

  document.addEventListener("touchmove", preventDefault, { passive: false });
}

function setupArrowControls(titleDiv, sliderDiv) {
  const leftBtn = document.createElement("button");
  leftBtn.innerHTML = "<";
  leftBtn.className = "arrow left-arrow";

  const rightBtn = document.createElement("button");
  rightBtn.innerHTML = ">";
  rightBtn.className = "arrow right-arrow";

  leftBtn.onclick = () => sliderDiv.scrollBy({ left: -300, behavior: "smooth" });
  rightBtn.onclick = () => sliderDiv.scrollBy({ left: 300, behavior: "smooth" });

  // Create a container for arrows to align them next to the h3 title
  const arrowContainer = document.createElement("div");
  arrowContainer.className = "arrow-container";
  arrowContainer.style.display = "inline-flex";
  arrowContainer.style.alignItems = "center";
  arrowContainer.style.marginLeft = "10px";
  arrowContainer.appendChild(leftBtn);
  arrowContainer.appendChild(rightBtn);

  // Append the arrow container to the titleDiv, after the h3
  const h3 = titleDiv.querySelector("h3.title");
  h3.insertAdjacentElement("afterend", arrowContainer);
}

document.addEventListener("DOMContentLoaded", function () {
  const section = document.getElementById("recent-posts-slider");

  const titleDiv = document.createElement("div");
  titleDiv.className = "title-wrap main-title";
  titleDiv.innerHTML = `<h3 class="title" style="font-weight: bold;font-size: 16px;font-family: math;margin: 0px;top: 15px;margin-left: 25px;" id="recent-posts">Recent Posts</h3><hr style="border: none;height: 1px;background-color: #70707059;width: 100%;margin: 20px;">`;

  const sliderDiv = document.createElement("div");
  sliderDiv.className = "slider";
  sliderDiv.id = "recent-slider";

  section.innerHTML = "";
  section.appendChild(titleDiv);
  section.appendChild(sliderDiv);

  setupArrowControls(titleDiv, sliderDiv);
  enableDragScroll(sliderDiv);
  loadRecentPosts("recent-slider");
});
