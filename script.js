// ===== ANALYTICS TRACKING INITIALIZATION =====
// Initialize tracking on all pages
window.addEventListener('load', function() {
    initializeTracking();
});

// ===== SMOOTH SCROLL & NAVBAR EFFECTS =====
document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Navbar background on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });

    // Ensure navbar stays visible on desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            navMenu.classList.remove('active');
        }
    });
});

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'slideInUp 0.8s ease-out forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Animate elements on scroll
document.querySelectorAll('.skill-category, .project-card, .stat-item').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
});

// ===== PARALLAX EFFECT FOR HERO =====
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// ===== MOUSE TRACKING FOR FLOATING CARDS =====
document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.floating-card');
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;

    cards.forEach((card, index) => {
        const moveX = (x - 0.5) * 10 * (index + 1);
        const moveY = (y - 0.5) * 10 * (index + 1);
        card.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
});

// ===== TYPEWRITER EFFECT =====
function typeWriter(element, text, speed = 50) {
    let index = 0;
    element.textContent = '';

    function type() {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            setTimeout(type, speed);
        }
    }
    type();
}

// ===== COUNTER ANIMATION =====
function animateCounter(element) {
    const target = parseInt(element.textContent);
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const counter = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + (element.textContent.includes('+') ? '+' : element.textContent.includes('%') ? '%' : '');
            clearInterval(counter);
        } else {
            element.textContent = Math.floor(current) + (element.textContent.includes('+') ? '+' : element.textContent.includes('%') ? '%' : '');
        }
    }, 16);
}

// ===== SCROLL TO SECTION =====
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

// ===== SKILL TAG ANIMATION =====
const skillTags = document.querySelectorAll('.skill-tag');
skillTags.forEach((tag) => {
    tag.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1) translateY(-2px)';
    });
    tag.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1) translateY(0)';
    });
});

// ===== REVEAL TEXT ON SCROLL =====
function revealOnScroll() {
    const reveals = document.querySelectorAll('.about-text, .project-description, .research-text');

    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < windowHeight - elementVisible) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

document.querySelectorAll('.about-text, .project-description, .research-text').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 0.6s ease-out';
});

window.addEventListener('scroll', revealOnScroll);

// ===== ACTIVE NAV LINK ON SCROLL =====
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.style.color = 'var(--primary-light)';
        } else {
            link.style.color = '#cbd5e1';
        }
    });
});

// ===== STAGGER ANIMATION FOR GRIDS =====
function staggerAnimation(containerSelector, itemSelector, delayMs = 100) {
    const items = document.querySelectorAll(`${containerSelector} ${itemSelector}`);
    items.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.animation = `slideInUp 0.6s ease-out ${index * (delayMs / 1000)}s forwards`;
    });
}

// Apply stagger animations
staggerAnimation('.skills-grid', '.skill-category');
staggerAnimation('.projects-grid', '.project-card');
staggerAnimation('.contact-methods', '.contact-card');

// ===== COPY TO CLIPBOARD FUNCTIONALITY =====
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Copied to clipboard!');
    });
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: 0 10px 30px rgba(59, 130, 246, 0.3);
        z-index: 10000;
        animation: slideInUp 0.3s ease-out;
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideInUp 0.3s ease-out reverse';
        setTimeout(() => document.body.removeChild(notification), 300);
    }, 2000);
}

// ===== LAZY LOAD IMAGES =====
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
}

// ===== FORM SUBMISSION (if you add a contact form) =====
document.addEventListener('submit', function(e) {
    if (e.target.classList.contains('contact-form')) {
        e.preventDefault();
        console.log('Form submitted');
        showNotification('Message sent successfully! Thank you for reaching out.');
        e.target.reset();
    }
});

// ===== DYNAMIC TYPING EFFECT FOR HERO TITLE =====
window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        let index = 0;

        function type() {
            if (index < text.length) {
                heroTitle.textContent += text.charAt(index);
                index++;
                setTimeout(type, 50);
            }
        }

        // Trigger after a small delay
        setTimeout(type, 500);
    }
});

// ===== SCROLL PROGRESS INDICATOR =====
window.addEventListener('scroll', () => {
    const scrollProgress = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    document.documentElement.style.setProperty('--scroll-progress', scrollProgress + '%');
});

// ===== ENHANCE BUTTON INTERACTIONS =====
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const { left, top, width, height } = btn.getBoundingClientRect();
        const x = e.clientX - left;
        const y = e.clientY - top;

        btn.style.setProperty('--x', x + 'px');
        btn.style.setProperty('--y', y + 'px');
    });
});

// ===== CONSOLE MESSAGE =====
console.log('%cWelcome to Rajat Kumar\'s Portfolio!', 'color: #3b82f6; font-size: 16px; font-weight: bold;');
console.log('%cGenerative AI Engineer | Data Scientist | NLP Expert', 'color: #8b5cf6; font-size: 12px;');
console.log('%cLet\'s build something amazing together!', 'color: #ec4899; font-size: 12px;');
console.log('%cGitHub: https://github.com/rajattech0002-wq', 'color: #10b981; font-size: 11px;');

// ===== GITHUB PROFILE LINK TRACKING =====
document.querySelectorAll('a[href*="github.com/rajattech0002-wq"]').forEach(link => {
    link.addEventListener('click', () => {
        console.log('Navigating to GitHub profile or repository...');
    });
});
