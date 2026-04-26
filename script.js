// DOM Elements
const loadingScreen = document.getElementById('loadingScreen');
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.getElementById('contactForm');
const successMessage = document.getElementById('successMessage');

// Loading Screen - Control for seamless navigation
window.addEventListener('load', () => {
    // Check if this is the first visit or navigation from external site
    const isFirstVisit = !sessionStorage.getItem('portfolioVisited');
    
    if (isFirstVisit) {
        // Show loading screen for first visit
        sessionStorage.setItem('portfolioVisited', 'true');
        
        // Animate percentage counter
        const progressPercentage = document.querySelector('.progress-percentage');
        const loadingStatus = document.querySelector('.loading-status');
        
        let percentage = 0;
        const percentageInterval = setInterval(() => {
            percentage += Math.random() * 15 + 5;
            if (percentage >= 100) {
                percentage = 100;
                clearInterval(percentageInterval);
                if (loadingStatus) loadingStatus.textContent = 'Portfolio Ready!';
            }
            if (progressPercentage) {
                progressPercentage.textContent = Math.floor(percentage) + '%';
            }
        }, 200);
        
        // Update loading status messages
        const statusMessages = [
            'Initializing Portfolio...',
            'Loading Creative Assets...',
            'Preparing Design Showcase...',
            'Optimizing User Experience...',
            'Portfolio Ready!'
        ];
        
        let messageIndex = 0;
        const messageInterval = setInterval(() => {
            if (loadingStatus && messageIndex < statusMessages.length - 1) {
                loadingStatus.textContent = statusMessages[messageIndex];
                messageIndex++;
            } else {
                clearInterval(messageInterval);
            }
        }, 500);
        
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            initializeAnimations();
        }, 1000);
    } else {
        // Skip loading screen for navigation between pages
        loadingScreen.style.display = 'none';
        initializeAnimations();
    }
});

// Mobile Navigation Toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Active Navigation Link
function setActiveNavLink() {
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop() || 'index.html';
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkPage = link.getAttribute('href').split('/').pop();
        if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// Navbar Scroll Effect
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        navbar.style.boxShadow = 'var(--shadow-soft)';
    } else {
        navbar.style.boxShadow = 'var(--shadow-medium)';
    }
    
    lastScroll = currentScroll;
});

// Scroll Reveal Animation
function initializeAnimations() {
    const reveals = document.querySelectorAll('.reveal');
    
    function reveal() {
        reveals.forEach(element => {
            const windowHeight = window.innerHeight;
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    }
    
    reveal();
    window.addEventListener('scroll', reveal);
    
    // Animate skill bars
    const skillBars = document.querySelectorAll('.skill-progress');
    const animateSkillBars = () => {
        skillBars.forEach(bar => {
            const rect = bar.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible && !bar.style.width) {
                const progress = bar.getAttribute('data-progress');
                setTimeout(() => {
                    bar.style.width = progress + '%';
                }, 200);
            }
        });
    };
    
    animateSkillBars();
    window.addEventListener('scroll', animateSkillBars);
}

// Typing Effect for Hero Name (Optional Enhancement)
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect on home page
const nameElement = document.querySelector('.name');
if (nameElement && window.location.pathname.includes('index.html')) {
    setTimeout(() => {
        typeWriter(nameElement, 'Biruktawit Amde', 150);
    }, 1500);
}

// Form Validation and Submission
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Reset previous errors
        clearErrors();
        
        // Get form values
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        
        // Validate form
        let isValid = true;
        
        if (name === '') {
            showError('nameError', 'Please enter your name');
            isValid = false;
        }
        
        if (email === '') {
            showError('emailError', 'Please enter your email');
            isValid = false;
        } else if (!isValidEmail(email)) {
            showError('emailError', 'Please enter a valid email address');
            isValid = false;
        }
        
        if (message === '') {
            showError('messageError', 'Please enter your message');
            isValid = false;
        } else if (message.length < 10) {
            showError('messageError', 'Message must be at least 10 characters long');
            isValid = false;
        }
        
        if (isValid) {
            // Show loading state
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="btn-text">Sending...</span>';
            submitBtn.disabled = true;
            
            // Simulate form submission (replace with actual form submission)
            setTimeout(() => {
                // Show success message
                successMessage.classList.add('show');
                contactForm.reset();
                
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Hide success message after 5 seconds
                setTimeout(() => {
                    successMessage.classList.remove('show');
                }, 5000);
            }, 2000);
        }
    });
    
    // Real-time validation
    const inputs = contactForm.querySelectorAll('.form-input');
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            validateField(input);
        });
        
        input.addEventListener('input', () => {
            const errorElement = document.getElementById(input.id + 'Error');
            if (errorElement.classList.contains('show')) {
                validateField(input);
            }
        });
    });
}

function validateField(input) {
    const value = input.value.trim();
    const errorElement = document.getElementById(input.id + 'Error');
    
    clearError(errorElement);
    
    switch (input.id) {
        case 'name':
            if (value === '') {
                showError('nameError', 'Please enter your name');
                return false;
            }
            break;
        case 'email':
            if (value === '') {
                showError('emailError', 'Please enter your email');
                return false;
            } else if (!isValidEmail(value)) {
                showError('emailError', 'Please enter a valid email address');
                return false;
            }
            break;
        case 'message':
            if (value === '') {
                showError('messageError', 'Please enter your message');
                return false;
            } else if (value.length < 10) {
                showError('messageError', 'Message must be at least 10 characters long');
                return false;
            }
            break;
    }
    
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
}

function clearError(errorElement) {
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.classList.remove('show');
    }
}

function clearErrors() {
    const errorElements = document.querySelectorAll('.form-error');
    errorElements.forEach(element => {
        clearError(element);
    });
}

// Smooth Scroll for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Parallax Effect for Hero Section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroContent = document.querySelector('.hero-content');
    const shapes = document.querySelectorAll('.shape');
    
    if (heroContent) {
        heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
        heroContent.style.opacity = 1 - scrolled / 600;
    }
    
    shapes.forEach((shape, index) => {
        const speed = 0.5 + (index * 0.1);
        shape.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Project Card Hover Effects
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-15px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Intersection Observer for Advanced Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe elements for animations
document.querySelectorAll('.reveal, .project-card, .skill-category').forEach(el => {
    observer.observe(el);
});

// Add CSS for animation-in class
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        animation: slideInUp 0.6s ease forwards;
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Lazy Loading for Images
document.querySelectorAll('img').forEach(img => {
    if (!img.hasAttribute('loading')) {
        img.setAttribute('loading', 'lazy');
    }
});

// Dynamic Year in Footer
const footerYear = document.querySelector('.footer-text p');
if (footerYear) {
    const currentYear = new Date().getFullYear();
    footerYear.innerHTML = `&copy; ${currentYear} All rights reserved.`;
}

// Initialize
setActiveNavLink();

// Add some interactive polish
document.addEventListener('DOMContentLoaded', () => {
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.cta-button, .submit-btn, .project-link');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add ripple styles
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        .cta-button, .submit-btn, .project-link {
            position: relative;
            overflow: hidden;
        }
        
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.5);
            transform: scale(0);
            animation: ripple-animation 0.6s ease-out;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);
});

// Console Easter Egg
console.log('%c Welcome to my Portfolio! ', 'background: linear-gradient(135deg, #00458b, #3fd2c7); color: white; font-size: 16px; padding: 10px; border-radius: 5px;');
