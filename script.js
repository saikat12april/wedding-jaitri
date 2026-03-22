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

// Carousel functionality
let index = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
const intervalTime = 5000; // Slower transition (5 seconds)
let autoSlide;

// Displays the slide based on its index
function showSlide(i) {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    slides[i].classList.add('active');
    dots[i].classList.add('active');
    index = i;
}

// Moves to the next slide in the carousel
function nextSlide() {
    index = (index + 1) % slides.length;
    showSlide(index);
}

// Moves to the previous slide in the carousel
function prevSlide() {
    index = (index - 1 + slides.length) % slides.length;
    showSlide(index);
}

// Starts the automatic slide transition
function startAutoSlide() {
    autoSlide = setInterval(nextSlide, intervalTime);
}

// Stops the automatic slide transition
function stopAutoSlide() {
    clearInterval(autoSlide);
}

// Event listeners for carousel dots
dots.forEach(dot => {
    dot.addEventListener('click', () => {
        stopAutoSlide();
        showSlide(+dot.dataset.index); // Use dataset.index to get the slide number
        startAutoSlide();
    });
});

// Event listeners for carousel arrow navigation
document.getElementById('nextBtn').addEventListener('click', () => {
    stopAutoSlide();
    nextSlide();
    startAutoSlide();
});

document.getElementById('prevBtn').addEventListener('click', () => {
    stopAutoSlide();
    prevSlide();
    startAutoSlide();
});

// Pause autoplay on carousel hover
const carouselContainer = document.querySelector('.carousel-container');

carouselContainer.addEventListener('mouseenter', () => {
    stopAutoSlide();
});

carouselContainer.addEventListener('mouseleave', () => {
    startAutoSlide();
});

// Initialize the carousel on page load
showSlide(index);
startAutoSlide();

//video
// Replace with your actual YouTube video link
const youtubeLink = 'https://www.youtube.com/watch?v=vq3YN0Onhms';

document.getElementById('watchNowBtn1').onclick = function () {
    window.open(youtubeLink, '_blank');
};

// --- Form Submission Logic (Updated) ---
const photographyForm = document.getElementById('photographyForm');
const submitButton = document.getElementById('submitButton'); // Get reference to the submit button
const successPopup = document.getElementById('successPopup'); // Get reference to the success pop-up

if (photographyForm && submitButton && successPopup) { // Ensure all elements exist
    photographyForm.addEventListener('submit', function (e) {
        e.preventDefault(); // Prevent the default form submission (page reload)

        // Disable the submit button to prevent multiple submissions
        submitButton.disabled = true;
        submitButton.value = 'Sending...'; // Change button text

        // Gather specific form data (only the fields you need)
        const data = {
            fullName: document.getElementById('fullName').value,
            eventDate: document.getElementById('eventDate').value,
            phoneNumber: document.getElementById('phoneNumber').value
        };

        // IMPORTANT: REPLACE THIS URL WITH YOUR DEPLOYED GOOGLE APPS SCRIPT WEB APP URL
        const scriptUrl = 'https://script.google.com/macros/s/AKfycbxWI1jZpOqSvPelk9nq6yzDq51vvcHpmnNMpkcFeYsLyHLIja3zaGrb-cwRqT9lZ46pBw/exec'; // Your provided URL

        // Send data using Fetch API
        fetch(scriptUrl, {
            method: 'POST',
            mode: 'no-cors', // Required for Google Apps Script as it doesn't send CORS headers
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams(data).toString() // Send data as URL-encoded string
        })
            .then(response => {
                // In 'no-cors' mode, we can't inspect the response directly for success/failure.
                // A successful fetch() here only indicates the request was sent.
                console.log('Form data sent successfully (response cannot be inspected due to no-cors).');

                // 1. Show the green tick pop-up
                successPopup.classList.add('show');

                // 2. Hide the pop-up and re-enable button after 3 seconds
                setTimeout(() => {
                    successPopup.classList.remove('show');
                    submitButton.disabled = false; // Re-enable the button
                    submitButton.value = 'Send My Inquiry'; // Reset button text
                }, 3000); // 3 seconds

                // 3. Clean the form itself
                photographyForm.reset(); // Clears all input fields in the form

            })
            .catch(error => {
                // This 'catch' block will only fire for network errors or issues preventing the request from being sent.
                console.error('Error sending form data:', error);
                alert('There was an error sending your request. Please try again later.'); // User feedback for error

                // Re-enable button and reset text even if there's an error
                submitButton.disabled = false;
                submitButton.value = 'Send My Inquiry';
            });
    });
}
// script.js - Add this code to your existing script.js file

