const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.primary-nav');
if (toggle && nav) {
  document.documentElement.classList.add('js-nav');
  const close = () => {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menu');
  };
  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Cerrar menu' : 'Abrir menu');
  });
  nav.addEventListener('click', (event) => {
    if (event.target.closest('a')) close();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') close();
  });
}

const form = document.querySelector('#lead-form');
if (form) {
  const status = document.querySelector('#form-status');
  const button = form.querySelector('button[type="submit"]');
  const show = (message, state = 'error') => {
    status.textContent = message;
    status.dataset.state = state;
  };
  if (form.dataset.enabled !== 'true') {
    button.disabled = true;
    show('Formulario de demostracion: configura correo y Turnstile antes de habilitarlo.');
  } else {
    button.disabled = false;
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      button.disabled = true;
      show('Enviando...', 'progress');
      const data = new FormData(form);
      const payload = {
        name: data.get('name'), email: data.get('email'), phone: data.get('phone'),
        service: data.get('service'), message: data.get('message'),
        website: data.get('website'), privacy: data.get('privacy'),
        turnstileToken: data.get('cf-turnstile-response')
      };
      try {
        const response = await fetch('/api/contact', {
          method: 'POST', headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(payload)
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok || !result.ok) throw new Error(result.message || 'No se pudo enviar. Intentalo de nuevo.');
        show('Solicitud enviada. Nos pondremos en contacto contigo.', 'success');
        form.reset();
        if (window.turnstile) window.turnstile.reset();
      } catch (error) {
        show(error.message || 'Error de conexion. Intentalo mas tarde.');
        if (window.turnstile) window.turnstile.reset();
      } finally { button.disabled = false; }
    });
  }
}

// Progressive enhancement: content remains visible without JS or with reduced motion.
const motion = document.body.dataset.motion !== 'off' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (motion) {
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(({target, isIntersecting}) => {
        if (isIntersecting) { target.classList.remove('reveal-pending'); observer.unobserve(target); }
      });
    }, {threshold: 0.08});
    document.querySelectorAll('[data-reveal], .gallery-grid figure').forEach(el => {
      if (el.getBoundingClientRect().top > window.innerHeight + 25) {
        el.classList.add('reveal-pending'); observer.observe(el);
      }
    });
    document.addEventListener('focusin', e => e.target.closest('.reveal-pending')?.classList.remove('reveal-pending'));
  }
  const progress = document.querySelector('.reading-progress');
  if (progress) {
    let pending = false;
    const update = () => { const range = document.documentElement.scrollHeight - innerHeight; progress.style.transform = `scaleX(${range > 0 ? Math.max(0, Math.min(1, scrollY / range)) : 0})`; pending = false; };
    const queue = () => { if (!pending) { pending = true; requestAnimationFrame(update); } };
    window.addEventListener('scroll', queue, {passive:true}); window.addEventListener('resize', queue); update();
  }
}
