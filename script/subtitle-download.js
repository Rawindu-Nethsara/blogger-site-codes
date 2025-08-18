     

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
 
