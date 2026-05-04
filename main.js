// Header Scroll Effect
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Mobile Navigation Toggle
const mobileToggle = document.getElementById('mobile-toggle');
const navLinks = document.getElementById('nav-links');

mobileToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileToggle.querySelector('i').classList.toggle('ri-menu-line');
    mobileToggle.querySelector('i').classList.toggle('ri-close-line');
});

// Smooth Scroll for Navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            // Close mobile menu if open
            navLinks.classList.remove('active');
            mobileToggle.querySelector('i').classList.add('ri-menu-line');
            mobileToggle.querySelector('i').classList.remove('ri-close-line');

            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Scroll Reveal Animation (Simple)
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('reveal');
        }
    });
}, observerOptions);

document.querySelectorAll('section, .card, .comparison-image, .product-card').forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "all 0.8s ease-out";
    observer.observe(el);
});

// Create styles for reveal class dynamically
const revealStyle = document.createElement('style');
revealStyle.innerHTML = `
    .reveal {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
    
    @media (max-width: 768px) {
        .nav-links.active {
            display: flex;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            background: rgba(13, 2, 2, 0.98); /* Updated to match new dark red theme */
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 999;
        }
        
        .nav-links.active li {
            font-size: 1.5rem;
            margin-bottom: 2rem;
        }
    }
`;
document.head.appendChild(revealStyle);

// Secure Contact Form Handling (Production - Web3Forms)
const contactForm = document.getElementById('contact-form');
const formFeedback = document.getElementById('form-feedback');

// Simple client-side rate limiter
let lastSubmitTime = 0;
const RATE_LIMIT_MS = 30000; // 30 seconds between submissions

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Rate limiting check
        const now = Date.now();
        if (now - lastSubmitTime < RATE_LIMIT_MS) {
            const waitSec = Math.ceil((RATE_LIMIT_MS - (now - lastSubmitTime)) / 1000);
            formFeedback.textContent = `Veuillez patienter ${waitSec}s avant de renvoyer.`;
            formFeedback.className = 'form-feedback error';
            formFeedback.style.display = 'block';
            return;
        }

        const submitBtn = document.getElementById('submit-btn');
        const originalContent = submitBtn.innerHTML;

        // Disable button to prevent double submission
        submitBtn.innerHTML = '<span>Envoi en cours...</span><i class="ri-loader-4-line ri-spin"></i>';
        submitBtn.disabled = true;
        formFeedback.className = 'form-feedback';
        formFeedback.style.display = 'none';

        try {
            const formData = new FormData(contactForm);

            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json'
                },
                body: formData
            });

            const result = await response.json();

            if (response.ok && result.success) {
                lastSubmitTime = Date.now();
                formFeedback.textContent = 'Votre demande a été envoyée avec succès. Nous vous contacterons rapidement.';
                formFeedback.className = 'form-feedback success';
                contactForm.reset();
            } else {
                throw new Error(result.message || 'Erreur lors de l\'envoi.');
            }
        } catch (error) {
            formFeedback.textContent = 'Erreur: Impossible d\'envoyer le message. Veuillez réessayer ou nous contacter par téléphone.';
            formFeedback.className = 'form-feedback error';
            console.error('Form submission error:', error);
        } finally {
            formFeedback.style.display = 'block';
            submitBtn.innerHTML = originalContent;
            submitBtn.disabled = false;

            // Auto hide success message after 8 seconds
            if (formFeedback.classList.contains('success')) {
                setTimeout(() => {
                    formFeedback.style.display = 'none';
                }, 8000);
            }
        }
    });
}

// Product Carousel Logic
function initCarousel(carouselId) {
    const carousel = document.getElementById(carouselId);
    if (!carousel) return;

    const slides = carousel.querySelectorAll('.carousel-slides img');
    const dots = carousel.querySelectorAll('.dot');
    const nextBtn = carousel.querySelector('.next');
    const prevBtn = carousel.querySelector('.prev');
    let currentSlide = 0;

    function showSlide(n) {
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        currentSlide = (n + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showSlide(currentSlide + 1);
    });

    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showSlide(currentSlide - 1);
    });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', (e) => {
            e.stopPropagation();
            showSlide(index);
        });
    });

    // Auto-advance every 5 seconds
    let autoPlay = setInterval(() => showSlide(currentSlide + 1), 5000);

    carousel.addEventListener('mouseenter', () => clearInterval(autoPlay));
    carousel.addEventListener('mouseleave', () => {
        autoPlay = setInterval(() => showSlide(currentSlide + 1), 5000);
    });
}

// Initialize carousels
document.addEventListener('DOMContentLoaded', () => {
    initCarousel('ksenia-carousel');
    initCarousel('caddx-carousel');
    initCarousel('vanderbilt-carousel');
    initCarousel('hikvision-carousel');
    initCarousel('limotec-carousel');
});
