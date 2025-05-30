/**
 * MMMetaal - De Metaalzagerij
 * Main JavaScript File
 */

document.addEventListener('DOMContentLoaded', function() {
    // Add parallax effect to iron blocks
    const ironBlocks = document.querySelector('.iron-blocks');
    if (ironBlocks) {
        window.addEventListener('scroll', function() {
            const scrollPosition = window.scrollY;
            if (scrollPosition < 1000) { // Only apply effect when near the header
                ironBlocks.style.transform = `rotate(${scrollPosition * 0.02}deg)`;
            }
        });
    }
    
    // Mobile menu toggle
    const menuButton = document.querySelector('.menu-button');
    const headerNav = document.querySelector('.header-nav');
    
    if (menuButton && headerNav) {
        menuButton.addEventListener('click', function() {
            headerNav.classList.toggle('active');
            menuButton.classList.toggle('active');
        });
    }
    
    // Language toggle
    const languageToggle = document.getElementById('language-toggle');
    const currentLanguage = document.getElementById('current-language');
    const languageOptions = document.querySelectorAll('.language-option');
    
    if (languageToggle && currentLanguage && languageOptions.length > 0) {
        languageOptions.forEach(option => {
            option.addEventListener('click', function() {
                const lang = this.getAttribute('data-lang');
                currentLanguage.textContent = lang;
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
