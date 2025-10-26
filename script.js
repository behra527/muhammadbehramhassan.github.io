// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
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

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(10, 10, 10, 0.98)';
    } else {
        navbar.style.background = 'rgba(10, 10, 10, 0.95)';
    }
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Add fade-in class to elements and observe them
document.addEventListener('DOMContentLoaded', () => {
    const elementsToAnimate = document.querySelectorAll('.project-card, .skill-category-card, .cert-card, .about-card, .contact-item');
    elementsToAnimate.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
});

// Typing animation for hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// Initialize typing animation when page loads
window.addEventListener('load', () => {
    const nameElement = document.querySelector('.name');
    if (nameElement) {
        const originalText = nameElement.textContent;
        typeWriter(nameElement, originalText, 150);
    }
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    
    if (hero && heroContent) {
        const rate = scrolled * -0.5;
        heroContent.style.transform = `translateY(${rate}px)`;
    }
});

// Counter animation for stats
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start) + '%';
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + '%';
        }
    }
    updateCounter();
}

// Trigger counter animation when stats section is visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const text = stat.textContent;
                if (text.includes('%')) {
                    const number = parseInt(text);
                    animateCounter(stat, number);
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

// Observe hero stats section
const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    statsObserver.observe(heroStats);
}

// Project card hover effects
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// Skill tag hover effects
document.querySelectorAll('.skill-tag, .skill-item').forEach(tag => {
    tag.addEventListener('mouseenter', () => {
        tag.style.transform = 'translateY(-3px) scale(1.05)';
    });
    
    tag.addEventListener('mouseleave', () => {
        tag.style.transform = 'translateY(0) scale(1)';
    });
});

// Contact form handling
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const btnText = submitBtn.querySelector('.btn-text');
const btnLoading = submitBtn.querySelector('.btn-loading');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const phone = formData.get('phone') || '';
        const message = formData.get('message');
        
        // Simple validation
        if (!name || !email || !subject || !message) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Show loading state
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline';
        
        try {
            // Send email using multiple methods
            const result = await sendEmail(name, email, subject, phone, message);
            showNotification(`Message sent successfully via ${result.method}! I'll get back to you soon.`, 'success');
            contactForm.reset();
        } catch (error) {
            console.error('Error sending email:', error);
            
            // Show fallback option
            const fallbackMessage = 'Failed to send message automatically. Would you like to open your email client instead?';
            showNotification(fallbackMessage, 'error');
            
            // Add fallback button
            setTimeout(() => {
                const fallbackBtn = document.createElement('button');
                fallbackBtn.textContent = 'Open Email Client';
                fallbackBtn.className = 'btn btn-secondary';
                fallbackBtn.style.marginTop = '1rem';
                fallbackBtn.onclick = () => {
                    createMailtoLink(name, email, subject, message);
                };
                
                const notification = document.querySelector('.notification');
                if (notification) {
                    notification.appendChild(fallbackBtn);
                }
            }, 1000);
            
            // Also try direct mailto as backup
            setTimeout(() => {
                createMailtoLink(name, email, subject, message);
            }, 2000);
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
        }
    });
}

// Email sending function with multiple options
async function sendEmail(name, email, subject, phone, message) {
    // Try multiple email sending methods (EmailJS first for professional templates)
    const emailMethods = [
        sendViaEmailJS,
        sendViaFormspree,
        sendViaNetlifyForms,
        sendViaWeb3Forms
    ];
    
    for (const method of emailMethods) {
        try {
            const result = await method(name, email, subject, phone, message);
            if (result.success) {
                return result;
            }
        } catch (error) {
            console.warn('Email method failed:', error);
            continue;
        }
    }
    
    // If all methods fail, throw an error
    throw new Error('All email sending methods failed');
}

