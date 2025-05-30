document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle functionality
    const toggle = document.getElementById('menuToggle');
    const navLinks = document.querySelector('.nav-links');
    const socialIcons = document.querySelector('.social-icons');
    const headerLoadingBar = document.getElementById('header-loading-bar'); // Get once here

    if (toggle && navLinks) {
        toggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            if (socialIcons) {
                socialIcons.classList.toggle('active');
            }
            // IMPORTANT: If menu is toggled, ensure loading bar is reset
            if (headerLoadingBar) {
                headerLoadingBar.classList.remove('active', 'done');
                if (window.loadingBarTimeout) {
                    clearTimeout(window.loadingBarTimeout);
                    window.loadingBarTimeout = null;
                }
            }
        });
    }

    // Function to handle link clicks and loading bar
    function handleNavLinkClick(e) {
        const clickedLink = e.target.closest('a'); // Get the closest <a> tag

        // Only proceed if an actual link within navLinks was clicked
        // and it's not undefined or null
        if (clickedLink) {
            e.preventDefault(); // Prevent immediate navigation

            if (headerLoadingBar) {
                // Reset loading bar state
                headerLoadingBar.classList.remove('done');
                headerLoadingBar.classList.add('active');

                // Clear any existing timeout to prevent multiple navigations
                if (window.loadingBarTimeout) {
                    clearTimeout(window.loadingBarTimeout);
                    window.loadingBarTimeout = null;
                }

                window.loadingBarTimeout = setTimeout(() => {
                    headerLoadingBar.classList.remove('active');
                    headerLoadingBar.classList.add('done');
                    window.location.href = clickedLink.href; // Navigate after animation
                    window.loadingBarTimeout = null; // Clear timeout ID
                }, 3000); // Matches CSS animation duration
            } else {
                // If loading bar element isn't found, navigate immediately
                window.location.href = clickedLink.href;
            }

            // Close the mobile menu after clic
            // ng a link
            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                if (socialIcons) {
                    socialIcons.classList.remove('active');
                }
            }
        }
    }

    // Attach event listener only to the navLinks container for link clicks
    if (navLinks) {
        navLinks.addEventListener('click', handleNavLinkClick);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // Animate on scroll
    const observerOptions = {
        root: null, // Observe the viewport
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of the element is visible
    };

    const animateOnScroll = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const delay = parseInt(target.dataset.delay || '0'); // Get delay from data-delay attribute, default to 0
                setTimeout(() => {
                    target.classList.add('is-visible'); // Add class to trigger animation
                }, delay);
                observer.unobserve(target); // Stop observing once animated
            }
        });
    };

    const observer = new IntersectionObserver(animateOnScroll, observerOptions);

    // Observe all elements with 'animate-on-scroll' class
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });

    // Animate elements with 'animate-on-load' class shortly after load
    document.querySelectorAll('.animate-on-load').forEach(el => {
        setTimeout(() => el.classList.add('is-visible'), 100);
    });

    // Modal logic
    const modal = document.getElementById('fullscreenModal');
    const modalImg = document.getElementById('modalImage');
    const closeModalBtn = document.querySelector('.close-modal');
    const prevArrow = document.querySelector('.prev-arrow');
    const nextArrow = document.querySelector('.next-arrow');
    let currentImages = []; // Array to hold all gallery image elements
    let currentIndex = 0; // Index of the currently displayed image in the modal
    let touchStartX = 0;
    let touchEndX = 0;

    // Open modal when a gallery image is clicked
    document.querySelectorAll('.gallery-item img').forEach((img, index) => {
        img.addEventListener('click', () => {
            currentImages = Array.from(document.querySelectorAll('.gallery-item img')); // Get all images again to ensure order
            currentIndex = currentImages.findIndex(item => item === img); // Find the index of the clicked image
            openModal();
        });
    });

    function openModal() {
        modal.style.display = 'block';
        document.body.classList.add('modal-open'); // Add class to body to prevent scroll
        modal.style.zIndex = '1003'; // Set z-index higher than header (1001)
        updateModalImage();
    }

    function closeModalFunc() {
        modal.style.display = 'none';
        document.body.classList.remove('modal-open'); // Remove class to re-enable body scroll
        modal.style.zIndex = '1000'; // Reset modal's z-index
    }

    function updateModalImage() {
        modalImg.src = currentImages[currentIndex].src;
        modalImg.alt = currentImages[currentIndex].alt;
    }

    function showNext() {
        currentIndex = (currentIndex + 1) % currentImages.length; // Loop back to start
        updateModalImage();
    }

    function showPrev() {
        currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length; // Loop back to end
        updateModalImage();
    }

    // Event listeners for modal controls
    closeModalBtn.addEventListener('click', closeModalFunc);
    nextArrow.addEventListener('click', showNext);
    prevArrow.addEventListener('click', showPrev);

    // Keyboard navigation for modal
    document.addEventListener('keydown', (e) => {
        if (modal.style.display === 'block') { // Only active if modal is open
            if (e.key === 'ArrowRight') showNext();
            if (e.key === 'ArrowLeft') showPrev();
            if (e.key === 'Escape') closeModalFunc();
        }
    });

    // Swipe handling for modal on touch devices
    modal.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].clientX;
    });

    modal.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].clientX;
        const diffX = touchStartX - touchEndX;
        const swipeThreshold = 50; // Minimum swipe distance
        if (Math.abs(diffX) > swipeThreshold) {
            if (diffX > 0) showNext(); // Swipe left (move to next image)
            else showPrev(); // Swipe right (move to previous image)
        }
    });

    // Close modal when clicking on the overlay (outside the image)
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModalFunc();
    });
});

document.addEventListener('contextmenu', function (event) {
    event.preventDefault();
});
