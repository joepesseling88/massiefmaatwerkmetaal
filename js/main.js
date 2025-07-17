/**
 * MMMetaal - De Metaalzagerij
 * Main JavaScript File
 */

// Register GSAP plugins
gsap.registerPlugin(InertiaPlugin, SplitText, ScrollTrigger);

// Momentum-based hover effect for iron_shape hero image
function initMomentumBasedHover() {
  // If this device can't hover with a fine pointer, stop here
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    console.log('Momentum hover effect disabled: not a desktop device');
    return;
  }
  
  console.log('Momentum hover effect initialized for desktop');
  
  // Debug mode - set to false for subtle production effect
  const DEBUG_MODE = false;
  
  // Add the GSAP scripts if they're not already loaded
  if (!window.gsap || !window.InertiaPlugin) {
    console.error('GSAP or InertiaPlugin not loaded. Adding required scripts...');
    
    // Add GSAP if not present
    if (!window.gsap) {
      const gsapScript = document.createElement('script');
      gsapScript.src = 'https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js';
      document.head.appendChild(gsapScript);
    }
    
    // Add InertiaPlugin if not present
    if (!window.InertiaPlugin) {
      const inertiaScript = document.createElement('script');
      inertiaScript.src = 'https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/InertiaPlugin.min.js';
      document.head.appendChild(inertiaScript);
      
      // Wait for scripts to load before continuing
      inertiaScript.onload = function() {
        console.log('GSAP scripts loaded, initializing effect...');
        initMomentumBasedHover();
      };
      
      return; // Exit and wait for scripts to load
    }
  }
  
  // Configuration (tweak these for feel)
  const xyMultiplier       = 8;   // multiplies pointer velocity for x/y movement (extremely subtle)
  const rotationMultiplier = 5;   // multiplies normalized torque for rotation speed (extremely subtle)
  const inertiaResistance  = 220; // higher = stops sooner (very short effect duration)

  // Pre-build clamp functions for performance
  const clampXY  = gsap.utils.clamp(-1080, 1080);
  const clampRot = gsap.utils.clamp(-60, 60);

  // Initialize each root container
  document.querySelectorAll('[data-momentum-hover-init]').forEach(root => {
    let prevX = 0, prevY = 0;
    let velX  = 0, velY  = 0;
    let rafId = null;

    // Track pointer velocity (throttled to RAF)
    root.addEventListener('mousemove', e => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        velX = e.clientX - prevX;
        velY = e.clientY - prevY;
        prevX = e.clientX;
        prevY = e.clientY;
        rafId = null;
      });
    });

    // Attach hover inertia to each child element
    root.querySelectorAll('[data-momentum-hover-element]').forEach(el => {
      // Add visual indicator for hover state
      el.addEventListener('mouseenter', (e) => {
        const target = el.querySelector('[data-momentum-hover-target]');
        if (target) {
          // Almost imperceptible glow effect
          target.style.filter = 'drop-shadow(0 0 5px rgba(255, 255, 255, 0.15))';
          target.style.transition = 'filter 0.7s ease';
          
          // Extremely subtle scale effect
          target.style.transform = 'scale(1.005)';
          target.style.transition = 'transform 0.7s ease, filter 0.7s ease';
          
          console.log('Hover state activated on iron_shape');
          
          // Immediately trigger the effect on mouseenter with simulated velocity
          // This ensures the effect works even without mouse movement
          if (DEBUG_MODE) {
            // Create a simulated velocity based on mouse position
            const rect = target.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            // Direction from center to mouse
            const dirX = e.clientX - centerX;
            const dirY = e.clientY - centerY;
            
            // Normalize and scale for a good initial velocity
            const length = Math.sqrt(dirX * dirX + dirY * dirY) || 1;
            const normX = dirX / length;
            const normY = dirY / length;
            
            // Extremely subtle immediate effect with the simulated velocity
            gsap.to(target, {
              x: normX * 4,
              y: normY * 4,
              rotation: normX * normY * 1,
              duration: 0.9,
              ease: "power1.out",
              onComplete: () => {
                // Return to center with inertia
                gsap.to(target, {
                  x: 0,
                  y: 0,
                  rotation: 0,
                  duration: 0.6,
                  ease: "power2.out"
                });
              }
            });
            
            console.log('Debug mode: Immediate effect triggered');
          }
        }
      });
      
      el.addEventListener('mouseleave', () => {
        const target = el.querySelector('[data-momentum-hover-target]');
        if (target) {
          // Remove the glow effect
          target.style.filter = '';
          // Reset the scale
          target.style.transform = '';
          console.log('Hover state deactivated on iron_shape');
        }
      });
      
      // Apply effect on both mouseenter and mousemove for better responsiveness
      const applyEffect = e => {
        const target = el.querySelector('[data-momentum-hover-target]');
        if (!target) return;

        // Compute offset from center to pointer
        const { left, top, width, height } = target.getBoundingClientRect();
        const centerX = left + width / 2;
        const centerY = top + height / 2;
        const offsetX = e.clientX - centerX;
        const offsetY = e.clientY - centerY;

        // For mouseenter without velocity, create some initial velocity based on position
        if (Math.abs(velX) < 0.5 && Math.abs(velY) < 0.5) {
          velX = offsetX * 0.05;
          velY = offsetY * 0.05;
        }

        // Compute raw torque (px²/frame)
        const rawTorque = offsetX * velY - offsetY * velX;

        // Normalize torque so rotation ∝ pointer speed (deg/sec)
        const leverDist    = Math.hypot(offsetX, offsetY) || 1;
        const angularForce = rawTorque / leverDist;

        // Calculate and clamp velocities
        const velocityX        = clampXY(velX * xyMultiplier);
        const velocityY        = clampXY(velY * xyMultiplier);
        const rotationVelocity = clampRot(angularForce * rotationMultiplier);

        // Apply GSAP inertia tween
        gsap.to(target, {
          inertia: {
            x:        { velocity: velocityX,        end: 0 },
            y:        { velocity: velocityY,        end: 0 },
            rotation: { velocity: rotationVelocity, end: 0 },
            resistance: inertiaResistance
          },
          onStart: () => {
            console.log('Momentum hover effect triggered', { velocityX, velocityY, rotationVelocity });
            
            if (DEBUG_MODE) {
              // Add a visual indicator that the effect is active
              const effectIndicator = document.createElement('div');
              effectIndicator.className = 'momentum-effect-indicator';
              effectIndicator.style.position = 'fixed';
              effectIndicator.style.top = '20px';
              effectIndicator.style.right = '20px';
              effectIndicator.style.background = 'rgba(0, 255, 0, 0.5)';
              effectIndicator.style.color = 'white';
              effectIndicator.style.padding = '5px 10px';
              effectIndicator.style.borderRadius = '5px';
              effectIndicator.style.zIndex = '9999';
              effectIndicator.style.fontFamily = 'sans-serif';
              effectIndicator.style.fontSize = '12px';
              effectIndicator.textContent = 'Momentum Effect Active';
              
              // Remove any existing indicators
              const existingIndicator = document.querySelector('.momentum-effect-indicator');
              if (existingIndicator) {
                existingIndicator.remove();
              }
              
              document.body.appendChild(effectIndicator);
              
              // Remove the indicator after 2 seconds
              setTimeout(() => {
                if (effectIndicator.parentNode) {
                  effectIndicator.remove();
                }
              }, 2000);
              
              // No outline in production mode
            }
          }
        });
      };

      // Apply effect on mouseenter
      el.addEventListener('mouseenter', applyEffect);
      
      // Also apply effect on mousemove for continuous updates
      el.addEventListener('mousemove', e => {
        // Apply on any mousemove for better responsiveness
        applyEffect(e);
      });
    });
  });
}


