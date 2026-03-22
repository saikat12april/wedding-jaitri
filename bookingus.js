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
            if (headerLoadingBar) {
                headerLoadingBar.classList.remove('active', 'done');
                if (window.loadingBarTimeout) {
                    clearTimeout(window.loadingBarTimeout);
                    window.loadingBarTimeout = null;
                }
            }
        });
    }

    function handleNavLinkClick(e) {
        const clickedLink = e.target.closest('a');
        if (clickedLink) {
            e.preventDefault();
            if (headerLoadingBar) {
                headerLoadingBar.classList.remove('done');
                headerLoadingBar.classList.add('active');
                if (window.loadingBarTimeout) {
                    clearTimeout(window.loadingBarTimeout);
                    window.loadingBarTimeout = null;
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
                if (socialIcons) socialIcons.classList.remove('active');
            }
        }
    }

    if (navLinks) {
        navLinks.addEventListener('click', handleNavLinkClick);
    }

    // --- Booking Section Specific JavaScript ---
    const bookingForm = document.getElementById('bookingForm');
    const invoiceOutput = document.getElementById('invoiceOutput');
    const bookingIdDisplay = document.getElementById('bookingIdDisplay');
    const downloadInvoiceBtn = document.getElementById('downloadInvoiceBtn');
    const successMessageOverlay = document.getElementById('successMessageOverlay');
    const bookingIdDisplayCustom = document.getElementById('bookingIdDisplayCustom');
    const typeOfShootSelect = document.getElementById('typeOfShoot');
    const estimatedBudgetInput = document.getElementById('estimatedBudget');

    let lastSubmittedFormData = null;
    let lastGeneratedBookingId = null;

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

    const packageDetails = {
        "PACKAGE I: Normal (Groom Side)": ["1 Photographer + 1 Traditional Videography","1 Standard Photobook (12x36 in, 20-25 sheets)","Full HD Videography (27-35 minutes)","125 edited & color-corrected high-resolution images"],
        "PACKAGE: Normal (Bride Side)": ["1 Photographer + 1 Traditional Videography","2 Premium Pro CANVERA Photobooks (12x36 in, 20 sheets)","HD Wedding Video (35-45 minutes)","50 edited & color-corrected high-resolution images"],
        "PACKAGE I: Standard (Groom Side)": ["2 Photographers + 1 Cinematographer","2 Standard Canvera Photobooks (12x36 in, 20-25 sheets)","Full HD Wedding Film (27-35 minutes)","125 edited & color-corrected high-resolution images"],
        "PACKAGE I: Standard (Bride Side)": ["2 Photographers + 1 Cinematographer","2 Standard Canvera Photobooks (12x36 in, 20-23 sheets)","Full HD Wedding Film (27-35 minutes)","125 edited & color-corrected high-resolution images"],
        "PACKAGE I: Standard (Both Side)": ["2 Photographers + 1 Cinematographer","2 Standard Canvera Photobooks (12x36 in, 21-25 sheets)","Full HD Wedding Film (27-37 minutes)","130 edited & color-corrected high-resolution images"],
        "PACKAGE II: Best (Groom Side)": ["2 Photographers + 1 Cinematographer","2 Premium CANVERA Photobooks (12x36 in, 22-27 sheets)","4K Wedding Film (30-35 minutes)","Instagram reels","Pre-wedding photography session (complimentary)","Cinematic wedding film","150 edited & color-corrected high-resolution images"],
        "PACKAGE II: Best (Bride Side)": ["2 Photographers + 1 Cinematographer","2 Premium CANVERA Photobooks (12x36 in, 20-25 sheets)","4K Wedding Film (30-35 minutes)","Instagram reels","Pre-wedding photography session (complimentary)","Cinematic wedding film","150 edited & color-corrected high-resolution images"],
        "PACKAGE II: Gold (Both Side)": ["2 Photographers + 1 Cinematographer","2 Premium CANVERA Photobooks (12x36 in, 25-25 sheets)","4K Wedding Film (30-35 minutes)","Wedding trailer / Instagram reels","Cinematic wedding film","Pre-wedding photography session (complimentary)","150 edited & color-corrected high-resolution images"],
        "PACKAGE III: Better (Groom Side)": ["2 Photographers + 1 Cinematographer","1 Premium CANVERA Photobook (12x36 in, 25-30 sheets)","4K Wedding Film (25-35 minutes)","Wedding trailer / Instagram reels","200 edited & color-corrected high-resolution images"],
        "PACKAGE III: Better (Bride Side)": ["2 Photographers + 1 Cinematographer","1 Premium CANVERA Photobook (12x36 in, 25-30 sheets)","4K Wedding Film (25-35 minutes)","Wedding trailer / Instagram reels","200 edited & color-corrected high-resolution images"],
        "PACKAGE III: Platinum (Both Side)": ["2 Photographers + 1 Cinematographer","2 Premium CANVERA Photobooks (12x36 in, 25-30 sheets)","4K Wedding Film (25-35 minutes)","Wedding trailer / Instagram reels","Pre-wedding photography session","Cinematic film with drone coverage","200 edited & color-corrected high-resolution images"],
        "PACKAGE IV: Pro (Both Side)": ["2 Photographers + 1 Cinematographer","2 Premium Pro CANVERA Photobooks (12x36 in, 25-32 sheets)","4K Wedding Film (25-35 minutes)","Wedding trailer / Instagram reels","Pre-wedding photography session","Cinematic film with drone coverage","Instant photo printing at wedding or reception","250 edited & color-corrected high-resolution images"],
        "Engagement": ["Engagement Photography Services"],
        "Anniversary": ["Anniversary Photography Services"],
        "Birthday": ["Birthday Photography Services"],
        "Other": ["Custom Photography Services"]
    };

    function updateEstimatedBudget() {
        const selectedType = typeOfShootSelect.value;
        const budget = shootBudgets[selectedType] || 0;
        estimatedBudgetInput.value = budget;
    }

    typeOfShootSelect.addEventListener('change', updateEstimatedBudget);
    updateEstimatedBudget();

    function generateBookingId() {
        const timestamp = new Date().getTime();
        const randomNum = Math.floor(Math.random() * 100000);
        return `WJ-${timestamp}-${randomNum}`;
    }

    async function generateInvoicePDF(formData, bookingId) {
        if (typeof window.jspdf === 'undefined') {
            alert('PDF generation failed. Please try again later.');
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        const invoiceDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
        const selectedShootType = formData.get('typeOfShoot');
        const subtotal = parseFloat(formData.get('estimatedBudget'));
        const totalAmount = subtotal;

        let y = 20;

        const logoImg = new Image();
        logoImg.src = 'Logo New 1 2025 copy.png';

        await new Promise(resolve => {
            logoImg.onload = () => { doc.addImage(logoImg, 'PNG', 15, y, 30, 30, undefined, 'MEDIUM'); resolve(); };
            logoImg.onerror = () => { resolve(); };
        });
        y += 35;

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
        y += 6; doc.text("V162-Ballavpur,West Bengal-721101", 15, y);
        y += 4; doc.text("Email: wjaitri@gmail.com", 15, y);
        y += 4; doc.text("Phone: +91 7679724309 / 03222368763", 15, y);
        y += 12;

        doc.setDrawColor(153, 0, 51);
        doc.setLineWidth(0.5);
        doc.line(15, y - 5, 195, y - 5);
        y += 5;

        doc.setFontSize(14); doc.setTextColor(153, 0, 51);
        doc.text("Bill To:", 15, y);
        doc.setFontSize(10); doc.setTextColor(0, 0, 0);
        y += 6; doc.text(formData.get('clientName'), 15, y);
        y += 4; doc.text(formData.get('clientEmail'), 15, y);
        y += 4; doc.text(formData.get('clientPhone'), 15, y);
        y += 12;

        doc.line(15, y - 5, 195, y - 5);
        y += 5;

        doc.setFillColor(240, 240, 240);
        doc.rect(15, y, 180, 10, 'F');
        doc.setFontSize(12); doc.setFont(undefined, 'bold');
        doc.text("Description", 20, y + 5);
        doc.text("Amount (Rs.)", 175, y + 5, { align: 'right' });
        doc.setFont(undefined, 'normal');
        y += 10;

        doc.text(`${selectedShootType} Service`, 20, y + 4);
        doc.text(`${subtotal.toFixed(2)}`, 175, y + 4, { align: 'right' });
        y += 10;

        const details = packageDetails[selectedShootType];
        if (details && details.length > 0) {
            doc.setFontSize(9); doc.setTextColor(50, 50, 50);
            details.forEach(item => {
                if (y + 5 > doc.internal.pageSize.height - 30) { doc.addPage(); y = 20; }
                doc.text(`- ${item}`, 25, y); y += 5;
            });
            doc.setTextColor(0, 0, 0); doc.setFontSize(10);
        } else {
            doc.text("No detailed description available for this service.", 20, y + 7);
            y += 10;
        }

        y += 8;
        doc.text(`Event Date: ${formData.get('eventDate')}`, 20, y);
        y += 6;
        doc.text(`Shoot Location: ${formData.get('shootLocation')}`, 20, y);
        y += 15;

        doc.line(15, y - 5, 195, y - 5);
        y += 8;

        doc.setFont(undefined, 'bold');
        doc.text("Subtotal:", 140, y + 7, { align: 'right' });
        doc.text(`${totalAmount.toFixed(2)}`, 175, y + 7, { align: 'right' });
        doc.setFont(undefined, 'normal');
        y += 7;

        doc.line(140, y + 2, 195, y + 2);
        y += 5;

        doc.setFontSize(16);
        doc.setFillColor(246, 246, 34);
        doc.rect(15, y + 5, 180, 15, 'F');
        doc.setTextColor(153, 0, 51); doc.setFont(undefined, 'bold');
        doc.text("TOTAL:", 140, y + 15, { align: 'right' });
        doc.text(`Rs. ${totalAmount.toFixed(2)}`, 175, y + 15, { align: 'right' });
        doc.setFont(undefined, 'normal'); doc.setTextColor(0, 0, 0);
        y += 25;

        doc.setFontSize(12);
        doc.text("Thank you for your booking with Wedding Jaitri!", 105, y, { align: 'center' });
        y += 8;
        doc.text("We look forward to capturing your iconic cinematic wedding.", 105, y, { align: 'center' });
        y += 15;

        doc.setFontSize(8);
        doc.text("Note: This is an estimated invoice. Final charges may vary based on specific requirements and services.", 15, y);
        y += 4;
        doc.text("Payment terms: 25% advance, 75% before delivery of final output.", 15, y);

        doc.save(`WeddingJaitri_Invoice_${bookingId}.pdf`);
    }

    bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitButton = bookingForm.querySelector('.submit-button');
        submitButton.disabled = true;
        submitButton.textContent = 'Submitting...';

        const formData = new FormData(bookingForm);
        const bookingId = generateBookingId();
        lastSubmittedFormData = new FormData(bookingForm);
        lastGeneratedBookingId = bookingId;

        formData.append('Booking ID', bookingId);
        formData.set('typeOfShoot', typeOfShootSelect.value);

        try {
            const response = await fetch("https://api.web3forms.com/submit", { method: "POST", body: formData });
            const data = await response.json();

            if (data.success) {
                bookingForm.style.display = 'none';
                bookingIdDisplayCustom.textContent = bookingId;
                successMessageOverlay.style.display = 'flex';
                successMessageOverlay.classList.add('show');

                setTimeout(async () => {
                    successMessageOverlay.classList.remove('show');
                    setTimeout(() => { successMessageOverlay.style.display = 'none'; }, 500);
                    await generateInvoicePDF(lastSubmittedFormData, lastGeneratedBookingId);
                    invoiceOutput.style.display = 'block';
                    bookingIdDisplay.textContent = lastGeneratedBookingId;
                }, 2000);
            } else {
                alert("There was an issue submitting your booking. Please try again.");
                bookingForm.style.display = 'block';
            }
        } catch (error) {
            alert("A network error occurred. Please check your internet connection and try again.");
            bookingForm.style.display = 'block';
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Submit & Get Invoice';
        }
    });

    downloadInvoiceBtn.addEventListener('click', async () => {
        if (lastSubmittedFormData && lastGeneratedBookingId) {
            await generateInvoicePDF(lastSubmittedFormData, lastGeneratedBookingId);
        } else {
            alert("Booking data not found. Please submit the form first.");
        }
    });
});

document.addEventListener('contextmenu', function (event) {
    event.preventDefault();
});
