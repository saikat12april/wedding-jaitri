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
});

document.addEventListener("DOMContentLoaded", function () {
    const aboutUsSection = document.getElementById("about-us-section");

    // Options for the Intersection Observer
    const observerOptions = {
        root: null, // 'null' means the viewport is used as the root
        rootMargin: "0px", // No extra margin around the root
        threshold: 0.5 // Trigger when 50% of the target element is visible
    };

    // Create a new Intersection Observer
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // If the 'aboutUsSection' is visible (intersecting),
                // add the 'active' class to it.
                aboutUsSection.classList.add("active");
                // We stop observing once the animation has been triggered.
                // If you wanted the animation to reset/restart every time it comes
                // into view, you would remove this line AND manage the class
                // removal when it goes out of view. For continuous loop, this is fine.
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // If the section exists, start observing it
    if (aboutUsSection) {
        observer.observe(aboutUsSection);
    }
});

document.addEventListener('contextmenu', function (event) {
    event.preventDefault();
});