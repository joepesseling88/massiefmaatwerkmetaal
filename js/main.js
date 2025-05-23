/**
 * MMMetaal - De Metaalzagerij
 * Main JavaScript File
 */

document.addEventListener('DOMContentLoaded', function() {
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
    const scrollDownArrow = document.querySelector('.scroll-down-arrow');
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
    `;
    document.head.appendChild(style);
});
