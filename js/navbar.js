/* ============================================
   navbar.js — Comportamiento del navbar
   Responsabilidades:
     - Clase .scrolled al hacer scroll
     - Toggle del menú mobile (hamburguesa)
     - Marcar el link activo según la sección visible
   ============================================ */

(function () {
  'use strict';

  const navbar     = document.getElementById('navbar');
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const navLinks   = document.querySelectorAll('.nav-links a, .mobile-menu a');

  /* ── Scroll: agrega clase .scrolled ── */
  function onScroll() {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 30);
    updateActiveLink();
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ── Hamburguesa: abre / cierra menú mobile ── */
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      const isOpen = mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
    });
  }

  /* ── Cierra el menú mobile al hacer click en un link ── */
  window.closeMenu = function () {
    if (mobileMenu) mobileMenu.classList.remove('open');
    if (hamburger)  hamburger.classList.remove('open');
  };

  /* ── Cierra el menú al hacer click fuera ── */
  document.addEventListener('click', function (e) {
    if (!navbar) return;
    const clickedOutside = !navbar.contains(e.target) && !mobileMenu?.contains(e.target);
    if (clickedOutside) closeMenu();
  });

  /* ── Link activo según sección visible ── */
  function updateActiveLink() {
    const sections = document.querySelectorAll('section[id], div[id]');
    let current = '';

    sections.forEach(function (section) {
      const top = section.getBoundingClientRect().top;
      if (top <= 100) current = section.id;
    });

    navLinks.forEach(function (link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  /* ── Smooth scroll para links del navbar ── */
  navLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href && href.startsWith('#')) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          closeMenu();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  /* ── Init ── */
  onScroll();
})();