// script.js - Replace your existing stats section JavaScript with this

document.addEventListener('DOMContentLoaded', () => {
    // Other existing JavaScript (e.g., form submission, carousel) would be here

    // --- Counter Animation for Stats Section ---
    const statsSection = document.querySelector('.stats-section');
    const statCounters = document.querySelectorAll('.stat-counter');

    const animateCounter = (element, target) => {
        // Reset the counter to 0 before starting animation
        element.textContent = '0+';

        let current = 0;
        const duration = 1500; // Animation duration in milliseconds (1.5 seconds)
        // Calculate the increment to reach the target within the duration
        // We'll update roughly every 10ms, so duration / 10 is the number of steps
        const increment = target / (duration / 10);

        const updateCounter = () => {
            if (current < target) {
                current += increment;
                // Ensure it doesn't go over target on the last step and add '+'
                element.textContent = Math.min(Math.round(current), target) + '+';
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target + '+'; // Ensure it ends exactly on the target number
            }
        };
        updateCounter();
    };

    // Use Intersection Observer to trigger animation whenever section is in view
    const observerOptions = {
        root: null, // relative to the viewport
        rootMargin: '0px',
        threshold: 0.5 // Trigger when 50% of the section is visible
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // If the section is intersecting (in view), run the animation
                statCounters.forEach(counter => {
                    const target = parseInt(counter.dataset.target);
                    animateCounter(counter, target);
                });
            } else {
                // Optional: If you want to reset the counters to 0 when scrolled out of view
                statCounters.forEach(counter => {
                    counter.textContent = '0+';
                });
            }
        });
    }, observerOptions);

    if (statsSection) {
        observer.observe(statsSection);
    }
});
// script.js - Add this code to your existing script.js file

