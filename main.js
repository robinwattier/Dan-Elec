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

// Secure Contact Form Handling (Asynchronous)
const contactForm = document.getElementById('contact-form');
const formFeedback = document.getElementById('form-feedback');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const submitBtn = document.getElementById('submit-btn');
        const originalContent = submitBtn.innerHTML;
        
        // Disable button to prevent double submission
        submitBtn.innerHTML = '<span>Envoi en cours...</span><i class="ri-loader-4-line ri-spin"></i>';
        submitBtn.disabled = true;
        formFeedback.className = 'form-feedback';
        formFeedback.style.display = 'none';
        
        try {
            // Replace with actual API endpoint when ready
            // Example: const response = await fetch(contactForm.action, { method: 'POST', body: formData, headers: { 'Accept': 'application/json' }});
            
            // Simulating network request
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Assume success for now
            const isSuccess = true; 
            
            if (isSuccess) {
                formFeedback.textContent = 'Votre demande a été envoyée avec succès. Nous vous contacterons rapidement.';
                formFeedback.className = 'form-feedback success';
                contactForm.reset();
            } else {
                throw new Error('Une erreur est survenue lors de l\'envoi.');
            }
        } catch (error) {
            formFeedback.textContent = 'Erreur: Impossible d\'envoyer le message. Veuillez réessayer plus tard.';
            formFeedback.className = 'form-feedback error';
        } finally {
            formFeedback.style.display = 'block';
            submitBtn.innerHTML = originalContent;
            submitBtn.disabled = false;
            
            // Auto hide success message after 5 seconds
            if (formFeedback.classList.contains('success')) {
                setTimeout(() => {
                    formFeedback.style.display = 'none';
                }, 5000);
            }
        }
    });
}
