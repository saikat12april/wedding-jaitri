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

    // --- Booking Section Specific JavaScript ---
    const bookingForm = document.getElementById('bookingForm');
    const invoiceOutput = document.getElementById('invoiceOutput');
    const bookingIdDisplay = document.getElementById('bookingIdDisplay'); // Original display below form
    const downloadInvoiceBtn = document.getElementById('downloadInvoiceBtn');

    // Elements for custom success message
    const successMessageOverlay = document.getElementById('successMessageOverlay');
    const bookingIdDisplayCustom = document.getElementById('bookingIdDisplayCustom');

    // Form fields that need dynamic interaction
    const typeOfShootSelect = document.getElementById('typeOfShoot');
    const estimatedBudgetInput = document.getElementById('estimatedBudget');

    // To store the form data after initial submission for reliable re-download
    let lastSubmittedFormData = null;
    let lastGeneratedBookingId = null; // Store the booking ID as well

    // Define budget values for different shoot types and NEW packages
    const shootBudgets = {
        "Engagement": 75000,
        "Anniversary": 50000,
        "Birthday": 30000,
        "Other": 40000,
        "PACKAGE I: Normal (Groom Side)": 31999,
        "PACKAGE: Normal (Bride Side)": 27999,
        "PACKAGE I: Standard (Groom Side)": 39999,
        "PACKAGE I: Standard (Bride Side)": 34999,
        "PACKAGE I: Standard (Both Side)": 72999,
        "PACKAGE II: Best (Groom Side)": 49999,
        "PACKAGE II: Best (Bride Side)": 43999,
        "PACKAGE II: Gold (Both Side)": 84499,
        "PACKAGE III: Better (Groom Side)": 89999,
        "PACKAGE III: Better (Bride Side)": 64999,
        "PACKAGE III: Platinum (Both Side)": 96999,
        "PACKAGE IV: Pro (Both Side)": 115999
    };

    // Define the package details object here
    const packageDetails = {
        "PACKAGE I: Normal (Groom Side)": [
            "1 Photographer + 1 Traditional Videography",
            "1 Standard Photobook (12x36 in, 20-25 sheets)",
            "Full HD Videography (27-35 minutes)",
            "125 edited & color-corrected high-resolution images"
        ],
        "PACKAGE: Normal (Bride Side)": [
            "1 Photographer + 1 Traditional Videography",
            "2 Premium Pro CANVERA Photobooks (12x36 in, 20 sheets)",
            "HD Wedding Video (35-45 minutes)",
            "50 edited & color-corrected high-resolution images"
        ],
        "PACKAGE I: Standard (Groom Side)": [
            "2 Photographers + 1 Cinematographer",
            "2 Standard Canvera Photobooks (12x36 in, 20-25 sheets)",
            "Full HD Wedding Film (27-35 minutes)",
            "125 edited & color-corrected high-resolution images"
        ],
        "PACKAGE I: Standard (Bride Side)": [
            "2 Photographers + 1 Cinematographer",
            "2 Standard Canvera Photobooks (12x36 in, 20-23 sheets)",
            "Full HD Wedding Film (27-35 minutes)",
            "125 edited & color-corrected high-resolution images"
        ],
        "PACKAGE I: Standard (Both Side)": [
            "2 Photographers + 1 Cinematographer",
            "2 Standard Canvera Photobooks (12x36 in, 21-25 sheets)",
            "Full HD Wedding Film (27-37 minutes)",
            "130 edited & color-corrected high-resolution images"
        ],
        "PACKAGE II: Best (Groom Side)": [
            "2 Photographers + 1 Cinematographer",
            "2 Premium CANVERA Photobooks (12x36 in, 22-27 sheets)",
            "4K Wedding Film (30-35 minutes)",
            "Instagram reels",
            "Pre-wedding photography session (complimentary)",
            "Cinematic wedding film",
            "150 edited & color-corrected high-resolution images"
        ],
        "PACKAGE II: Best (Bride Side)": [
            "2 Photographers + 1 Cinematographer",
            "2 Premium CANVERA Photobooks (12x36 in, 20-25 sheets)",
            "4K Wedding Film (30-35 minutes)",
            "Instagram reels",
            "Pre-wedding photography session (complimentary)",
            "Cinematic wedding film",
            "150 edited & color-corrected high-resolution images"
        ],
        "PACKAGE II: Gold (Both Side)": [
            "2 Photographers + 1 Cinematographer",
            "2 Premium CANVERA Photobooks (12x36 in, 25-25 sheets)",
            "4K Wedding Film (30-35 minutes)",
            "Wedding trailer / Instagram reels",
            "Cinematic wedding film",
            "Pre-wedding photography session (complimentary)",
            "150 edited & color-corrected high-resolution images"
        ],
        "PACKAGE III: Better (Groom Side)": [
            "2 Photographers + 1 Cinematographer",
            "1 Premium CANVERA Photobook (12x36 in, 25-30 sheets)",
            "4K Wedding Film (25-35 minutes)",
            "Wedding trailer / Instagram reels",
            "200 edited & color-corrected high-resolution images"
        ],
        "PACKAGE III: Better (Bride Side)": [
            "2 Photographers + 1 Cinematographer",
            "1 Premium CANVERA Photobook (12x36 in, 25-30 sheets)",
            "4K Wedding Film (25-35 minutes)",
            "Wedding trailer / Instagram reels",
            "200 edited & color-corrected high-resolution images"
        ],
        "PACKAGE III: Platinum (Both Side)": [
            "2 Photographers + 1 Cinematographer",
            "2 Premium CANVERA Photobooks (12x36 in, 25-30 sheets)",
            "4K Wedding Film (25-35 minutes)",
            "Wedding trailer / Instagram reels",
            "Pre-wedding photography session",
            "Cinematic film with drone coverage",
            "200 edited & color-corrected high-resolution images"
        ],
        "PACKAGE IV: Pro (Both Side)": [
            "2 Photographers + 1 Cinematographer",
            "2 Premium Pro CANVERA Photobooks (12x36 in, 25-32 sheets)",
            "4K Wedding Film (25-35 minutes)",
            "Wedding trailer / Instagram reels",
            "Pre-wedding photography session",
            "Cinematic film with drone coverage",
            "Instant photo printing at wedding or reception",
            "250 edited & color-corrected high-resolution images"
        ],
        "Engagement": ["Engagement Photography Services"],
        "Anniversary": ["Anniversary Photography Services"],
        "Birthday": ["Birthday Photography Services"],
        "Other": ["Custom Photography Services"]
    };


    // Function to update estimated budget based on selected shoot type
    function updateEstimatedBudget() {
        const selectedType = typeOfShootSelect.value;
        const budget = shootBudgets[selectedType] || 0; // Default to 0 if not found
        estimatedBudgetInput.value = budget;
    }

    // Add event listener to update budget when shoot type changes
    typeOfShootSelect.addEventListener('change', updateEstimatedBudget);

    // Initial budget update in case a default option is pre-selected
    updateEstimatedBudget();

    // Function to generate a simple unique booking ID
    function generateBookingId() {
        const timestamp = new Date().getTime();
        const randomNum = Math.floor(Math.random() * 100000);
        return `WJ-${timestamp}-${randomNum}`;
    }

    // Function to generate the invoice PDF
    async function generateInvoicePDF(formData, bookingId) {
        if (typeof window.jspdf === 'undefined') {
            console.error('jsPDF library not loaded. Cannot generate PDF.');
            alert('PDF generation failed. Please try again later. Make sure you have the jsPDF library included in your HTML.');
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        const invoiceDate = new Date().toLocaleDateString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });

        const selectedShootType = formData.get('typeOfShoot'); // Get the selected package name
        const subtotal = parseFloat(formData.get('estimatedBudget'));
        const discountPercentage = 0.25; // 25% discount
        const discountAmount = subtotal * discountPercentage;
        const amountAfterDiscount = subtotal - discountAmount;

        const totalAmount = amountAfterDiscount;

        let y = 20;

        const logoImg = new Image();
        logoImg.src = 'Logo New 1 2025 copy.png'; // Make sure this path is correct relative to your HTML

        await new Promise(resolve => {
            logoImg.onload = () => {
                // IMPORTANT: Ensure 'Logo New 1 2025 copy.png' is optimized (resized and compressed)
                // before being used here. A large source image will result in a large PDF.
                // Aim for a resolution slightly higher than its display size (e.g., 100-200px for a 30x30pt display).
                // Added compression option to reduce PDF size
                doc.addImage(logoImg, 'PNG', 15, y, 30, 30, undefined, 'MEDIUM'); // Added 'MEDIUM' compression
                resolve();
            };
            logoImg.onerror = () => {
                console.warn('Logo image failed to load for PDF. Proceeding without logo.');
                resolve();
            };
        });
        y += 35; // Adjusted from 40 to 35 for more vertical space

        doc.setFontSize(28);
        doc.setTextColor(153, 0, 51);
        doc.text("INVOICE", 150, 30, { align: 'right' });

        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text(`Invoice Date: ${invoiceDate}`, 195, 40, { align: 'right' });
        doc.text(`Booking ID: ${bookingId}`, 195, 45, { align: 'right' });

        doc.setFontSize(14);
        doc.setTextColor(153, 0, 51);
        doc.text("Wedding Jaitri", 15, y);
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        y += 6; // Adjusted from 7 to 6
        doc.text("V162-Ballavpur,West Bengal-721101", 15, y);
        y += 4; // Adjusted from 5 to 4
        doc.text("Email: wjaitri@gmail.com", 15, y);
        y += 4; // Adjusted from 5 to 4
        doc.text("Phone: +91 7679724309 / 03222368763", 15, y);
        y += 12; // Adjusted from 15 to 12

        doc.setDrawColor(153, 0, 51);
        doc.setLineWidth(0.5);
        doc.line(15, y - 5, 195, y - 5);
        y += 5;

        doc.setFontSize(14);
        doc.setTextColor(153, 0, 51);
        doc.text("Bill To:", 15, y);
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        y += 6; // Adjusted from 7 to 6
        doc.text(formData.get('clientName'), 15, y);
        y += 4; // Adjusted from 5 to 4
        doc.text(formData.get('clientEmail'), 15, y);
        y += 4; // Adjusted from 5 to 4
        doc.text(formData.get('clientPhone'), 15, y);
        y += 12; // Adjusted from 15 to 12

        doc.line(15, y - 5, 195, y - 5);
        y += 5;

        doc.setFillColor(240, 240, 240);
        doc.rect(15, y, 180, 10, 'F');
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text("Description", 20, y + 5); // Adjusted from y+7 to y+5
        doc.text("Amount (Rs.)", 175, y + 5, { align: 'right' }); // Adjusted from y+7 to y+5
        doc.setFont(undefined, 'normal');
        y += 10;

        // --- Start of package details printing ---
        doc.text(`${selectedShootType} Service`, 20, y + 4); // Adjusted from y to y+2 for slight offset from header
        doc.text(`${subtotal.toFixed(2)}`, 175, y + 4, { align: 'right' }); // Adjusted from y to y+2
        y += 10; // Adjusted from 12 to 10 for more compact spacing

        const details = packageDetails[selectedShootType];
        if (details && details.length > 0) {
            doc.setFontSize(9); // Smaller font for details
            doc.setTextColor(50, 50, 50); // Slightly lighter color
            details.forEach(item => {
                // Check for page overflow before adding a line
                if (y + 5 > doc.internal.pageSize.height - 30) { // Keep 30 units margin at bottom
                    doc.addPage();
                    y = 20; // Reset Y for new page
                }
                doc.text(`- ${item}`, 25, y); // Indent details slightly
                y += 5; // Smaller line height for details
            });
            doc.setTextColor(0, 0, 0); // Reset color
            doc.setFontSize(10); // Reset font size
        } else {
            // If no specific details are found for the package/service
            doc.text("No detailed description available for this service.", 20, y + 7);
            y += 10; // Add space for this line
        }
        // --- End of package details printing ---

        // Crucial adjustment: Add enough space after the package details block
        y += 8; // Adjusted from 10 to 8 for more compactness

        doc.text(`Event Date: ${formData.get('eventDate')}`, 20, y);
        y += 6; // Adjusted from 7 to 6
        doc.text(`Shoot Location: ${formData.get('shootLocation')}`, 20, y);
        y += 15; // Adjusted from 20 to 15

        doc.line(15, y - 5, 195, y - 5);
        y += 5;

        if (discountAmount > 0) {
            doc.text(`Discount (25%)`, 140, y + 7, { align: 'right' });
            doc.text(`-${discountAmount.toFixed(2)}`, 175, y + 7, { align: 'right' });
            y += 7;
        }

        y += 3;
        doc.setFont(undefined, 'bold');
        doc.text("Subtotal:", 140, y + 7, { align: 'right' });
        doc.text(`${amountAfterDiscount.toFixed(2)}`, 175, y + 7, { align: 'right' });
        doc.setFont(undefined, 'normal');
        y += 7;

        doc.line(140, y + 2, 195, y + 2);
        y += 5;

        doc.setFontSize(16);
        doc.setFillColor(246, 246, 34);
        doc.rect(15, y + 5, 180, 15, 'F');
        doc.setTextColor(153, 0, 51);
        doc.setFont(undefined, 'bold');
        doc.text("TOTAL:", 140, y + 15, { align: 'right' });
        doc.text(`Rs. ${totalAmount.toFixed(2)}`, 175, y + 15, { align: 'right' });
        doc.setFont(undefined, 'normal');
        doc.setTextColor(0, 0, 0);
        y += 25; // Adjusted from 30 to 25

        doc.setFontSize(12);
        doc.text("Thank you for your booking with Wedding Jaitri!", 105, y, { align: 'center' });
        y += 8; // Adjusted from 10 to 8
        doc.text("We look forward to capturing your iconic cinematic wedding.", 105, y, { align: 'center' });
        y += 15; // Adjusted from 20 to 15

        doc.setFontSize(8);
        doc.text("Note: This is an estimated invoice. Final charges may vary based on specific requirements and services.", 15, y);
        y += 4; // Adjusted from 5 to 4
        doc.text("Payment terms: 25% advance, 75% before delivery of final output.", 15, y);

        doc.save(`WeddingJaitri_Invoice_${bookingId}.pdf`);
    }

    // Form Submission Handler
    bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitButton = bookingForm.querySelector('.submit-button');
        submitButton.disabled = true;
        submitButton.textContent = 'Submitting...';

        const formData = new FormData(bookingForm);
        const bookingId = generateBookingId();

        // Store the form data and booking ID for later invoice generation
        lastSubmittedFormData = new FormData(bookingForm);
        lastGeneratedBookingId = bookingId;

        // Append the booking ID to the form data for Web3Forms
        formData.append('Booking ID', bookingId);
        // Ensure the 'typeOfShoot' field is correctly named for Web3Forms submission
        formData.set('typeOfShoot', typeOfShootSelect.value);

        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                // Hide the form immediately
                bookingForm.style.display = 'none';

                // Display the success message overlay
                bookingIdDisplayCustom.textContent = bookingId; // Set booking ID for the overlay
                successMessageOverlay.style.display = 'flex'; // Show the overlay
                successMessageOverlay.classList.add('show'); // Trigger the animation

                // After 2 seconds, hide the overlay and trigger PDF download
                setTimeout(async () => {
                    successMessageOverlay.classList.remove('show'); // Start fade out animation
                    setTimeout(() => {
                        successMessageOverlay.style.display = 'none'; // Hide completely after animation
                    }, 500); // Match CSS transition duration

                    // Automatically generate and download the invoice PDF
                    await generateInvoicePDF(lastSubmittedFormData, lastGeneratedBookingId);

                    // Show the persistent invoice output section below the form area
                    // This will be visible AFTER the pop-up disappears and initial download occurs
                    invoiceOutput.style.display = 'block';
                    bookingIdDisplay.textContent = lastGeneratedBookingId; // Update ID in the persistent section

                }, 2000); // Duration for the pop-up to be visible

            } else {
                console.error("Web3Forms Error:", data);
                alert("There was an issue submitting your booking. Please try again.");
                // Re-show form and reset button if submission fails
                bookingForm.style.display = 'block';
            }
        } catch (error) {
                console.error("Network or Web3Forms submission error:", error);
                alert("A network error occurred. Please check your internet connection and try again.");
                // Re-show form and reset button if submission fails
                bookingForm.style.display = 'block';
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = 'Submit & Get Invoice';
            }
        });

        // Download button click handler (for the persistent one below the form area)
        downloadInvoiceBtn.addEventListener('click', async () => {
            if (lastSubmittedFormData && lastGeneratedBookingId) {
                // Re-download the invoice using the stored data
                await generateInvoicePDF(lastSubmittedFormData, lastGeneratedBookingId);
            } else {
                alert("Booking data not found. Please submit the form first.");
            }
        });
    });


    // Get elements from the HTML
    const discountPopup = document.getElementById('discount-popup');
    const closePopupButton = document.getElementById('close-popup');
    const crackerAnimationArea = document.getElementById('cracker-animation-area');
    const discountSticker = document.getElementById('discount-sticker');

    // Global variable to store the cracker animation interval ID
    let crackerAnimationIntervalId;

    // --- Pop-up Control ---
    // Function to display the discount pop-up
    function showDiscountPopup() {
        discountPopup.classList.add('popup-visible'); // Make the pop-up visible
        startCrackerAnimationLoop(); // Start the continuous cracker animation
    }

    // Function to hide the discount pop-up
    function hideDiscountPopup() {
        discountPopup.classList.remove('popup-visible'); // Hide the pop-up
        stopCrackerAnimationLoop(); // Stop the continuous cracker animation
        crackerAnimationArea.innerHTML = ''; // Clear any lingering cracker particles for a clean slate
    }

    // Show the pop-up after a short delay (e.g., 2 seconds after page load)
    setTimeout(showDiscountPopup, 2000);

    // Add event listener to the close button to hide the pop-up
    closePopupButton.addEventListener('click', hideDiscountPopup);

    // --- Cracker Burst Animation (Continuous until closed) ---

    // Function to create and animate a single cracker particle
    function createAndAnimateCrackerParticle() {
        const particle = document.createElement('div');
        particle.classList.add('cracker-particle');
        crackerAnimationArea.appendChild(particle);

        const colors = ['#0ff', '#f0f', '#ff0', '#0f0', '#fff']; // Neon colors
        const size = Math.random() * 8 + 4; // Random size between 4px and 12px
        const color = colors[Math.floor(Math.random() * colors.length)];

        // Start particles closer to the center of the animation area
        const startX = (crackerAnimationArea.offsetWidth / 2) + (Math.random() - 0.5) * 50;
        const startY = (crackerAnimationArea.offsetHeight / 2) + (Math.random() - 0.5) * 50;

        // Apply initial CSS styles to the particle
        Object.assign(particle.style, {
            position: 'absolute',
            width: `${size}px`,
            height: `${size}px`,
            backgroundColor: color,
            borderRadius: '50%', // Make them round
            left: `${startX}px`,
            top: `${startY}px`,
            opacity: 0, // Start invisible
            transform: 'scale(0)' // Start very small
        });

        // Define the target destination for each particle to spread out
        const targetX = startX + (Math.random() - 0.5) * 300; // Spread horizontally up to 300px
        const targetY = startY + (Math.random() - 0.5) * 300; // Spread vertically up to 300px

        // Define the duration for an individual particle's movement and fade (fast movement)
        const particleMoveDuration = 600 + Math.random() * 400; // Each particle moves for 0.6 to 1.0 seconds

        // Animate the particle to its target position and make it visible/grow
        particle.style.transition = `all ${particleMoveDuration / 1000}s ease-out`;
        Object.assign(particle.style, {
            opacity: 1, // Become fully visible
            transform: 'scale(1)', // Grow to full size
            left: `${targetX}px`,
            top: `${targetY}px`
        });

        // Set a timeout to handle the particle's fade-out and removal
        setTimeout(() => {
            particle.style.opacity = 0; // Start fading out
            particle.style.transform = 'scale(0.5)'; // Shrink slightly as it fades

            // Remove the particle from the DOM once its animation and fade are complete
            setTimeout(() => {
                // Check if the parent still exists before attempting to remove
                if (crackerAnimationArea.contains(particle)) {
                    crackerAnimationArea.removeChild(particle);
                }
            }, particleMoveDuration); // Time after which the fade-out completes
        }, particleMoveDuration * 0.7); // Start fading out after 70% of its movement duration
    }

    // Function to start the continuous cracker animation loop
    function startCrackerAnimationLoop() {
        // Clear any existing interval to prevent duplicates
        if (crackerAnimationIntervalId) {
            clearInterval(crackerAnimationIntervalId);
        }

        // Call createAndAnimateCrackerParticle at a regular interval
        // Adjust the interval (e.g., 50ms) to control the density/frequency of new crackers
        crackerAnimationIntervalId = setInterval(createAndAnimateCrackerParticle, 50);
    }

    // Function to stop the continuous cracker animation loop
    function stopCrackerAnimationLoop() {
        if (crackerAnimationIntervalId) {
            clearInterval(crackerAnimationIntervalId);
            crackerAnimationIntervalId = null; // Reset the ID
        }
    }

    // --- Draggable Discount Sticker ---
    let isStickerDragging = false; // Flag to track if the sticker is currently being dragged
    let currentX; // Current X position of the mouse relative to the viewport
    let currentY; // Current Y position of the mouse relative to the viewport
    let initialX; // Initial X position of the mouse when dragging starts
    let initialY; // Initial Y position of the mouse when dragging starts
    let xOffset = 0; // Horizontal offset of the sticker
    let yOffset = 0; // Vertical offset of the sticker

    // Add event listener for mouse down on the sticker to initiate dragging
    discountSticker.addEventListener("mousedown", dragStart);

    // Add global event listeners for mouse up and mouse move
    // Using document ensures dragging continues even if the mouse leaves the sticker temporarily
    document.addEventListener("mouseup", dragEnd);
    document.addEventListener("mousemove", drag);

    // Function to handle the start of a drag operation
    function dragStart(e) {
        // Calculate initial mouse position relative to the sticker's current offset
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;

        // Check if the mousedown event occurred directly on the sticker or its child elements
        if (e.target === discountSticker || e.target.closest('#discount-sticker')) {
            isStickerDragging = true; // Set dragging flag to true
            discountSticker.style.cursor = 'grabbing'; // Change cursor to indicate dragging
        }
    }

    // Function to handle the end of a drag operation
    function dragEnd(e) {
        // Store the last known position to maintain sticker's place after drag
        initialX = currentX;
        initialY = currentY;
        isStickerDragging = false; // Reset dragging flag
        discountSticker.style.cursor = 'grab'; // Change cursor back to grab
    }

    // Function to handle the dragging motion
    function drag(e) {
        if (isStickerDragging) {
            e.preventDefault(); // Prevent default browser actions (like text selection) during drag
            // Calculate the new current mouse position relative to initial click and offset
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;

            // Update offsets for the next drag event
            xOffset = currentX;
            yOffset = currentY;

            // Apply the new position using CSS transform for smoother animation
            setTranslate(currentX, currentY, discountSticker);
        }
    }

    // Helper function to apply CSS transform
    function setTranslate(xPos, yPos, el) {
        el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
    }

    document.addEventListener('contextmenu', function (event) {
    event.preventDefault();
});
