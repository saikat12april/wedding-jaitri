document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle functionality (existing code, no changes needed here)
    const toggle = document.getElementById('menuToggle');
    const navLinks = document.querySelector('.nav-links');
    const socialIcons = document.querySelector('.social-icons');
    const headerLoadingBar = document.getElementById('header-loading-bar');

    if (toggle && navLinks) {
        toggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            if (socialIcons) {
                socialIcons.classList.toggle('active');
            }
            if (headerLoadingBar) {
                headerLoadingBar.classList.remove('active', 'done');
                if (window.loadingBarTimeout) {
                    clearTimeout(window.loadingBarTimeout);
                    window.loadingBarTimeout = null;
                }
            }
        });
    }

    // Function to handle link clicks and loading bar (existing code, no changes needed here)
    function handleNavLinkClick(e) {
        const clickedLink = e.target.closest('a');

        if (clickedLink) {
            e.preventDefault();

            if (headerLoadingBar) {
                headerLoadingBar.classList.remove('done');
                headerLoadingBar.classList.add('active');

                if (window.loadingBarTimeout) {
                    clearTimeout(window.loadingBarTimeout);
                }

                window.loadingBarTimeout = setTimeout(() => {
                    headerLoadingBar.classList.remove('active');
                    headerLoadingBar.classList.add('done');
                    window.location.href = clickedLink.href;
                    window.loadingBarTimeout = null;
                }, 3000);
            } else {
                window.location.href = clickedLink.href;
            }

            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                if (socialIcons) {
                    socialIcons.classList.remove('active');
                }
            }
        }
    }

    if (navLinks) {
        navLinks.addEventListener('click', handleNavLinkClick);
    }

    // Scroll Animation (existing code, no changes needed here)
    const containers = document.querySelectorAll('.image-container');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.15 });

    containers.forEach(container => observer.observe(container));

    // Modal Functionality (MODIFIED)
    const modal = document.getElementById('modal');
    const modalImg = document.getElementById('modalImg');
    const images = Array.from(document.querySelectorAll('.image-container img'));
    let currentIndex = 0;

    // Open modal on image click
    document.querySelectorAll('.image-container').forEach((container, index) => {
        container.addEventListener('click', () => {
            currentIndex = index;
            modal.style.display = 'flex';
            modalImg.src = images[currentIndex].src;
            document.body.classList.add('no-scroll'); // Prevent scrolling of body
        });
    });

    // Close modal
    document.querySelector('.close-button').addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.classList.remove('no-scroll'); // Re-enable scrolling of body
    });

    // Navigation via arrows
    const leftArrow = document.querySelector('.left-arrow');
    const rightArrow = document.querySelector('.right-arrow');

    if (leftArrow) {
        leftArrow.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            modalImg.src = images[currentIndex].src;
        });
    }

    if (rightArrow) {
        rightArrow.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % images.length;
            modalImg.src = images[currentIndex].src;
        });
    }

    // Keyboard navigation (existing code, no changes needed here)
    document.addEventListener('keydown', (e) => {
        if (modal.style.display === 'flex') {
            if (e.key === 'Escape') {
                modal.style.display = 'none';
                document.body.classList.remove('no-scroll'); // Re-enable scrolling of body
            }
            if (e.key === 'ArrowLeft') {
                if (leftArrow) leftArrow.click(); // Trigger click for consistency
            }
            if (e.key === 'ArrowRight') {
                if (rightArrow) rightArrow.click(); // Trigger click for consistency
            }
        }
    });

    // Close modal when clicking outside the image
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.classList.remove('no-scroll'); // Re-enable scrolling of body
        }
    });

    // --- Swipe Functionality for Modal (NEW) ---
    // Variables to track touch start and end coordinates
    let touchStartX = 0;
    let touchEndX = 0;
    // Minimum distance in pixels for a swipe to be recognized
    const minSwipeDistance = 50;

    // Event listener for when a touch starts on the modal image
    modalImg.addEventListener('touchstart', (e) => {
        // Record the X-coordinate of the first touch point
        touchStartX = e.touches[0].clientX;
    }, { passive: true }); // Use passive: true for better scroll performance, as we won't call preventDefault()

    // Event listener for when a touch moves across the modal image
    modalImg.addEventListener('touchmove', (e) => {
        // Update the X-coordinate of the current touch point
        touchEndX = e.touches[0].clientX;
    }, { passive: true }); // Use passive: true for better scroll performance

    // Event listener for when a touch ends on the modal image
    modalImg.addEventListener('touchend', () => {
        // Calculate the horizontal distance of the swipe
        const swipeDistance = touchStartX - touchEndX;

        // Check if the swipe distance is greater than the minimum required distance
        if (Math.abs(swipeDistance) > minSwipeDistance) {
            if (swipeDistance > 0) {
                // If swipeDistance is positive, it means the swipe was from right to left (swiped left),
                // so navigate to the next image.
                currentIndex = (currentIndex + 1) % images.length;
            } else {
                // If swipeDistance is negative, it means the swipe was from left to right (swiped right),
                // so navigate to the previous image.
                currentIndex = (currentIndex - 1 + images.length) % images.length;
            }
            // Update the modal image source to the new current image
            modalImg.src = images[currentIndex].src;
        }
        // Reset touch coordinates for the next swipe
        touchStartX = 0;
        touchEndX = 0;
    });

    // Helper to prevent body scroll when modal is open
    // The 'no-scroll' class is toggled when the modal opens/closes
});

// Prevent context menu (right-click) from appearing
document.addEventListener('contextmenu', function (event) {
    event.preventDefault();
});