// Masked text reveal animation for descriptions only
function initMaskTextScrollReveal() {
  // Wait for fonts to load for better text splitting
  document.fonts.ready.then(function() {
    // Make header text immediately visible without animation
    document.querySelectorAll('[data-split="heading"]').forEach(heading => {
      // Simply make the heading visible without animation
      gsap.set(heading, { autoAlpha: 1 });
    });
    
    // Handle scroll-triggered animations (section descriptions)
    document.querySelectorAll('[data-split="description"]').forEach(description => {
      // Find the split type, the default is 'lines'
      const type = description.dataset.splitReveal || 'lines';
      const typesToSplit =
        type === 'lines' ? ['lines'] :
        type === 'words' ? ['lines','words'] :
        ['lines','words','chars'];
      
      // Reset CSS visibility here to prevent FOUC
      gsap.set(description, { autoAlpha: 1 });
      
      // Split the text
      SplitText.create(description, {
        type: typesToSplit.join(', '), // split into required elements
        mask: 'lines', // wrap each line in an overflow:hidden div
        autoSplit: true,
        linesClass: 'line',
        wordsClass: 'word',
        charsClass: 'letter',
        onSplit: function(instance) {
          const targets = instance[type]; // Register animation targets
          
          // Configuration for different split types
          const splitConfig = {
            lines: { duration: 0.8, stagger: 0.08 },
            words: { duration: 0.6, stagger: 0.06 },
            chars: { duration: 0.4, stagger: 0.01 }
          };
          
          const config = splitConfig[type]; // Find matching duration and stagger
          
          // Create the animation with scroll trigger
          return gsap.from(targets, {
            yPercent: 110,
            duration: config.duration,
            stagger: config.stagger,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: description,
              start: 'top 80%',
              once: true
            }
          });
        }
      });
    });
    
    console.log('Masked text reveal animations initialized');
  });
}

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Momentum Based Hover (Inertia) - desktop only
    initMomentumBasedHover();
    
    // Initialize Masked Text Reveal Animation
    initMaskTextScrollReveal();
    
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
