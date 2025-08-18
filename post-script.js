



    ////////// banner js code
  //// TRAILER VIDEO
const popup = document.getElementById("trailerPopup");
const frame = document.getElementById("trailerFrame");

function openPopup() {
  popup.style.display = "flex";
}
function closePopup() {
  popup.style.display = "none";
  // Stop video by resetting src
  frame.src = frame.src;
}
popup.onclick = closePopup;
  
  ///////////////// MAIN TITLE ADD
  
  document.addEventListener("DOMContentLoaded", function () {
    const originalTitle = document.querySelector("h1.pTtl.aTtl.sml.itm span");
    const targetTitle = document.querySelector("#customTitle");

    if (originalTitle && targetTitle) {
      targetTitle.textContent = originalTitle.textContent.trim();
    } else {
      console.warn("Title not found:", {
        originalTitleExists: !!originalTitle,
        targetTitleExists: !!targetTitle
      });
    }
  });
  
  //////// SAVE BUTTON ADD
document.addEventListener("DOMContentLoaded", function() {
  document.querySelectorAll(".myListBtn").forEach(function(btn) {
    btn.addEventListener("click", function(e) {
      e.preventDefault();
      const postContainer = btn.closest("article, .post, .entry, .item");
      const label = postContainer ? postContainer.querySelector(".tIc") : null;
      if (label) {
        label.click();
      }
    });
  });
});
  
////////// BANNER SYNOPSYS SHORT FOR (...)
  document.addEventListener("DOMContentLoaded", function () {
    const maxWords = 34;
    document.querySelectorAll("p7").forEach(el => {
      const words = el.textContent.trim().split(/\s+/);
      if (words.length > maxWords) {
        el.textContent = words.slice(0, maxWords).join(" ") + "...";
      }
    });
  });







  ////////////TAABS FOR WATCH AND SUBTITLE
  function showContent(evt, contentId) {
    var i, contents, buttons;

    contents = document.getElementsByClassName("sectionBox");
    for (i = 0; i < contents.length; i++) {
      contents[i].style.display = "none";
    }

    buttons = document.getElementsByClassName("switchBtn");
    for (i = 0; i < buttons.length; i++) {
      buttons[i].className = buttons[i].className.replace(" active", "");
    }

    document.getElementById(contentId).style.display = "block";
    evt.currentTarget.className += " active";
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("defaultOpen").click();
  });




  /////////////  STORY LINE, (SYNOPSYS)
(function () {
  const maxWords = 62; // change limit here
  const container = document.getElementById("story");
  const text = container.innerText.trim();
  const words = text.split(/\s+/);

  if (words.length > maxWords) {
    const visibleText = words.slice(0, maxWords).join(" ");
    const hiddenText = words.slice(maxWords).join(" ");

    container.innerHTML = `
      ${visibleText} <span class="toggle-btn" onclick="showMore(this)">see more</span>
      <span class="hidden-text">${hiddenText} <span class="toggle-btn" onclick="showLess(this)">show less</span></span>
    `;
  }
})();

function showMore(el) {
  const hiddenPart = el.parentNode.querySelector(".hidden-text");
  hiddenPart.style.display = "inline";
  el.style.display = "none"; // hide "see more"
}

