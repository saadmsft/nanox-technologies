// Dark Mode Toggle
const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;

// Check for saved theme preference or default to 'light' mode
const currentTheme = localStorage.getItem('theme') || 'light';
htmlElement.setAttribute('data-theme', currentTheme);

themeToggle.addEventListener('click', () => {
    const theme = htmlElement.getAttribute('data-theme');
    const newTheme = theme === 'light' ? 'dark' : 'light';
    
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

// Mobile Navigation Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Active Navigation on Scroll
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });

    // Navbar background on scroll
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
    }
});

// Contact Form Handling
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        organization: document.getElementById('organization').value,
        interest: document.getElementById('interest').value,
        message: document.getElementById('message').value
    };

    // Here you would typically send the data to a server
    console.log('Form submitted:', formData);

    // Show success message (you can customize this)
    alert('Thank you for your message! Our team will contact you shortly.');

    // Reset form
    contactForm.reset();
});

// Smooth Scroll Enhancement
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 70;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
const animatedElements = document.querySelectorAll('.solution-card, .service-card, .testimonial-card, .tech-category');
animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Counter Animation for Stats
const stats = document.querySelectorAll('.stat h3');
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = entry.target;
            const text = target.textContent;
            
            // Check if it contains a number
            if (text.match(/\d+/)) {
                animateCounter(target);
                statsObserver.unobserve(target);
            }
        }
    });
}, { threshold: 0.5 });

stats.forEach(stat => statsObserver.observe(stat));

function animateCounter(element) {
    const text = element.textContent;
    const number = parseInt(text.match(/\d+/)[0]);
    const suffix = text.replace(/\d+/, '');
    const duration = 2000;
    const steps = 60;
    const increment = number / steps;
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= number) {
            element.textContent = number + suffix;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + suffix;
        }
    }, duration / steps);
}

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Products - Industries Toggle
const industriesToggles = document.querySelectorAll('.industries-toggle');

industriesToggles.forEach(toggle => {
    toggle.addEventListener('click', function() {
        const content = this.nextElementSibling;
        
        // Toggle active class on button
        this.classList.toggle('active');
        
        // Toggle active class on content
        content.classList.toggle('active');
        
        // Close other open panels
        industriesToggles.forEach(otherToggle => {
            if (otherToggle !== this) {
                otherToggle.classList.remove('active');
                otherToggle.nextElementSibling.classList.remove('active');
            }
        });
    });
});

// Product Modal
const productModal = document.getElementById('productModal');
const modalBody = document.getElementById('modalBody');
const modalClose = document.querySelector('.modal-close');
const modalOverlay = document.querySelector('.modal-overlay');
const viewDetailsBtns = document.querySelectorAll('.view-details-btn');

