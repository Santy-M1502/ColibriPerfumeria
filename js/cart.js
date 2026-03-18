/* ============================================
   cart.js — Lógica del carrito de compras
   Maneja: agregar, quitar, actualizar badge,
   persistencia en localStorage.
   ============================================ */

(function () {
  'use strict';

  const STORAGE_KEY = 'colibri_cart';

  /* ── Estado ── */
  let cart = loadCart();

  /* ── Carga desde localStorage ── */
  function loadCart() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  }

  /* ── Guarda en localStorage ── */
  function saveCart() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }

  /* ── Total de ítems ── */
  function getTotalItems() {
    return cart.reduce(function (sum, item) {
      return sum + (item.quantity || 1);
    }, 0);
  }

  /* ── Actualiza el badge visual ── */
  function updateBadge() {
    const badges = document.querySelectorAll('.cart-count');
    const total  = getTotalItems();
    badges.forEach(function (badge) {
      badge.textContent = total;
      badge.style.display = total === 0 ? 'none' : 'flex';
    });
  }

  /* ── Agrega un producto ── */
  function addItem(product) {
    /*  product: { id, name, price, image? }  */
    const existing = cart.find(function (i) { return i.id === product.id; });
    if (existing) {
      existing.quantity = (existing.quantity || 1) + 1;
    } else {
      cart.push(Object.assign({ quantity: 1 }, product));
    }
    saveCart();
    updateBadge();
    dispatchEvent('cart:updated', { cart: cart });
  }

  /* ── Quita un producto (por id) ── */
  function removeItem(id) {
    cart = cart.filter(function (i) { return i.id !== id; });
    saveCart();
    updateBadge();
    dispatchEvent('cart:updated', { cart: cart });
  }

  /* ── Cambia la cantidad ── */
  function setQuantity(id, quantity) {
    if (quantity <= 0) { removeItem(id); return; }
    const item = cart.find(function (i) { return i.id === id; });
    if (item) {
      item.quantity = quantity;
      saveCart();
      updateBadge();
      dispatchEvent('cart:updated', { cart: cart });
    }
  }

  /* ── Vacía el carrito ── */
  function clearCart() {
    cart = [];
    saveCart();
    updateBadge();
    dispatchEvent('cart:cleared', {});
  }

  /* ── Getter del estado ── */
  function getCart() {
    return cart.slice();
  }

  /* ── Subtotal ── */
  function getSubtotal() {
    return cart.reduce(function (sum, item) {
      return sum + (parseFloat(item.price) || 0) * (item.quantity || 1);
    }, 0);
  }

  /* ── CustomEvent helper ── */
  function dispatchEvent(name, detail) {
    document.dispatchEvent(new CustomEvent(name, { detail: detail }));
  }

  /* ── Delegación: click en botones "Agregar al carrito" ── */
  document.addEventListener('click', function (e) {
    const btn = e.target.closest('[data-add-to-cart]');
    if (!btn) return;
    const product = {
      id:    btn.dataset.productId    || btn.dataset.addToCart,
      name:  btn.dataset.productName  || 'Producto',
      price: btn.dataset.productPrice || 0,
      image: btn.dataset.productImage || '',
    };
    addItem(product);

    /* Feedback visual */
    btn.textContent = '✓ Agregado';
    btn.disabled = true;
    setTimeout(function () {
      btn.textContent = 'Agregar al carrito';
      btn.disabled = false;
    }, 1800);
  });

  /* ── API pública ── */
  window.Cart = {
    add:         addItem,
    remove:      removeItem,
    setQuantity: setQuantity,
    clear:       clearCart,
    getItems:    getCart,
    getSubtotal: getSubtotal,
    getTotal:    getTotalItems,
  };

  /* ── Init ── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateBadge);
  } else {
    updateBadge();
  }
})();