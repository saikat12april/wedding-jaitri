document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.querySelector('.nav-links');
    const socialIcons = document.querySelector('.social-icons');
    const headerLoadingBar = document.getElementById('header-loading-bar');
    const allGalleryImages = document.querySelectorAll('.gallery-column img');
    const imageModal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const closeButton = document.querySelector('.close-button');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');

    let currentImageIndex = 0;
    let images = []; // Store all image sources

    // Populate the images array when the DOM is ready
    allGalleryImages.forEach(img => {
        images.push(img.src);
    });

    // Toggle mobile menu
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        socialIcons.classList.toggle('active');
        document.body.classList.toggle('no-scroll', navLinks.classList.contains('active'));
    });

    // Show loading bar on navigation link click
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', (event) => {
            const href = link.getAttribute('href');
            if (href && href !== '#' && href !== 'javascript:void(0)') {
                event.preventDefault(); // Prevent default navigation immediately
                headerLoadingBar.classList.add('active');
                setTimeout(() => {
                    window.location.href = href;
                }, 1000); // Simulate delay before navigation
            }
        });
    });

    // Handle opening the modal
    allGalleryImages.forEach((img, index) => {
        img.addEventListener('click', () => {
            imageModal.style.display = 'flex';
            modalImage.src = img.src;
            currentImageIndex = index;
            document.body.classList.add('no-scroll'); // Prevent scrolling when modal is open
        });
    });

    // Handle closing the modal
    closeButton.addEventListener('click', () => {
        imageModal.style.display = 'none';
        document.body.classList.remove('no-scroll'); // Re-enable scrolling
    });

    // Handle previous image
    prevButton.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        modalImage.src = images[currentImageIndex];
    });

    // Handle next image
    nextButton.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        modalImage.src = images[currentImageIndex];
    });

    // Keyboard navigation (left/right arrow keys)
    document.addEventListener('keydown', (e) => {
        if (imageModal.style.display === 'flex') {
            if (e.key === 'ArrowLeft') {
                prevButton.click();
            } else if (e.key === 'ArrowRight') {
                nextButton.click();
            } else if (e.key === 'Escape') {
                closeButton.click();
            }
        }
    });

    // Swipe functionality for mobile
    let touchstartX = 0;
    let touchendX = 0;

    imageModal.addEventListener('touchstart', (e) => {
        touchstartX = e.changedTouches[0].screenX;
    });

    imageModal.addEventListener('touchend', (e) => {
        touchendX = e.changedTouches[0].screenX;
        handleGesture();
    });

    function handleGesture() {
        if (touchendX < touchstartX - 50) { // Swipe left
            nextButton.click();
        }

        if (touchendX > touchstartX + 50) { // Swipe right
            prevButton.click();
        }
    }
});

document.addEventListener('contextmenu', function (event) {
    event.preventDefault();
});