/* ==========================================================================
   SUNNY RAJ — PORTFOLIO SCRIPT
   Vanilla JS only. Organized by feature, each wrapped defensively so one
   feature failing never blocks the rest of the page.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------------------------
     1. LOADING SCREEN
     Hides the loader once the page has fully loaded (or after a max
     timeout, so a slow font/network request never traps the user).
  ------------------------------------------------------------------ */
  const loader = document.getElementById('loader');
  const hideLoader = () => loader && loader.classList.add('hidden');
  window.addEventListener('load', () => setTimeout(hideLoader, 500));
  setTimeout(hideLoader, 2500); // safety fallback

  /* ------------------------------------------------------------------
     2. STICKY NAVBAR + SCROLL PROGRESS BAR + ACTIVE LINK HIGHLIGHT
  ------------------------------------------------------------------ */
  const navbar = document.getElementById('navbar');
  const scrollProgress = document.getElementById('scrollProgress');
  const backToTop = document.getElementById('backToTop');
  const navLinkEls = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('main section[id]');

  function onScroll() {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;

    if (navbar) navbar.classList.toggle('scrolled', scrollY > 40);
    if (scrollProgress) scrollProgress.style.width = progress + '%';
    if (backToTop) backToTop.classList.toggle('show', scrollY > 500);

    // Active link highlight based on section in view
    let currentId = 'home';
    sections.forEach((section) => {
      const top = section.offsetTop - 140;
      if (scrollY >= top) currentId = section.id;
    });
    navLinkEls.forEach((link) => {
      link.classList.toggle('active-link', link.getAttribute('href') === `#${currentId}`);
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ------------------------------------------------------------------
     3. MOBILE MENU (HAMBURGER)
  ------------------------------------------------------------------ */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  function closeMenu() {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  }

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });
    navLinkEls.forEach((link) => link.addEventListener('click', closeMenu));
  }

  /* ------------------------------------------------------------------
     4. THEME TOGGLE (Dark / Light) — persists for the session
  ------------------------------------------------------------------ */
  const themeToggle = document.getElementById('themeToggle');
  let currentTheme = 'dark';
  try { currentTheme = window.__savedTheme || 'dark'; } catch (e) { /* noop */ }

  function applyTheme(theme) {
    document.body.classList.toggle('light-theme', theme === 'light');
    window.__savedTheme = theme; // in-memory only (no localStorage per artifact rules)
  }
  applyTheme(currentTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(currentTheme);
    });
  }

  /* ------------------------------------------------------------------
     5. TYPING EFFECT — rotates through roles in the hero
  ------------------------------------------------------------------ */
  const typingText = document.getElementById('typingText');
  const roles = [
    'Aspiring MERN Stack Developer',
    'Frontend Developer',
    'C++ Programmer',
    'Problem Solver'
  ];

  if (typingText) {
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeLoop() {
      const currentRole = roles[roleIndex];

      if (isDeleting) {
        charIndex--;
      } else {
        charIndex++;
      }

      typingText.textContent = currentRole.substring(0, charIndex);

      let delay = isDeleting ? 40 : 85;

      if (!isDeleting && charIndex === currentRole.length) {
        delay = 1400; // pause at full word
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        delay = 400;
      }

      setTimeout(typeLoop, delay);
    }
    typeLoop();
  }

  /* ------------------------------------------------------------------
     6. SCROLL REVEAL — IntersectionObserver fades/slides elements in
  ------------------------------------------------------------------ */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('in-view')); // fallback
  }

  /* ------------------------------------------------------------------
     7. ANIMATED COUNTERS — for stats & achievements
  ------------------------------------------------------------------ */
  const counters = document.querySelectorAll('.stat-number, .achievement-number');

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10) || 0;
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1600;
    const startTime = performance.now();

    function tick(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      const value = Math.floor(eased * target);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(tick);
  }

  if ('IntersectionObserver' in window && counters.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach((el) => counterObserver.observe(el));
  }

  /* ------------------------------------------------------------------
     8. LEARNING PROGRESS BAR — animates width when in view
  ------------------------------------------------------------------ */
  const progressFill = document.querySelector('.progress-fill');
  if (progressFill && 'IntersectionObserver' in window) {
    const progressObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target.getAttribute('data-progress') || '0';
          requestAnimationFrame(() => { entry.target.style.width = target + '%'; });
          progressObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    progressObserver.observe(progressFill);
  }

  /* ------------------------------------------------------------------
     9. RIPPLE BUTTON EFFECT
  ------------------------------------------------------------------ */
  document.querySelectorAll('.ripple').forEach((btn) => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const circle = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      circle.className = 'ripple-circle';
      circle.style.width = circle.style.height = size + 'px';
      circle.style.left = (e.clientX - rect.left - size / 2) + 'px';
      circle.style.top = (e.clientY - rect.top - size / 2) + 'px';
      this.appendChild(circle);
      setTimeout(() => circle.remove(), 650);
    });
  });

  /* ------------------------------------------------------------------
     10. CURSOR GLOW — follows the mouse (desktop only, decorative)
  ------------------------------------------------------------------ */
  const cursorGlow = document.getElementById('cursorGlow');
  if (cursorGlow && window.matchMedia('(hover: hover)').matches) {
    window.addEventListener('mousemove', (e) => {
      cursorGlow.style.left = e.clientX + 'px';
      cursorGlow.style.top = e.clientY + 'px';
    }, { passive: true });
  } else if (cursorGlow) {
    cursorGlow.style.display = 'none';
  }

  /* ------------------------------------------------------------------
     11. BACK TO TOP BUTTON
  ------------------------------------------------------------------ */
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ------------------------------------------------------------------
     12. CONTACT FORM — lightweight client-side validation
     (No backend wired up; simulates a successful submission.)
  ------------------------------------------------------------------ */
  const form = document.getElementById('contactForm');
  if (form) {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const messageError = document.getElementById('messageError');
    const formSuccess = document.getElementById('formSuccess');

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function validateField(input, errorEl, condition, message) {
      if (!condition) {
        input.classList.add('invalid');
        errorEl.textContent = message;
        return false;
      }
      input.classList.remove('invalid');
      errorEl.textContent = '';
      return true;
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      formSuccess.classList.remove('show');

      const isNameValid = validateField(nameInput, nameError, nameInput.value.trim().length >= 2, 'Please enter your name.');
      const isEmailValid = validateField(emailInput, emailError, emailPattern.test(emailInput.value.trim()), 'Please enter a valid email.');
      const isMessageValid = validateField(messageInput, messageError, messageInput.value.trim().length >= 10, 'Message should be at least 10 characters.');

      if (isNameValid && isEmailValid && isMessageValid) {
        formSuccess.classList.add('show');
        form.reset();
        setTimeout(() => formSuccess.classList.remove('show'), 5000);
      }
    });

    // Clear error state as the user types
    [nameInput, emailInput, messageInput].forEach((input) => {
      input.addEventListener('input', () => input.classList.remove('invalid'));
    });
  }

  /* ------------------------------------------------------------------
     13. FOOTER YEAR
  ------------------------------------------------------------------ */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ------------------------------------------------------------------
     14. PARTICLE BACKGROUND — lightweight canvas particles
  ------------------------------------------------------------------ */
  const canvas = document.getElementById('particleCanvas');
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let width, height;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function resizeCanvas() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    function createParticles() {
      const count = Math.min(60, Math.floor((width * height) / 25000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.6 + 0.6,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        alpha: Math.random() * 0.4 + 0.15
      }));
    }

    function drawParticles() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(56, 189, 248, ${p.alpha})`;
        ctx.fill();
      });
      requestAnimationFrame(drawParticles);
    }

    resizeCanvas();
    createParticles();
    if (!reduceMotion) requestAnimationFrame(drawParticles);
    window.addEventListener('resize', () => { resizeCanvas(); createParticles(); });
  }

  /* ------------------------------------------------------------------
     15. LIGHT PARALLAX ON HERO SHAPES
  ------------------------------------------------------------------ */
  const shapes = document.querySelectorAll('.shape');
  if (shapes.length && window.matchMedia('(hover: hover)').matches) {
    window.addEventListener('mousemove', (e) => {
      const xRatio = (e.clientX / window.innerWidth) - 0.5;
      const yRatio = (e.clientY / window.innerHeight) - 0.5;
      shapes.forEach((shape, i) => {
        const depth = (i + 1) * 10;
        shape.style.transform = `translate(${xRatio * depth}px, ${yRatio * depth}px)`;
      });
    }, { passive: true });
  }

  /* ------------------------------------------------------------------
     16. SMOOTH SCROLL FOR IN-PAGE ANCHOR LINKS (with navbar offset)
  ------------------------------------------------------------------ */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId.length <= 1) return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const offset = document.getElementById('navbar').offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - offset + 1;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

});