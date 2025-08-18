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
 