// Method 1: EmailJS (Recommended - Free and reliable)
async function sendViaEmailJS(name, email, subject, phone, message) {
    // Initialize EmailJS (you need to get these from emailjs.com)
    const serviceID = 'service_yltnyjj'; // Your Gmail service ID
    const templateID = 'template_cf5ad0y'; // Your EmailJS template ID
    const publicKey = 'fzZLBvIBPF2epwBTX'; // Your EmailJS public key
    
    // Check if public key is set
    if (publicKey === 'YOUR_EMAILJS_PUBLIC_KEY') {
        console.warn('EmailJS Public Key not set. Please get your public key from EmailJS dashboard.');
        throw new Error('EmailJS Public Key not configured');
    }
    
    // Debug: Log configuration
    console.log('EmailJS Config:', {
        serviceID: serviceID,
        templateID: templateID,
        publicKey: publicKey ? 'Set' : 'NOT SET'
    });
    
    const templateParams = {
        from_name: name,
        from_email: email,
        subject: subject,
        phone: phone,
        message: message,
        to_email: 'muhammadbehramhassan@gmail.com',
        reply_to: email,
        time: new Date().toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZoneName: 'short'
        }),
        // Optional: Add auto-reply flag
        send_auto_reply: true
    };
    
    // Initialize EmailJS
    emailjs.init(publicKey);
    
    const response = await emailjs.send(serviceID, templateID, templateParams);
    
    // Send auto-reply using dedicated auto-reply template
    try {
        console.log('=== AUTO-REPLY DEBUG START ===');
        console.log('Attempting to send auto-reply...');
        
        const autoReplyTemplateID = 'template_h1vukka'; // Your auto-reply template ID
        console.log('Auto-reply template ID:', autoReplyTemplateID);
        console.log('Service ID:', serviceID);
        console.log('Public Key:', publicKey);
        
        const autoReplyParams = {
            from_name: name,
            from_email: email,
            subject: subject,
            message: message,
            to_email: email, // Send to sender only
            reply_to: 'muhammadbehramhassan@gmail.com',
            time: new Date().toLocaleString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                timeZoneName: 'short'
            })
        };
        
        console.log('Auto-reply params:', autoReplyParams);
        console.log('Sending auto-reply...');
        
        const autoReplyResponse = await emailjs.send(serviceID, autoReplyTemplateID, autoReplyParams);
        console.log('Auto-reply sent successfully:', autoReplyResponse);
        console.log('=== AUTO-REPLY DEBUG END ===');
    } catch (autoReplyError) {
        console.error('=== AUTO-REPLY ERROR ===');
        console.error('Auto-reply failed:', autoReplyError);
        console.error('Error details:', {
            message: autoReplyError.message,
            status: autoReplyError.status,
            text: autoReplyError.text
        });
        console.error('=== AUTO-REPLY ERROR END ===');
        // Don't fail the main email if auto-reply fails
    }
    
    return { success: true, method: 'EmailJS', response };
}

// Method 2: Formspree (Alternative - Free tier available)
async function sendViaFormspree(name, email, subject, phone, message) {
    const formspreeEndpoint = 'https://formspree.io/f/mldoeyae'; // Your Formspree form ID
    
    const response = await fetch(formspreeEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: name,
            email: email,
            subject: subject,
            phone: phone,
            message: message,
            _replyto: email,
            _subject: `Portfolio Contact: ${subject}`
        })
    });
    
    if (response.ok) {
        const result = await response.json();
        console.log('Formspree success:', result);
        return { success: true, method: 'Formspree', response: result };
    } else {
        const errorText = await response.text();
        console.error('Formspree error:', response.status, errorText);
        throw new Error(`Formspree request failed: ${response.status}`);
    }
}

// Method 3: Netlify Forms (If hosting on Netlify)
async function sendViaNetlifyForms(name, email, subject, message) {
    const formData = new FormData();
    formData.append('form-name', 'contact');
    formData.append('name', name);
    formData.append('email', email);
    formData.append('subject', subject);
    formData.append('message', message);
    
    const response = await fetch('/', {
        method: 'POST',
        body: formData
    });
    
    if (response.ok) {
        return { success: true, method: 'Netlify Forms', response };
    } else {
        throw new Error('Netlify Forms request failed');
    }
}

// Method 4: Web3Forms (Simple alternative)
async function sendViaWeb3Forms(name, email, subject, message) {
    const web3formsEndpoint = 'https://api.web3forms.com/submit';
    const accessKey = 'YOUR_WEB3FORMS_ACCESS_KEY'; // Replace with your Web3Forms access key
    
    const response = await fetch(web3formsEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            access_key: accessKey,
            name: name,
            email: email,
            subject: subject,
            message: message,
            from_name: name,
            reply_to: email
        })
    });
    
    const result = await response.json();
    
    if (result.success) {
        return { success: true, method: 'Web3Forms', response: result };
    } else {
        throw new Error('Web3Forms request failed');
    }
}

