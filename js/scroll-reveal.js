/* ============================================
   scroll-reveal.js — Fade-in al entrar en viewport
   Usa IntersectionObserver para animar elementos
   con la clase .reveal cuando son visibles.
   ============================================ */

(function () {
  'use strict';

  /* Selector de elementos a animar.
     Podés añadir más clases o IDs según la página. */
  const SELECTORS = [
    '.reveal',
    '.card',
    '.combo-banner',
    '.contact-wrapper',
    '.about-text',
    '.about-visual',
    '.stat',
  ].join(', ');

  function initReveal() {
    const elements = document.querySelectorAll(SELECTORS);
    if (!elements.length) return;

    /* Agregar clase base si no la tienen */
    elements.forEach(function (el) {
      if (!el.classList.contains('reveal')) {
        el.classList.add('reveal');
      }
    });

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            /* Dejar de observar una vez visible (one-shot) */
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ── Arranca cuando el DOM está listo ── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initReveal);
  } else {
    initReveal();
  }
})();