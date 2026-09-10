/* ==========================================================================
   Job & Placement Portal - Main JavaScript
   ========================================================================== */

document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileMenu();
  initDropdowns();
  initBackToTop();
  initSmoothScroll();
  initScrollReveal();
  setActiveNavLink();
  initNewsletterForms();
});

/* ==========================================================================
   Header Scroll Effect (adds shadow to sticky main bar)
   ========================================================================== */
function initHeader() {
  const headerMain = document.querySelector('.header__main');
  if (!headerMain) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      headerMain.classList.add('header__main--scrolled');
    } else {
      headerMain.classList.remove('header__main--scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ==========================================================================
   Mobile Navigation Menu (hamburger drawer)
   ========================================================================== */
function initMobileMenu() {
  const toggle = document.querySelector('.mobile-toggle');
  const nav = document.querySelector('.nav');
  if (!toggle || !nav) return;

  const setMenuState = (isOpen) => {
    nav.classList.toggle('nav--open', isOpen);
    toggle.classList.toggle('mobile-toggle--active', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
  };

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    setMenuState(!nav.classList.contains('nav--open'));
  });

  // Close when clicking any nav link inside the drawer
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => setMenuState(false));
  });

  // Close when clicking outside the menu
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !toggle.contains(e.target)) {
      setMenuState(false);
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setMenuState(false);
  });

  // Reset when resizing back to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1024) setMenuState(false);
  });
}

/* ==========================================================================
   Dropdown Menus (Pages dropdown)
   ========================================================================== */
function initDropdowns() {
  const dropdowns = document.querySelectorAll('.nav__dropdown');

  const closeAllDropdowns = () => {
    dropdowns.forEach(dropdown => {
      dropdown.classList.remove('nav__dropdown--open');
      const toggle = dropdown.querySelector('.nav__dropdown-toggle');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
    });
  };

  dropdowns.forEach(dropdown => {
    const toggle = dropdown.querySelector('.nav__dropdown-toggle');
    if (!toggle) return;

    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const wasOpen = dropdown.classList.contains('nav__dropdown--open');
      closeAllDropdowns();
      if (!wasOpen) {
        dropdown.classList.add('nav__dropdown--open');
        toggle.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Close all dropdowns when clicking outside or pressing Escape
  document.addEventListener('click', closeAllDropdowns);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllDropdowns();
  });
}

/* ==========================================================================
   Back to Top Button
   ========================================================================== */
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  const toggleVisibility = () => {
    if (window.scrollY > 400) {
      btn.classList.add('back-to-top--visible');
    } else {
      btn.classList.remove('back-to-top--visible');
    }
  };

  window.addEventListener('scroll', toggleVisibility, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ==========================================================================
   Smooth Scroll for Anchor Links
   ========================================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* ==========================================================================
   Scroll Reveal (IntersectionObserver)
   Adds .is-revealed when [data-reveal] elements enter the viewport.
   ========================================================================== */
function initScrollReveal() {
  const targets = document.querySelectorAll('[data-reveal]');
  if (!targets.length) return;

  if (!('IntersectionObserver' in window)) {
    targets.forEach(el => el.classList.add('is-revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px',
  });

  targets.forEach(el => observer.observe(el));
}

/* ==========================================================================
   Active Nav Link Highlighting
   ========================================================================== */
function setActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('nav__link--active');
    }
  });
}

/* ==========================================================================
   Footer Newsletter Forms (validate + show confirmation)
   ========================================================================== */
function initNewsletterForms() {
  document.querySelectorAll('.footer__newsletter-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('.footer__newsletter-input');
      const msg = form.querySelector('.footer__newsletter-msg');
      const email = input.value.trim();

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        input.classList.add('footer__newsletter-input--error');
        input.focus();
        return;
      }

      input.classList.remove('footer__newsletter-input--error');
      input.value = '';
      if (msg) {
        msg.textContent = 'Thanks for subscribing! Check your inbox for updates.';
        msg.removeAttribute('hidden');
      }
    });

    form.querySelector('.footer__newsletter-input').addEventListener('input', (e) => {
      e.target.classList.remove('footer__newsletter-input--error');
    });
  });
}

/* ==========================================================================
   Helper: Format Currency
   ========================================================================== */
function formatSalary(amount) {
  if (amount >= 1000) {
    return '$' + (amount / 1000).toFixed(0) + 'k';
  }
  return '$' + amount;
}

/* ==========================================================================
   Helper: Time Ago
   ========================================================================== */
function timeAgo(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return diffDays + ' days ago';
  if (diffDays < 30) return Math.floor(diffDays / 7) + ' weeks ago';
  if (diffDays < 365) return Math.floor(diffDays / 30) + ' months ago';
  return Math.floor(diffDays / 365) + ' years ago';
}

/* ==========================================================================
   Helper: Generate Star Rating HTML
   ========================================================================== */
function generateStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  let html = '';
  for (let i = 0; i < fullStars; i++) {
    html += '<i class="fas fa-star"></i>';
  }
  if (hasHalf) {
    html += '<i class="fas fa-star-half-alt"></i>';
  }
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);
  for (let i = 0; i < emptyStars; i++) {
    html += '<i class="far fa-star"></i>';
  }
  return html;
}
