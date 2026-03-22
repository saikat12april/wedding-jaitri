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

document.addEventListener('DOMContentLoaded', () => {
    // Array of review objects for Wedding Jaitri.
    // Each object contains the reviewer's name (Bengali transliterated with script),
    // their rating (out of 5 stars), the platform where the review was left,
    // and the review content itself.
    const reviews = [
        {
            name: 'Priyanka Basu (প্রিয়াঙ্কা বসু)',
            rating: 5,
            platform: 'Google Maps',
            content: "Wedding Jaitri made our dream wedding a reality! From the initial consultation to the final execution, their team was incredibly professional and attentive to every detail. We couldn't have asked for a more seamless and beautiful day. Highly recommend!"
        },
        {
            name: 'Rahul Chakraborty (রাহুল চক্রবর্তী)',
            rating: 4, // This review has 4 stars
            platform: 'Facebook',
            content: "Fantastic service! The decor was breathtaking, and the coordination was mostly flawless. Our guests were so impressed. Thank you, Wedding Jaitri, for making our special day memorable."
        },
        {
            name: 'Ananya Saha (অনন্যা সাহা)',
            rating: 5,
            platform: 'Google Maps',
            content: "We were so stressed about wedding planning, but Wedding Jaitri took all the pressure off. Their creative ideas and meticulous planning ensured everything ran perfectly. We felt truly celebrated and enjoyed every moment."
        },
        {
            name: 'Sourav Das (সৌরভ দাস)',
            rating: 3, // This review has 3 stars
            platform: 'Facebook',
            content: "The team at Wedding Jaitri was helpful. They listened to our vision, though some aspects didn't quite match our initial expectations. Overall, a decent experience."
        },
        {
            name: 'Ishita Roy (ইশিতা রায়)',
            rating: 5,
            platform: 'Google Maps',
            content: "Choosing Wedding Jaitri was the best decision we made for our wedding. Their dedication and passion shine through in their work. We felt like family, and they made sure our big day was everything we dreamed of and more."
        },
        {
            name: 'Arnab Mukherjee (অর্ণব মুখোপাধ্যায়)',
            rating: 4, // This review has 4 stars
            platform: 'Facebook',
            content: "A great experience! The event was managed with good efficiency. There were a couple of minor points, but overall, Wedding Jaitri handled it very well. We're happy with the outcome!"
        },
        {
            name: 'Rina Ghosh (রিনা ঘোষ)',
            rating: 5,
            platform: 'Google Maps',
            content: "Our wedding was a fairytale, all thanks to Wedding Jaitri. Their team is incredibly talented and genuinely cares about making your day special. Every little detail was perfect, creating memories we'll cherish forever."
        },
        {
            name: 'Debojyoti Pal (দেবজ্যোতি পাল)',
            rating: 3, // This review has 3 stars
            platform: 'Facebook',
            content: "Professional and creative. Wedding Jaitri did a good job transforming our venue. Communication was generally fine, but sometimes there were delays in response. It was an okay experience."
        },
        {
            name: 'Aparna Sen (অপর্ণা সেন)',
            rating: 5,
            platform: 'Google Maps',
            content: "We are immensely grateful to Wedding Jaitri for their outstanding work. They understood our cultural traditions perfectly and incorporated them beautifully. It was a joyous celebration, executed flawlessly."
        },
        {
            name: 'Subrata Mondal (সুব্রত মন্ডল)',
            rating: 4, // This review has 4 stars
            platform: 'Facebook',
            content: "From the grand entrance to the smallest floral arrangement, most things were meticulously planned and executed by Wedding Jaitri. They made our wedding a happy event. Can recommend!"
        },
        {
            name: 'Puja Bhattacharya (পূজা ভট্টাচার্য)',
            rating: 4,
            platform: 'Google Maps',
            content: "Overall, a wonderful experience. The team was very responsive and helpful. There were a couple of minor hiccups, but they were quickly resolved. We appreciate their hard work and dedication."
        },
        {
            name: 'Prosenjit Dey (প্রসেনজিৎ দে)',
            rating: 5,
            platform: 'Facebook',
            content: "Wedding Jaitri provided exceptional service. They handled unexpected challenges with ease and ensured our wedding day was smooth and memorable. Their commitment to client satisfaction is truly admirable."
        }
    ];

    // Get the container element where reviews will be displayed
    const reviewsContainer = document.getElementById('reviewsContainer');

    // Loop through each review object in the 'reviews' array
    reviews.forEach(review => {
        // Create a new div element for each review card
        const reviewCard = document.createElement('div');
        reviewCard.classList.add('review-card'); // Add the 'review-card' class for styling

        // Generate the HTML for star icons based on the review's rating
        let starsHtml = '';
        for (let i = 0; i < 5; i++) {
            if (i < review.rating) {
                starsHtml += '<i class="fas fa-star"></i>'; // Add a filled star icon
            } else {
                starsHtml += '<i class="far fa-star"></i>'; // Add an empty star icon
            }
        }

        // Determine the appropriate Font Awesome icon and class for the platform logo
        let platformLogoClass = '';
        let platformIcon = '';
        if (review.platform === 'Google Maps') {
            platformLogoClass = 'google-maps'; // Specific class for Google Maps styling
            platformIcon = 'fa-google'; // Google icon
        } else if (review.platform === 'Facebook') {
            platformLogoClass = 'facebook'; // Specific class for Facebook styling
            platformIcon = 'fa-facebook'; // Facebook icon
        }

        // Set the inner HTML of the review card using a template literal
        // This includes the reviewer's name, star rating, review content,
        // platform text, and the corresponding Font Awesome logo.
        reviewCard.innerHTML = `
            <div class="review-header">
                <span class="reviewer-name">${review.name}</span>
                <div class="star-rating">${starsHtml}</div>
            </div>
            <p class="review-content">${review.content}</p>
            <div class="review-footer">
                <span class="platform-text">${review.platform}</span>
                <i class="platform-logo ${platformLogoClass} fab ${platformIcon}"></i>
            </div>
        `;

        // Append the newly created review card to the reviews container
        reviewsContainer.appendChild(reviewCard);
    });
});

document.addEventListener('contextmenu', function (event) {
    event.preventDefault();
});
