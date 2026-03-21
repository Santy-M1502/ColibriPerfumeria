/* ============================================
   CART-MODAL.JS
   Productos en localStorage: "colibri_cart"
   Estructura: { id, name, desc, price, qty, image }
   ============================================ */

(() => {

  /* ── Helpers localStorage ── */
  const STORAGE_KEY = 'colibri_cart';

  function getCart() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch { return []; }
  }
  function saveCart(cart) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }

  function updateQty(id, delta) {
    const cart = getCart();
    const item = cart.find(p => p.id === id);
    if (!item) return;
    item.qty = Math.max(1, item.qty + delta);
    saveCart(cart);
    render();
  }
  function removeItem(id) {
    saveCart(getCart().filter(p => p.id !== id));
    render();
  }

  /* ── Formato de precio ── */
  function formatPrice(n) {
    return '$' + Number(n).toLocaleString('es-AR');
  }

  /* ── Badge del navbar ── */
  function updateBadge() {
    const total = getCart().reduce((s, p) => s + p.qty, 0);
    document.querySelectorAll('.cart-count').forEach(el => el.textContent = total || 0);
  }

  /* ── Inyectar HTML del modal una sola vez ── */
  function injectModal() {
    if (document.getElementById('cartModal')) return; // ya existe
    document.body.insertAdjacentHTML('beforeend', `
      <div class="cart-modal-overlay" id="cartOverlay"></div>
      <aside class="cart-modal" id="cartModal" role="dialog" aria-modal="true" aria-label="Carrito">
        <div class="cart-modal__header">
          <div>
            <span class="cart-modal__title">Carrito</span>
            <span class="cart-modal__count" id="cartModalCount"></span>
          </div>
          <button class="cart-modal__close" id="cartModalClose" aria-label="Cerrar carrito">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6"  y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="cart-modal__body"  id="cartModalBody"></div>
        <div class="cart-modal__footer" id="cartModalFooter"></div>
      </aside>
    `);
  }

  /* ── Renderizar contenido del modal ── */
  function render() {
    const cart   = getCart();
    const body   = document.getElementById('cartModalBody');
    const footer = document.getElementById('cartModalFooter');
    const count  = document.getElementById('cartModalCount');

    if (!body) return;

    /* Badge y contador */
    const totalQty = cart.reduce((s, p) => s + p.qty, 0);
    updateBadge();
    if (count) count.textContent = totalQty ? `(${totalQty})` : '';

    /* Carrito vacío */
    if (!cart.length) {
      body.innerHTML = `
        <div class="cart-modal__empty">
          <div class="cart-modal__empty-icon">🛒</div>
          <p>Tu carrito está vacío.<br/>Explorá el catálogo y agregá productos.</p>
        </div>`;
      footer.innerHTML = '';
      return;
    }

    /* Items */
    body.innerHTML = cart.map(p => `
      <div class="cart-item" data-id="${p.id}">
        <img class="cart-item__img" src="${p.image || ''}" alt="${p.name}"
             onerror="this.style.opacity='.15'"/>
        <div class="cart-item__info">
          <div class="cart-item__name">${p.name}</div>
          <div class="cart-item__desc">${p.desc || ''}</div>
          <div class="cart-item__footer">
            <span class="cart-item__price">${formatPrice(p.price * p.qty)}</span>
            <div class="cart-item__qty">
              <button class="qty-btn" data-id="${p.id}" data-delta="-1" aria-label="Restar">−</button>
              <span>${p.qty}</span>
              <button class="qty-btn" data-id="${p.id}" data-delta="1"  aria-label="Sumar">+</button>
            </div>
          </div>
        </div>
        <button class="cart-item__remove" data-id="${p.id}" aria-label="Eliminar">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
            <path d="M10 11v6M14 11v6"/>
          </svg>
        </button>
      </div>
    `).join('');

    /* Total */
    const total = cart.reduce((s, p) => s + p.price * p.qty, 0);
    footer.innerHTML = `
      <div class="cart-modal__total-row">
        <span class="cart-modal__total-label">Total</span>
        <span class="cart-modal__total-value">${formatPrice(total)}</span>
      </div>
      <button class="btn btn-primary cart-modal__checkout"
              onclick="window.location.href='/pages/checkout.html'">
        Finalizar compra
      </button>`;
  }

  /* ── Abrir / cerrar ── */
  function openCart() {
    render(); // siempre renderiza el estado actual al abrir
    document.getElementById('cartModal').classList.add('is-open');
    document.getElementById('cartOverlay').classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
  function closeCart() {
    document.getElementById('cartModal').classList.remove('is-open');
    document.getElementById('cartOverlay').classList.remove('is-open');
    document.body.style.overflow = '';
  }

  /* ── Init ── */
  document.addEventListener('DOMContentLoaded', () => {
    injectModal();
    updateBadge(); // solo actualiza el badge, NO abre el modal

    /* Botón del navbar */
    document.querySelector('.cart-btn')?.addEventListener('click', e => {
      e.preventDefault();
      openCart();
    });

    /* Cerrar */
    document.getElementById('cartOverlay').addEventListener('click', closeCart);
    document.getElementById('cartModalClose').addEventListener('click', closeCart);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeCart(); });

    /* Qty y eliminar (delegación) */
    document.getElementById('cartModalBody').addEventListener('click', e => {
      const qtyBtn    = e.target.closest('.qty-btn');
      const removeBtn = e.target.closest('.cart-item__remove');
      if (qtyBtn)    updateQty(qtyBtn.dataset.id, Number(qtyBtn.dataset.delta));
      if (removeBtn) removeItem(removeBtn.dataset.id);
    });
  });

  /* Exponemos updateBadge globalmente para que los scripts
     de catálogo y combos puedan llamarla después de agregar */
  window.cartModal = { updateBadge, render };

})();