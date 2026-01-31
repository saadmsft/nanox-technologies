// Nanox Technologies - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all components
  initHeader();
  initAnnouncementBar();
  initMobileMenu();
  initAccordions();
  initScrollReveal();
});

// Header scroll effect
function initHeader() {
  const header = document.querySelector('.header');
  if (!header) return;

  function updateHeader() {
    if (window.scrollY > 10) {
      header.classList.add('scrolled');
      header.classList.remove('transparent');
    } else {
      header.classList.remove('scrolled');
      header.classList.add('transparent');
    }
  }

  window.addEventListener('scroll', updateHeader);
  updateHeader(); // Initial check
}

// Announcement bar dismiss
function initAnnouncementBar() {
  const bar = document.querySelector('.announcement-bar');
  const closeBtn = bar?.querySelector('.close-btn');
  
  if (closeBtn) {
    closeBtn.addEventListener('click', function() {
      bar.style.display = 'none';
    });
  }
}

// Mobile menu
function initMobileMenu() {
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const closeBtn = document.querySelector('.mobile-menu .close-btn');
  const overlay = document.querySelector('.mobile-menu-overlay');
  const menu = document.querySelector('.mobile-menu');
  const menuLinks = document.querySelectorAll('.mobile-menu nav a');

  function openMenu() {
    overlay?.classList.add('active');
    menu?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    overlay?.classList.remove('active');
    menu?.classList.remove('active');
    document.body.style.overflow = '';
  }

  menuBtn?.addEventListener('click', openMenu);
  closeBtn?.addEventListener('click', closeMenu);
  overlay?.addEventListener('click', closeMenu);

  // Close menu when clicking a link
  menuLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeMenu();
    }
  });
}

// Accordion functionality
function initAccordions() {
  const accordionItems = document.querySelectorAll('.accordion-item');

  accordionItems.forEach(item => {
    const trigger = item.querySelector('.accordion-trigger');
    
    trigger?.addEventListener('click', function() {
      const isActive = item.classList.contains('active');
      
      // Close all items in the same accordion container
      const container = item.closest('.accordion-container');
      container?.querySelectorAll('.accordion-item').forEach(i => {
        i.classList.remove('active');
      });

      // Toggle current item
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

// Scroll reveal animations
function initScrollReveal() {
  const elements = document.querySelectorAll('.fade-up, .fade-in, .slide-in-left, .slide-in-right');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px'
  });

  elements.forEach(el => {
    observer.observe(el);
  });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({
        behavior: 'smooth'
      });
    }
  });
});