function showLess(el) {
  const hiddenPart = el.parentNode;
  const seeMoreBtn = hiddenPart.parentNode.querySelector(".toggle-btn");
  hiddenPart.style.display = "none";
  seeMoreBtn.style.display = "inline"; // show "see more" again
}






      /////////////////SUBTITLE DOWNLOAD
      
     const firebaseConfig = {
            apiKey: "AIzaSyDyFgDuaVUyLMPwYBKkP9IuQ9CEQYJfMzY",
            authDomain: "subtitle-count.firebaseapp.com",
            projectId: "subtitle-count",
            storageBucket: "subtitle-count.firebasestorage.app",
            messagingSenderId: "50460201290",
            appId: "1:50460201290:web:a1d38ed357306e5c64f1b3",
            measurementId: "G-WJHNC1BQ7C"
        };

        // Initialize Firebase with error handling
        try {
            // Check if Firebase is already initialized to avoid duplicate initialization
            if (!firebase.apps.length) {
                firebase.initializeApp(firebaseConfig);
                console.log("Firebase initialized successfully");
            } else {
                console.log("Firebase already initialized");
            }

            const db = firebase.database();

            // Generate a unique page ID from the URL (sanitize for Firebase)
            const pageUrl = window.location.pathname;
            const pageId = pageUrl.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase() || 'default_page';

            // Reference to the counter in Realtime Database (unique per page)
            const counterRef = db.ref(`counters/${pageId}/downloadCounter`);

            // Function to update the counter display
            function updateCounterDisplay(count) {
                const downloadCountElement = document.getElementById('downloadCount');
                if (downloadCountElement) {
                    downloadCountElement.textContent = count || 0;
                } else {
                    console.error("Element with ID 'downloadCount' not found");
                }
            }

            // Initialize counter if it doesn't exist
            counterRef.once('value', (snapshot) => {
                if (!snapshot.exists()) {
                    counterRef.set(0).then(() => {
                        console.log("Counter initialized to 0");
                        updateCounterDisplay(0);
                    }).catch((error) => {
                        console.error("Error initializing counter: ", error);
                    });
                }
            });

            // Listen for real-time updates to the counter
            counterRef.on('value', (snapshot) => {
                const count = snapshot.val();
                updateCounterDisplay(count);
            }, (error) => {
                console.error("Error fetching counter: ", error);
                updateCounterDisplay(0); // Fallback to 0 on error
            });

            // Increment counter on download button click
            const downloadBtn = document.getElementById('downloadBtn');
            if (downloadBtn) {
                downloadBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    counterRef.once('value').then((snapshot) => {
                        const currentCount = snapshot.val() || 0;
                        counterRef.set(currentCount + 1).then(() => {
                            console.log("Counter incremented to: ", currentCount + 1);
                        }).catch((error) => {
                            console.error("Error updating counter: ", error);
                        });
                    }).catch((error) => {
                        console.error("Error reading counter: ", error);
                    });
                });
            } else {
                console.error("Download button with ID 'downloadBtn' not found");
            }
        } catch (error) {
            console.error("Firebase initialization error: ", error);
            updateCounterDisplay(0); // Fallback to 0 on initialization failure
        }

        // Card99 Video Switching
        const videos = document.querySelectorAll('.card99 video');
        let currentVideo = 0;

        function switchVideo() {
            videos[currentVideo].classList.remove('active');
            currentVideo = (currentVideo + 1) % videos.length;
            videos[currentVideo].classList.add('active');
            setTimeout(switchVideo, 5000);
        }

        videos[currentVideo].classList.add('active');
        setTimeout(switchVideo, 5000);

        // Initialize VanillaTilt for Card99
        VanillaTilt.init(document.querySelector('.card99'), {
            max: 15,
            speed: 400,
            glare: true,
            'max-glare': 0.3,
        });
 
   




  //////////////DOWNLOAD TABLE
  document.addEventListener('DOMContentLoaded', () => {
    // === Label1 Boxes (Custom Download Animation) ===
    document.querySelectorAll('.label1').forEach((box) => {
        const text = box.querySelector('.text');
        const loading = box.querySelector('.loading1');
        const percentage = box.querySelector('.percentage');
        const openButton = box.querySelector('.open-button');
        const downloadLink = box.getAttribute('data-link');

        let hasDownloaded = false;
        let loadingStarted = false;

        box.addEventListener('click', () => {
            if (!loadingStarted && !hasDownloaded) {
                startLoading();
            }
        });

        openButton.addEventListener('click', () => {
            if (!hasDownloaded) {
                hasDownloaded = true;
                openButton.style.display = 'none';
                text.innerHTML = '🗸';
                text.style.display = 'block';
                text.style.fontSize = '18px';
                percentage.textContent = '0%';
                triggerDownload(downloadLink);
            }
        });

        function startLoading() {
            loadingStarted = true;
            box.classList.add('active');
            text.style.display = 'none';
            openButton.style.display = 'none';
            loading.style.display = 'block';
            percentage.textContent = '0%';

            let progress = 0;
            const interval = setInterval(() => {
                progress += 1;
                percentage.textContent = `${progress}%`;
                if (progress >= 100) clearInterval(interval);
            }, 30);

            setTimeout(() => {
                loading.style.display = 'none';
                openButton.style.display = 'block';
                box.classList.remove('active');
            }, 3000);
        }

        function triggerDownload(url) {
            window.open(url, '_blank');
        }
    });

    // === Truncate Movie Titles ===
    document.querySelectorAll('td:first-child').forEach(td => {
        const fullTitle = td.getAttribute('data-full-title');
        const maxLength = window.innerWidth <= 480 ? 20 : window.innerWidth <= 768 ? 25 : 30;
        td.textContent = fullTitle.length > maxLength ? fullTitle.substring(0, maxLength) + '...' : fullTitle;
    });

    // === Download Button with Countdown ===
    document.querySelectorAll('.download-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            if (button.classList.contains('downloading') || button.classList.contains('open')) return;

            button.classList.add('downloading');
            const progressText = button.querySelector('.progress-text');
            const downloadLink = button.getAttribute('href');
            let progress = 0;

            const interval = setInterval(() => {
                progress += 2;
                button.style.setProperty('--progress', `${progress}%`);
                progressText.textContent = `${progress}%`;
                if (progress >= 100) {
                    clearInterval(interval);
                    button.classList.remove('downloading');
                    button.classList.add('open');
                    progressText.style.opacity = '0';
                    setTimeout(() => {
                        progressText.style.display = 'none';
                        triggerDownload(downloadLink);
                    }, 300);
                }
            }, 50);

            function triggerDownload(url) {
                window.open(url, '_blank');
            }
        });
    });

    // === Toggle Table Visibility ===
    const toggleButton = document.getElementById("toggleTableBtn");
    toggleButton?.addEventListener("click", () => {
        const tableContainer = document.querySelector('.table-container');
        tableContainer.classList.toggle("hidden");
    });

    // === Scrollable Table (Mobile Optimized) ===
    const scrollContainer = document.getElementById('scrollContainer3');
    if (scrollContainer) {
        scrollContainer.style.overflowX = 'auto';
        scrollContainer.style.scrollBehavior = 'smooth';
        scrollContainer.style.cursor = 'grab';
        scrollContainer.style.webkitOverflowScrolling = 'touch';

        let isDragging = false;
        let startX;
        let scrollLeft;

        // Enable drag scroll only on desktop
        scrollContainer.addEventListener('mousedown', (e) => {
            if (window.innerWidth <= 768) return;
            if (e.button !== 0) return;
            isDragging = true;
            scrollContainer.style.cursor = 'grabbing';
            startX = e.pageX;
            scrollLeft = scrollContainer.scrollLeft;
            e.preventDefault();
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
    }
});




    /////////////////////// IMDb Card Script
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




////////////////////////// RECENT POSTS
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

