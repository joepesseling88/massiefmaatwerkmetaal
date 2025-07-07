/**
 * MMMetaal - De Metaalzagerij
 * Main JavaScript File
 */

document.addEventListener('DOMContentLoaded', function() {
    // Preloader functionality
    initializePreloader();
    
    // Iron blocks animation removed as requested
    
    // Mobile menu toggle
    const menuButton = document.querySelector('.menu-button');
    const headerNav = document.querySelector('.header-nav');
    
    if (menuButton && headerNav) {
        menuButton.addEventListener('click', function() {
            headerNav.classList.toggle('active');
            menuButton.classList.toggle('active');
        });
    }
    
    // Language dropdown
    const languageDropdown = document.getElementById('language-dropdown');
    const languageOptions = document.querySelectorAll('.language-option');
    
    if (languageDropdown && languageOptions.length > 0) {
        // Toggle dropdown on click
        languageDropdown.addEventListener('click', function(e) {
            const dropdown = this.querySelector('.language-dropdown');
            if (dropdown) {
                dropdown.classList.toggle('active');
                e.stopPropagation();
            }
        });
        
        // Close dropdown when clicking elsewhere on the page
        document.addEventListener('click', function(e) {
            if (!languageDropdown.contains(e.target)) {
                const dropdown = languageDropdown.querySelector('.language-dropdown');
                if (dropdown && dropdown.classList.contains('active')) {
                    dropdown.classList.remove('active');
                }
            }
        });
        
        // Handle language selection
        languageOptions.forEach(option => {
            option.addEventListener('click', function(e) {
                e.preventDefault();
                const lang = this.textContent;
                const currentLang = languageDropdown.querySelector('.language-text');
                if (currentLang) {
                    currentLang.textContent = lang;
                }
                // Close the dropdown after selection
                const dropdown = languageDropdown.querySelector('.language-dropdown');
                if (dropdown) {
                    dropdown.classList.remove('active');
                }
                // Here you would typically implement language switching logic
                // For this example, we're just changing the displayed text
            });
        });
    }
    
    // Form validation
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form fields
            const nameField = document.getElementById('name');
            const companyField = document.getElementById('company');
            const emailField = document.getElementById('email');
            const phoneField = document.getElementById('phone');
            const messageField = document.getElementById('message');
            const termsCheckbox = document.getElementById('terms');
            
            // Simple validation
            let isValid = true;
            
            // Required fields validation
            if (!nameField.value.trim()) {
                highlightError(nameField);
                isValid = false;
            } else {
                removeError(nameField);
            }
            
            if (!companyField.value.trim()) {
                highlightError(companyField);
                isValid = false;
            } else {
                removeError(companyField);
            }
            
            // Email validation
            if (!emailField.value.trim() || !isValidEmail(emailField.value)) {
                highlightError(emailField);
                isValid = false;
            } else {
                removeError(emailField);
            }
            
            if (!phoneField.value.trim()) {
                highlightError(phoneField);
                isValid = false;
            } else {
                removeError(phoneField);
            }
            
            if (!termsCheckbox.checked) {
                highlightError(termsCheckbox.parentElement);
                isValid = false;
            } else {
                removeError(termsCheckbox.parentElement);
            }
            
            // If form is valid, submit it (or show success message)
            if (isValid) {
                // In a real application, you would send the form data to a server
                // For this example, we'll just show an alert
                alert('Formulier succesvol verzonden!');
                contactForm.reset();
            }
        });
    }
    
    // Helper functions for form validation
    function highlightError(element) {
        element.classList.add('error');
    }
    
    function removeError(element) {
        element.classList.remove('error');
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Scroll down arrow functionality
    const scrollDownArrow = document.querySelector('.arrow-down-indicator');
    if (scrollDownArrow) {
        scrollDownArrow.addEventListener('click', function() {
            const productsSection = document.querySelector('.products-section');
            if (productsSection) {
                productsSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
    
    // Add hover effects for product cards
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
    });
});

// Add error styling to form elements
document.addEventListener('DOMContentLoaded', function() {
    // Add CSS for error styling
    const style = document.createElement('style');
    style.textContent = `
        .error {
            border-color: #FA514A !important;
        }
        
        .form-checkbox.error {
            color: #FA514A;
        }
        
        .submit-button:hover {
            background-color: #FA514A;
            color: #F0F0F0;
            transform: translateY(-2px);
        }
        
        .tag:hover {
            background-color: #D0D0D0;
            color: #202020;
        }
    `;
    document.head.appendChild(style);
    
    // Add animation to contact form
    const contactForm = document.querySelector('.contact-form-container');
    if (contactForm) {
        window.addEventListener('scroll', function() {
            const formPosition = contactForm.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (formPosition < screenPosition) {
                contactForm.classList.add('visible');
            }
        });
        
        // Check initial position in case the form is already in view
        setTimeout(function() {
            const formPosition = contactForm.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (formPosition < screenPosition) {
                contactForm.classList.add('visible');
            }
        }, 100);
    }
});

/**
 * Preloader functionality
 * Handles the sliding bar loader animation and garage door reveal when page is loaded
 */
function initializePreloader() {
    const preloader = document.getElementById('preloader');
    
    if (!preloader) return;
    
    // Ensure preloader is visible initially
    preloader.style.display = 'flex';
    
    // Timing variables
    const minDisplayTime = 500; // 0.5 seconds minimum display time - UX friendly
    const startTime = Date.now();
    let isPageLoaded = false;
    let isDOMReady = false;
    
    // Check if DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            isDOMReady = true;
            checkAndHidePreloader();
        });
    } else {
        isDOMReady = true;
    }
    
    // Check if all resources are loaded
    if (document.readyState === 'complete') {
        isPageLoaded = true;
        checkAndHidePreloader();
    } else {
        window.addEventListener('load', function() {
            isPageLoaded = true;
            checkAndHidePreloader();
        });
    }
    
    // Safety timeout to ensure preloader doesn't stay forever
    setTimeout(function() {
        if (preloader && !preloader.classList.contains('garage-door-reveal')) {
            hidePreloader();
        }
    }, 8000); // 8 second maximum (longer to account for min display time)
    
    function checkAndHidePreloader() {
        // Wait for both DOM and resources to be ready
        if (isDOMReady && isPageLoaded) {
            const elapsedTime = Date.now() - startTime;
            const remainingTime = Math.max(0, minDisplayTime - elapsedTime);
            
            // Wait for minimum display time before hiding
            setTimeout(hidePreloader, remainingTime);
        }
    }
    
    function hidePreloader() {
        if (!preloader) return;
        
        // Add garage-door-reveal class to trigger top-to-bottom reveal animation
        preloader.classList.add('garage-door-reveal');
        
        // Remove preloader from DOM after animation completes
        setTimeout(function() {
            if (preloader && preloader.parentNode) {
                preloader.parentNode.removeChild(preloader);
            }
        }, 800); // Match CSS animation duration
    }
}