// Fallback: Create a mailto link as last resort
function createMailtoLink(name, email, subject, message) {
    const mailtoSubject = encodeURIComponent(`Portfolio Contact: ${subject}`);
    const mailtoBody = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`
    );
    
    const mailtoLink = `mailto:muhammadbehramhassan@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;
    window.open(mailtoLink, '_blank');
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Floating elements animation
function animateFloatingElements() {
    const floatingIcons = document.querySelectorAll('.floating-icon');
    
    floatingIcons.forEach((icon, index) => {
        const randomDelay = Math.random() * 2;
        const randomDuration = 3 + Math.random() * 2;
        
        icon.style.animationDelay = `${randomDelay}s`;
        icon.style.animationDuration = `${randomDuration}s`;
    });
}

// Initialize floating elements animation
document.addEventListener('DOMContentLoaded', animateFloatingElements);

// Scroll to top functionality
function createScrollToTopButton() {
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        font-size: 1.2rem;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
    `;
    
    document.body.appendChild(scrollBtn);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollBtn.style.opacity = '1';
            scrollBtn.style.visibility = 'visible';
        } else {
            scrollBtn.style.opacity = '0';
            scrollBtn.style.visibility = 'hidden';
        }
    });
    
    // Scroll to top when clicked
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Hover effects
    scrollBtn.addEventListener('mouseenter', () => {
        scrollBtn.style.transform = 'translateY(-3px) scale(1.1)';
    });
    
    scrollBtn.addEventListener('mouseleave', () => {
        scrollBtn.style.transform = 'translateY(0) scale(1)';
    });
}

// Initialize scroll to top button
document.addEventListener('DOMContentLoaded', createScrollToTopButton);

// Particle effect for hero section
function createParticles() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    const particleContainer = document.createElement('div');
    particleContainer.className = 'particles';
    particleContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
    `;
    
    hero.appendChild(particleContainer);
    
    // Create particles
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: rgba(102, 126, 234, 0.5);
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${3 + Math.random() * 4}s ease-in-out infinite;
            animation-delay: ${Math.random() * 2}s;
        `;
        particleContainer.appendChild(particle);
    }
}

// Initialize particles
document.addEventListener('DOMContentLoaded', createParticles);

// Add CSS for particles animation
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0%, 100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.5;
        }
        50% {
            transform: translateY(-20px) translateX(10px);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// Performance optimization: Throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Apply throttling to scroll events
window.addEventListener('scroll', throttle(() => {
    // Navbar background change
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(10, 10, 10, 0.98)';
    } else {
        navbar.style.background = 'rgba(10, 10, 10, 0.95)';
    }
    
    // Parallax effect
    const scrolled = window.pageYOffset;
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        const rate = scrolled * -0.3;
        heroContent.style.transform = `translateY(${rate}px)`;
    }
}, 16)); // ~60fps


// GitHub Projects Integration
async function loadGitHubProjects() {
    const githubUsername = 'behra527';
    const projectsGrid = document.getElementById('githubProjectsGrid');
    
    if (!projectsGrid) return;
    
    try {
        // Show loading spinner
        projectsGrid.innerHTML = `
            <div class="loading-spinner">
                <div class="spinner"></div>
                <p>Loading GitHub projects...</p>
            </div>
        `;
        
        // Fetch repositories from GitHub API
        const response = await fetch(`https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=20`);
        
        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }
        
        const repos = await response.json();
        
        // Specific projects to include
        const targetProjects = [
            'BeautyGenie-Virtual-Makeup-App',
            'AI-Image-Enhancement-Website', 
            'Elevate-Social-Project',
            'Skin-Tone-Classification-model',
            'audio-category-classifier',
            'Full-Stack-Job-Listing-Web-App',
            'image-scraper-tool',
            'car-damage-detector-yolov8',
            'distilbert-text-classification',
            'InfluencerApp',
            'ABS-Full-stack-Music-Website'
        ];
        
        // Filter and sort projects
        const filteredRepos = repos
            .filter(repo => targetProjects.includes(repo.name))
            .sort((a, b) => {
                const aIndex = targetProjects.indexOf(a.name);
                const bIndex = targetProjects.indexOf(b.name);
                return aIndex - bIndex;
            });
        
        if (filteredRepos.length === 0) {
            projectsGrid.innerHTML = `
                <div class="loading-spinner">
                    <p>No matching repositories found.</p>
                </div>
            `;
            return;
        }
        
        // Generate project cards
        projectsGrid.innerHTML = filteredRepos.map(repo => createProjectCard(repo)).join('');
        
        // Add fade-in animation to new cards
        const cards = projectsGrid.querySelectorAll('.github-project-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            setTimeout(() => {
                card.style.transition = 'all 0.6s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
        
    } catch (error) {
        console.error('Error loading GitHub projects:', error);
        projectsGrid.innerHTML = `
            <div class="loading-spinner">
                <p>Unable to load GitHub projects. Please try again later.</p>
            </div>
        `;
    }
}

function createProjectCard(repo) {
    const languages = repo.language ? [repo.language] : [];
    const topics = repo.topics ? repo.topics.slice(0, 3) : [];
    const allTech = [...languages, ...topics].slice(0, 4);
    
    const description = repo.description || 'No description available.';
    const truncatedDesc = description.length > 120 ? description.substring(0, 120) + '...' : description;
    
    // Get appropriate icon based on project name
    const getProjectIcon = (name) => {
        if (name.includes('Beauty') || name.includes('Makeup')) return 'fas fa-magic';
        if (name.includes('Image') || name.includes('Enhancement')) return 'fas fa-image';
        if (name.includes('Social') || name.includes('Elevate')) return 'fas fa-share-alt';
        if (name.includes('Skin') || name.includes('Classification')) return 'fas fa-palette';
        if (name.includes('audio') || name.includes('Audio')) return 'fas fa-microphone';
        if (name.includes('Job') || name.includes('Listing')) return 'fas fa-briefcase';
        if (name.includes('scraper') || name.includes('tool')) return 'fas fa-tools';
        if (name.includes('car') || name.includes('damage')) return 'fas fa-car';
        if (name.includes('text') || name.includes('classification')) return 'fas fa-comments';
        if (name.includes('Influencer')) return 'fas fa-users';
        if (name.includes('Music') || name.includes('ABS')) return 'fas fa-music';
        return 'fas fa-code';
    };
    
    // Get project category
    const getProjectCategory = (name) => {
        if (name.includes('Beauty') || name.includes('Makeup')) return 'AI/ML • Mobile App';
        if (name.includes('Image') || name.includes('Enhancement')) return 'Computer Vision • Web';
        if (name.includes('Social') || name.includes('Elevate')) return 'Full-Stack • Automation';
        if (name.includes('Skin') || name.includes('Classification')) return 'AI/ML • Classification';
        if (name.includes('audio') || name.includes('Audio')) return 'Audio Processing • ML';
        if (name.includes('Job') || name.includes('Listing')) return 'Full-Stack • Web App';
        if (name.includes('scraper') || name.includes('tool')) return 'Web Scraping • Tool';
        if (name.includes('car') || name.includes('damage')) return 'Computer Vision • API';
        if (name.includes('text') || name.includes('classification')) return 'NLP • ML';
        if (name.includes('Influencer')) return 'Full-Stack • Social App';
        if (name.includes('Music') || name.includes('ABS')) return 'Full-Stack • Music App';
        return 'Web Development';
    };
    
    return `
        <div class="github-project-card">
            <div class="github-project-header">
                <h3 class="github-project-title">
                    <i class="${getProjectIcon(repo.name)}"></i>
                    ${repo.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </h3>
            </div>
            
            <div class="project-category">${getProjectCategory(repo.name)}</div>
            
            <p class="github-project-description">${truncatedDesc}</p>
            
            ${allTech.length > 0 ? `
                <div class="github-project-tech">
                    ${allTech.map(tech => `<span class="github-tech-tag">${tech}</span>`).join('')}
                </div>
            ` : ''}
            
            <div class="github-project-links">
                <a href="${repo.html_url}" target="_blank" class="github-link primary">
                    <i class="fab fa-github"></i>
                    View Code
                </a>
                ${repo.homepage ? `
                    <a href="${repo.homepage}" target="_blank" class="github-link secondary">
                        <i class="fas fa-external-link-alt"></i>
                        Live Demo
                    </a>
                ` : ''}
            </div>
        </div>
    `;
}

// Initialize GitHub projects
function initGitHubProjects() {
    loadGitHubProjects();
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Portfolio website loaded successfully!');
    
    // Initialize GitHub projects
    initGitHubProjects();
    
    // Add loading animation
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});
