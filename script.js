/* File: script.js
   Handles nav, smooth scroll, mobile nav, theme toggle, active section highlighting.
*/
(() => {
  const SELECTORS = {
    navLinks: document.querySelectorAll('a[data-target]'),
    mobileNav: document.getElementById('mobile-nav'),
    hamburger: document.getElementById('hamburger'),
    mobileNavList: document.getElementById('mobile-nav-list'),
    themeToggle: document.getElementById('theme-toggle'),
    navList: document.getElementById('nav-list'),
    header: document.getElementById('site-header')
  };

  // Smooth scroll handler
  function handleNavClick(e) {
    e.preventDefault();
    const target = e.currentTarget.getAttribute('data-target');
    const el = document.getElementById(target);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // If mobile open, close it
    closeMobileNav();
  }

  SELECTORS.navLinks.forEach(a => a.addEventListener('click', handleNavClick));

  // Hamburger toggle
  function toggleMobileNav() {
    const expanded = SELECTORS.hamburger.classList.toggle('open');
    SELECTORS.hamburger.setAttribute('aria-expanded', expanded);
    if (expanded) {
      SELECTORS.mobileNav.setAttribute('aria-hidden', 'false');
      SELECTORS.mobileNav.style.display = 'block';
    } else {
      SELECTORS.mobileNav.setAttribute('aria-hidden', 'true');
      SELECTORS.mobileNav.style.display = 'none';
    }
  }

  function closeMobileNav() {
    if (SELECTORS.hamburger.classList.contains('open')) {
      SELECTORS.hamburger.classList.remove('open');
      SELECTORS.hamburger.setAttribute('aria-expanded', 'false');
      SELECTORS.mobileNav.setAttribute('aria-hidden', 'true');
      SELECTORS.mobileNav.style.display = 'none';
    }
  }

  SELECTORS.hamburger.addEventListener('click', toggleMobileNav);
  SELECTORS.mobileNavList.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMobileNav));

  // Theme toggle (persist in localStorage)
  const THEME_KEY = 'pmn_theme_pref';
  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const pressed = theme === 'dark';
    SELECTORS.themeToggle.setAttribute('aria-pressed', pressed);
    localStorage.setItem(THEME_KEY, theme);
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    setTheme(current === 'dark' ? 'light' : 'dark');
  }

  SELECTORS.themeToggle.addEventListener('click', toggleTheme);

  // Initialize theme from localStorage or system preference
  (function initTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) {
      setTheme(saved);
      return;
    }
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? 'dark' : 'light');
  })();

  // Active nav link on scroll using IntersectionObserver
  const sections = Array.from(document.querySelectorAll('main section[id], main article[id]'));
  const sectionTargets = document.querySelectorAll('main section[id], main article[id]');
  const options = { root: null, rootMargin: '0px 0px -40% 0px', threshold: 0 };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = entry.target.id;
      const link = document.querySelectorAll(`a[data-target="${id}"]`);
      if (entry.isIntersecting) {
        link.forEach(l => { l.classList.add('active'); });
      } else {
        link.forEach(l => { l.classList.remove('active'); });
      }
    });
  }, options);

  sectionTargets.forEach(s => observer.observe(s));

  // Shrink header on scroll for better UX
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const sc = window.scrollY;
    if (sc > 60) {
      SELECTORS.header.classList.add('scrolled');
    } else {
      SELECTORS.header.classList.remove('scrolled');
    }
    lastScroll = sc;
  });

  // Accessibility: close mobile nav on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileNav();
  });

  // Close mobile nav when clicking outside
  document.addEventListener('click', (e) => {
    if (!SELECTORS.mobileNav.contains(e.target) && !SELECTORS.hamburger.contains(e.target)) {
      // if click outside mobile nav and hamburger, close
      if (SELECTORS.hamburger.classList.contains('open')) closeMobileNav();
    }
  });

})();