// Product data
const productData = {
    'gen-ai': {
        title: '🤖 NanoX Gen AI Assistants',
        description: 'AI assistants with RAG, MCP and A2A functionality for futuristic Agentic AI ecosystem available with Voice, Chat and Avatar interfaces.',
        workflow: {
            title: '⚡ Workflow Pipeline',
            steps: [
                { icon: '🎤', label: 'Voice/Text Input' },
                { icon: '🧠', label: 'AI Processing' },
                { icon: '📚', label: 'RAG Retrieval' },
                { icon: '🔗', label: 'MCP Integration' },
                { icon: '✨', label: 'Response Output' }
            ]
        },
        tools: ['LangChain', 'Azure AI Search', 'FastAPI', 'WebRTC', 'React'],
        models: ['GPT-4 Turbo', 'Claude 3.5 Sonnet', 'Whisper v3', 'Azure TTS', 'Ada-002'],
        industries: [
            '🏥 Healthcare - Patient Support & Triage',
            '🏦 Finance - Customer Service & Advisory',
            '🏪 Retail - Virtual Shopping Assistants',
            '🎓 Education - Personalized Learning Tutors',
            '⚖️ Legal - Document Analysis & Research',
            '🏭 Manufacturing - Operations Support'
        ]
    },
    'doc-proc': {
        title: '📄 NanoX Doc-Proc',
        description: 'Gen AI capable document processing, entity extraction, contract comparisons and much more for intelligent document workflows.',
        workflow: {
            title: '⚡ Processing Pipeline',
            steps: [
                { icon: '📤', label: 'Document Upload' },
                { icon: '🔍', label: 'OCR/Parsing' },
                { icon: '🎯', label: 'Entity Extraction' },
                { icon: '⚖️', label: 'Comparison' },
                { icon: '📊', label: 'Insights Report' }
            ]
        },
        tools: ['Azure Document Intelligence', 'PyPDF2', 'Unstructured', 'Celery', 'Redis'],
        models: ['GPT-4o', 'Claude 3 Opus', 'Phi-3', 'LayoutLM v3', 'Azure OpenAI'],
        industries: [
            '🏥 Healthcare - Medical Records Processing',
            '⚖️ Legal - Contract Review & Compliance',
            '🏦 Banking - Loan Document Processing',
            '🏢 Insurance - Claims Processing',
            '🏛️ Government - Public Records Management',
            '📦 Logistics - Shipping Documentation'
        ]
    },
    'nl-sql': {
        title: '💬 NanoX NL-SQL',
        description: 'Your way to talk to multiple sources of SQL with natural language to make sense and take next big decision backed by data via elegant UI and natural interface.',
        workflow: {
            title: '⚡ Query Execution Flow',
            steps: [
                { icon: '💭', label: 'Natural Language' },
                { icon: '🔄', label: 'Intent Parsing' },
                { icon: '💾', label: 'SQL Generation' },
                { icon: '⚡', label: 'Query Execution' },
                { icon: '📈', label: 'Visual Insights' }
            ]
        },
        tools: ['SQLAlchemy', 'Apache Superset', 'Streamlit', 'PostgreSQL', 'DuckDB'],
        models: ['GPT-4 Turbo', 'CodeLlama 70B', 'Gemini Pro', 'DeepSeek Coder', 'GPT-3.5 Turbo'],
        industries: [
            '🏥 Healthcare - Patient Data Analytics',
            '🏪 Retail - Sales Performance Analysis',
            '🏦 Finance - Transaction Intelligence',
            '📊 Marketing - Campaign Analytics',
            '🏭 Manufacturing - Production Metrics',
            '🚗 Automotive - Fleet Management'
        ]
    }
};

// Open modal
viewDetailsBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const productId = this.getAttribute('data-product');
        const product = productData[productId];
        
        if (product) {
            // Generate workflow steps HTML
            const workflowStepsHTML = product.workflow.steps.map((step, index) => `
                <div class="modal-step">
                    <div class="modal-step-icon">${step.icon}</div>
                    <div class="modal-step-label">${step.label}</div>
                </div>
                ${index < product.workflow.steps.length - 1 ? '<div class="modal-step-arrow">→</div>' : ''}
            `).join('');
            
            // Generate tools HTML
            const toolsHTML = product.tools.map(tool => 
                `<span class="modal-tech-tag">${tool}</span>`
            ).join('');
            
            // Generate models HTML
            const modelsHTML = product.models.map(model => 
                `<span class="modal-tech-tag model">${model}</span>`
            ).join('');
            
            // Generate industries HTML
            const industriesHTML = product.industries.map(industry => 
                `<div class="modal-industry-item">${industry}</div>`
            ).join('');
            
            // Set modal content
            modalBody.innerHTML = `
                <div class="modal-header">
                    <h2 class="modal-product-title">${product.title}</h2>
                    <p class="modal-product-desc">${product.description}</p>
                </div>
                
                <div class="modal-workflow">
                    <h3>${product.workflow.title}</h3>
                    <div class="modal-workflow-steps">
                        ${workflowStepsHTML}
                    </div>
                    <div class="modal-workflow-pulse"></div>
                </div>
                
                <div class="modal-tech-grid">
                    <div class="modal-tech-section">
                        <h4>🛠️ Tools & Frameworks</h4>
                        <div class="modal-tech-items">
                            ${toolsHTML}
                        </div>
                    </div>
                    <div class="modal-tech-section">
                        <h4>🤖 AI Models</h4>
                        <div class="modal-tech-items">
                            ${modelsHTML}
                        </div>
                    </div>
                </div>
                
                <div class="modal-industries">
                    <h3>🏢 Applicable Industries</h3>
                    <div class="modal-industry-grid">
                        ${industriesHTML}
                    </div>
                </div>
            `;
            
            // Show modal
            productModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    });
});

// Close modal
function closeModal() {
    productModal.classList.remove('active');
    document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', closeModal);

// Close on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && productModal.classList.contains('active')) {
        closeModal();
    }
});

// Observe product cards for animation
const productCards = document.querySelectorAll('.product-card');
productCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    card.style.transitionDelay = `${index * 0.15}s`;
    observer.observe(card);
});

