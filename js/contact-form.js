/* ============================================
   contact-form.js — Envío real con EmailJS
   ============================================ */

const EMAILJS_PUBLIC_KEY  = 'fXQo5o4zcjHpasUdo';
const EMAILJS_SERVICE_ID  = 'service_unrzbav';
const EMAILJS_TEMPLATE_ID = 'template_6w0gw2a';

(function loadEmailJS() {
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
  script.onload = () => emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  document.head.appendChild(script);
})();

(function () {
  'use strict';

  function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const submitBtn = form.querySelector('[type="submit"]');

    function validateField(field) {
      const value = field.value.trim();
      let error = '';
      if (field.required && !value) {
        error = 'Este campo es obligatorio.';
      } else if (field.type === 'email' && value) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          error = 'Ingresá un email válido.';
      } else if (field.minLength && value.length < field.minLength) {
        error = `Mínimo ${field.minLength} caracteres.`;
      }
      setFieldState(field, error);
      return !error;
    }

    function setFieldState(field, error) {
      field.style.borderColor = error ? 'rgba(255,100,100,0.55)' : 'rgba(0,180,216,0.18)';
      let el = field.parentNode.querySelector('.field-error');
      if (!el) {
        el = document.createElement('span');
        el.className = 'field-error';
        Object.assign(el.style, {
          display: 'block', marginTop: '0.3rem',
          fontSize: '0.73rem', color: 'rgba(255,100,100,0.8)',
        });
        field.parentNode.appendChild(el);
      }
      el.textContent = error;
    }

    form.querySelectorAll('input, textarea').forEach(field => {
      field.addEventListener('blur', () => validateField(field));
      field.addEventListener('input', () => {
        if (field.parentNode.querySelector('.field-error')?.textContent)
          validateField(field);
      });
    });

    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      const fields = [...form.querySelectorAll('input, textarea')];
      if (!fields.every(f => validateField(f))) return;

      setLoading(true);

      const templateParams = {
        nombre:   form.nombre.value.trim(),
        email:    form.email.value.trim(),
        asunto:   form.asunto?.value.trim() || '(sin asunto)',
        mensaje:  form.mensaje.value.trim(),
        reply_to: form.email.value.trim(),
      };

      try {
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
        form.reset();
        fields.forEach(f => setFieldState(f, ''));
        showBanner('success', '✓ ¡Mensaje enviado! Te respondemos a la brevedad.');
      } catch (err) {
        console.error('EmailJS error:', err);
        showBanner('error', '✗ Hubo un problema al enviar. Intentá de nuevo o escribinos directamente.');
      } finally {
        setLoading(false);
      }
    });

    function setLoading(loading) {
      if (!submitBtn) return;
      submitBtn.disabled = loading;
      submitBtn.textContent = loading ? 'Enviando...' : 'Enviar mensaje';
    }

    function showBanner(type, text) {
      let banner = form.querySelector('.form-banner');
      if (!banner) {
        banner = document.createElement('div');
        banner.className = 'form-banner';
        Object.assign(banner.style, {
          marginTop: '1rem', padding: '0.85rem 1rem',
          borderRadius: '10px', fontSize: '0.875rem',
          textAlign: 'center', transition: 'opacity 0.3s',
        });
        form.appendChild(banner);
      }
      Object.assign(banner.style, type === 'success'
        ? { background: 'rgba(0,180,216,0.1)', border: '1px solid rgba(0,180,216,0.3)', color: 'var(--cyan-light)' }
        : { background: 'rgba(255,80,80,0.08)', border: '1px solid rgba(255,80,80,0.3)', color: 'rgba(255,120,120,0.9)' }
      );
      banner.textContent = text;
      banner.style.display = 'block';
      banner.style.opacity = '1';
      clearTimeout(banner._timer);
      banner._timer = setTimeout(() => {
        banner.style.opacity = '0';
        setTimeout(() => { banner.style.display = 'none'; }, 300);
      }, 6000);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initContactForm);
  } else {
    initContactForm();
  }
})();