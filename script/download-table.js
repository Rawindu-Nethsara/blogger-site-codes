
  ///////DOWNLOAD TABLE
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
