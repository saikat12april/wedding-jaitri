// script.js

document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle functionality
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
        if (clickedLink && clickedLink.href) { // Ensure href exists
            e.preventDefault(); // Prevent immediate navigation

            if (headerLoadingBar) {
                // Reset loading bar state
                headerLoadingBar.classList.remove('done');
                headerLoadingBar.classList.add('active');

                // Clear any existing timeout to prevent multiple navigations
                if (window.loadingBarTimeout) {
                    clearTimeout(window.loadingBarTimeout);
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

            // Close the mobile menu after clicking a link
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

    // Placeholder for "Select Package" button click handlers
    // These buttons are currently commented out in the HTML.
    const selectPackageButtons = document.querySelectorAll('section button');
    selectPackageButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const packageNameElement = event.target.closest('.rounded-xl').querySelector('h3');
            const packageName = packageNameElement ? packageNameElement.textContent : 'a package';
            console.log(`User selected: ${packageName}`);
            alert(`Thank you for your interest in ${packageName}! Please proceed to book your event.`);
        });
    });

    // "Book Your Event Now" button click handler
    const bookEventNowButton = document.querySelector('.inline-flex.items-center');
    if (bookEventNowButton) {
        bookEventNowButton.addEventListener('click', () => {
            console.log('Book Your Event Now button clicked!');
            // Redirect to the booking.html page
            window.location.href = 'bookus.html'; // Changed from bookus.html to booking.html
        });
    }

    // Scroll Animation (from original services.js, for image-containers if they exist)
    const containers = document.querySelectorAll('.image-container');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.15 });

    containers.forEach(container => observer.observe(container));

    // Modal Functionality (from original services.js, for image modals if they exist)
    const modal = document.getElementById('modal');
    const modalImg = document.getElementById('modalImg');
    const images = Array.from(document.querySelectorAll('.image-container img'));
    let currentIndex = 0;

    document.querySelectorAll('.image-container').forEach((container, index) => {
        container.addEventListener('click', () => {
            currentIndex = index;
            if (modal && modalImg) {
                modal.style.display = 'flex';
                modalImg.src = images[currentIndex].src;
            }
        });
    });

    const closeButton = document.querySelector('.close-button');
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            if (modal) modal.style.display = 'none';
        });
    }

    const leftArrow = document.querySelector('.left-arrow');
    if (leftArrow) {
        leftArrow.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            if (modalImg) modalImg.src = images[currentIndex].src;
        });
    }

    const rightArrow = document.querySelector('.right-arrow');
    if (rightArrow) {
        rightArrow.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % images.length;
            if (modalImg) modalImg.src = images[currentIndex].src;
        });
    }

    document.addEventListener('keydown', (e) => {
        if(modal && modal.style.display === 'flex') {
            if(e.key === 'Escape') modal.style.display = 'none';
            if(e.key === 'ArrowLeft' && leftArrow) leftArrow.click();
            if(e.key === 'ArrowRight' && rightArrow) rightArrow.click();
        }
    });

    if (modal) {
        modal.addEventListener('click', (e) => {
            if(e.target === modal) modal.style.display = 'none';
        });
    }
});

document.addEventListener('contextmenu', function (event) {
    event.preventDefault();
});