document.addEventListener('DOMContentLoaded', () => {
    // ... (Your existing JavaScript like carousel, counter, etc.) ...

    // --- FAQ Accordion Functionality ---
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question.addEventListener('click', () => {
            // Toggle the 'active' class on the clicked item
            item.classList.toggle('active');

            // Set max-height for smooth transition
            if (item.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + 'px'; // Set height to content's scrollHeight
            } else {
                answer.style.maxHeight = '0'; // Collapse
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const sindoorContainer = document.querySelector('.sindoor-effect-container');
    const numParticles = 100; // Significantly increased particle count for better coverage of small dots

    for (let i = 0; i < numParticles; i++) {
        const particle = document.createElement('div');
        particle.classList.add('sindoor-particle');

        // Randomize initial position (left), size, speed, and delay
        const left = Math.random() * 140 - 20; // Spawns from -20% to 120% to guarantee full edge coverage
        const size = Math.random() * (10 - 3) + 3; // Size for round drops: 3px to 10px
        const duration = Math.random() * (6 - 3) + 3; // Duration between 3s and 6s for smoother fall
        const delay = Math.random() * (duration); // Delay for staggering effect

        particle.style.left = `${left}%`;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${delay}s`;

        sindoorContainer.appendChild(particle);
    }
});
// Add this JavaScript snippet to your existing 'script.js' file.
// It's best to place it near the end of your script.js, but inside
// a 'DOMContentLoaded' listener if you have one, or just at the top
// level if your script runs after the HTML is loaded.
document.addEventListener("DOMContentLoaded", function () {
    const welcomeOverlay = document.getElementById("welcome-overlay");
    const mainContent = document.getElementById("main-content");
    const canvas = document.getElementById("fireworks-canvas");
    const ctx = canvas.getContext("2d");

    // Check if the animation has played in this session
    const hasAnimationPlayed = sessionStorage.getItem('welcomeAnimationPlayed');

    if (hasAnimationPlayed) {
        // If animation has played, immediately hide overlay and show content
        welcomeOverlay.style.display = 'none'; // Hide overlay instantly
        mainContent.style.display = 'block';   // Make content block-level instantly
        mainContent.style.opacity = '1';       // Make content fully opaque instantly
        mainContent.classList.add("visible");  // Ensure visible class for consistency
        document.body.classList.remove('no-scroll'); // Ensure scrolling is enabled
        return; // Stop function execution here
    }

    // If animation has NOT played, proceed with the animation
    sessionStorage.setItem('welcomeAnimationPlayed', 'true'); // Mark as played for this session

    // Adjust canvas size to window size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Prevent scrolling while the animation is active
    document.body.classList.add('no-scroll');

    // --- Fireworks Animation Logic ---
    let particles = [];
    // Changed colors to complement the new text color and provide variety
    const colors = ['#FFC300', '#FF5733', '#C70039', '#900C3F', '#581845', '#DAF7A6', '#00BFFF', '#8B008B', '#00FFFF', '#FF6347'];

    class Particle {
        constructor(x, y, color, velocityX, velocityY, friction, gravity) {
            this.x = x;
            this.y = y;
            this.color = color;
            this.radius = Math.random() * 2 + 1;
            this.velocityX = velocityX;
            this.velocityY = velocityY;
            this.alpha = 1;
            this.friction = friction;
            this.gravity = gravity;
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.restore();
        }

        update() {
            this.draw();
            this.velocityX *= this.friction;
            this.velocityY *= this.friction;
            this.velocityY += this.gravity;
            this.x += this.velocityX;
            this.y += this.velocityY;
            this.alpha -= 0.015;
        }
    }

    function createExplosion(x, y) {
        const particleCount = 100;
        const angleIncrement = (Math.PI * 2) / particleCount;
        const speed = Math.random() * 4 + 2;
        const chosenColor = colors[Math.floor(Math.random() * colors.length)];

        for (let i = 0; i < particleCount; i++) {
            const angle = angleIncrement * i;
            const velocityX = Math.cos(angle) * speed;
            const velocityY = Math.sin(angle) * speed;
            particles.push(new Particle(x, y, chosenColor, velocityX, velocityY, 0.98, 0.08));
        }
    }

    let animationId;
    let burstInterval;
    const animationDuration = 3000; // 3 seconds for the animation

    function animateFireworks() {
        animationId = requestAnimationFrame(animateFireworks);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)'; // Your desired background color
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        particles.forEach((particle, index) => {
            if (particle.alpha <= 0.05 || particle.radius <= 0) {
                particles.splice(index, 1);
            } else {
                particle.update();
            }
        });
    }

    // Start bursting crackers after a short delay
    setTimeout(() => {
        animateFireworks();
        burstInterval = setInterval(() => {
            const x = Math.random() * canvas.width;
            const y = Math.random() * (canvas.height / 2);
            createExplosion(x, y);
        }, 200);
    }, 500);

    // --- Control Animation Duration and Content Reveal ---
    setTimeout(() => {
        clearInterval(burstInterval);
        cancelAnimationFrame(animationId);

        // Before fading, ensure main content is ready to be displayed as block
        mainContent.style.display = 'block'; // Make content visible as block

        // Start fading out the welcome overlay
        welcomeOverlay.classList.add("hidden");
        document.body.classList.remove('no-scroll'); // Re-enable scrolling

        // After the overlay fades out, fade in the main content
        setTimeout(() => {
            mainContent.classList.add("visible");
        }, 1000); // This matches the 1s transition of the overlay
    }, animationDuration);

    // Fallback/Safety Net: Ensures content appears even if something goes wrong
    setTimeout(() => {
        if (!mainContent.classList.contains("visible")) {
            welcomeOverlay.classList.add("hidden");
            document.body.classList.remove('no-scroll');
            mainContent.classList.add("visible");
            mainContent.style.display = 'block'; // Ensure block display for fallback
        }
    }, animationDuration + 2000); // Gives an extra 2 seconds for fallback
});

document.addEventListener('DOMContentLoaded', () => {
    const whatsappButton = document.getElementById('whatsapp-popup-button');

    if (whatsappButton) {
        whatsappButton.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default link behavior if it's an anchor tag

            // Your WhatsApp number (country code without '+' or '00' prefix)
            // Example for India: 917679724309
            const clientPhoneNumber = '917679724309';
            const message = encodeURIComponent("Hello Wedding Jaitri, I'm interested in your services!");
            const whatsappUrl = `https://wa.me/${clientPhoneNumber}?text=${message}`;

            window.open(whatsappUrl, '_blank');
        });
    }
});

document.addEventListener('contextmenu', function (event) {
    event.preventDefault();
});
