/* ============================================
   contact-form.js — Validación y envío de contacto
   Busca el formulario #contactForm.
   Emite evento 'form:submitted' con los datos.
   ============================================ */

(function () {
  'use strict';

  function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const submitBtn = form.querySelector('[type="submit"], .btn-primary');

    /* ── Validación de campo individual ── */
    function validateField(field) {
      const value = field.value.trim();
      const type  = field.type || field.tagName.toLowerCase();
      let   error = '';

      if (field.required && !value) {
        error = 'Este campo es obligatorio.';
      } else if (type === 'email' && value) {
        const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRx.test(value)) error = 'Ingresá un email válido.';
      } else if (field.minLength && value.length < field.minLength) {
        error = `Mínimo ${field.minLength} caracteres.`;
      }

      showFieldError(field, error);
      return !error;
    }

    /* ── Muestra/oculta error bajo el campo ── */
    function showFieldError(field, message) {
      let errorEl = field.parentNode.querySelector('.field-error');
      if (!errorEl) {
        errorEl = document.createElement('span');
        errorEl.className = 'field-error';
        errorEl.style.cssText = [
          'display:block',
          'margin-top:0.3rem',
          'font-size:0.75rem',
          'color:rgba(255,100,100,0.85)',
          'letter-spacing:0.02em',
        ].join(';');
        field.parentNode.appendChild(errorEl);
      }
      errorEl.textContent = message;
      field.style.borderColor = message
        ? 'rgba(255,100,100,0.6)'
        : 'rgba(0,180,216,0.2)';
    }

    /* ── Validación en tiempo real ── */
    form.querySelectorAll('input, textarea, select').forEach(function (field) {
      field.addEventListener('blur', function () { validateField(this); });
      field.addEventListener('input', function () {
        if (this.parentNode.querySelector('.field-error')?.textContent) {
          validateField(this);
        }
      });
    });

    /* ── Submit ── */
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const fields   = Array.from(form.querySelectorAll('input, textarea, select'));
      const allValid = fields.every(function (f) { return validateField(f); });
      if (!allValid) return;

      /* Estado de carga */
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';
      }

      /* Recopila datos */
      const formData = {};
      fields.forEach(function (f) {
        if (f.name) formData[f.name] = f.value.trim();
      });

      /* Emit evento — conectar con tu backend o servicio */
      document.dispatchEvent(
        new CustomEvent('form:submitted', { detail: { data: formData } })
      );

      /* Simulación de envío exitoso (reemplazar con fetch real) */
      setTimeout(function () {
        form.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = '✓ Mensaje enviado';
          setTimeout(function () {
            submitBtn.textContent = 'Enviar mensaje';
          }, 3000);
        }
        showSuccessMessage(form);
      }, 1000);
    });
  }

  /* ── Mensaje de éxito ── */
  function showSuccessMessage(form) {
    let msg = form.querySelector('.form-success');
    if (!msg) {
      msg = document.createElement('div');
      msg.className = 'form-success';
      msg.style.cssText = [
        'margin-top:1rem',
        'padding:0.85rem 1rem',
        'border-radius:10px',
        'background:rgba(0,180,216,0.1)',
        'border:1px solid rgba(0,180,216,0.3)',
        'color:var(--cyan-light)',
        'font-size:0.875rem',
        'text-align:center',
      ].join(';');
      form.appendChild(msg);
    }
    msg.textContent = '¡Tu mensaje fue enviado! Te respondemos pronto.';
    msg.style.display = 'block';
    setTimeout(function () { msg.style.display = 'none'; }, 5000);
  }

  /* ── Init ── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initContactForm);
  } else {
    initContactForm();
  }
})();