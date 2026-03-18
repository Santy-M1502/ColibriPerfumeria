/* ============================================
   stars.js — Generador de partículas (estrellas)
   Crea puntos parpadeantes en el fondo.
   Reutilizable: busca el elemento #stars.
   ============================================ */

(function () {
  'use strict';

  const CONFIG = {
    count:   60,      // cantidad de estrellas
    minSize: 1,       // px mínimo
    maxSize: 4,       // px máximo
    minDur:  2,       // segundos mínimo de ciclo
    maxDur:  6,       // segundos máximo
    minOp:   0.3,     // opacidad mínima
    maxOp:   0.9,     // opacidad máxima
  };

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function createStars() {
    const container = document.getElementById('stars');
    if (!container) return;

    const fragment = document.createDocumentFragment();

    for (let i = 0; i < CONFIG.count; i++) {
      const star = document.createElement('div');
      star.className = 'star';

      const size  = rand(CONFIG.minSize, CONFIG.maxSize);
      const dur   = rand(CONFIG.minDur,  CONFIG.maxDur);
      const op    = rand(CONFIG.minOp,   CONFIG.maxOp);
      const delay = rand(0, 6);

      star.style.cssText = [
        `width: ${size}px`,
        `height: ${size}px`,
        `top: ${rand(0, 100)}%`,
        `left: ${rand(0, 100)}%`,
        `--d: ${dur.toFixed(2)}s`,
        `--op: ${op.toFixed(2)}`,
        `animation-delay: ${delay.toFixed(2)}s`,
      ].join('; ');

      fragment.appendChild(star);
    }

    container.appendChild(fragment);
  }

  /* ── Arranca cuando el DOM está listo ── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createStars);
  } else {
    createStars();
  }
})();