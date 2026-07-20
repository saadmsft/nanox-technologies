/* =============================================================
   NANOX TECHNOLOGIES — main.js (2026)
   - Theme toggle (FOUC-safe init handled inline in <head>)
   - Header scroll, announcement bar
   - Mobile menu
   - Accessible accordions (services + FAQ)
   - Scroll reveal (IntersectionObserver, reduced-motion aware)
   - Smooth-scroll anchors
   - Contact form (Web3Forms AJAX, honeypot, validation)
   - Lazy Calendly
   - WebGL hero gradient (lightweight)
   - Cookie consent + GA4 gating
   ============================================================= */

(() => {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------------------------------------------------------------
  // Theme (dark-only, no toggle)
  // ---------------------------------------------------------------

  // ---------------------------------------------------------------
  // Header scroll effect
  // ---------------------------------------------------------------
  function initHeader() {
    const header = document.querySelector('.header');
    if (!header) return;
    const update = () => {
      header.classList.toggle('scrolled', window.scrollY > 10);
      header.classList.toggle('transparent', window.scrollY <= 10);
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  // ---------------------------------------------------------------
  // Announcement bar
  // ---------------------------------------------------------------
  function initAnnouncementBar() {
    const bar = document.querySelector('.announcement-bar');
    if (!bar) return;
    if (sessionStorage.getItem('nanox-announce-dismissed') === '1') {
      bar.style.display = 'none';
      return;
    }
    bar.querySelector('.close-btn')?.addEventListener('click', () => {
      bar.style.display = 'none';
      try { sessionStorage.setItem('nanox-announce-dismissed', '1'); } catch (_) {}
    });
  }

  // ---------------------------------------------------------------
  // Mobile menu
  // ---------------------------------------------------------------
  function initMobileMenu() {
    const btn = document.querySelector('.mobile-menu-btn');
    const close = document.querySelector('.mobile-menu .close-btn');
    const overlay = document.querySelector('.mobile-menu-overlay');
    const menu = document.querySelector('.mobile-menu');
    if (!btn || !menu) return;

    const open = () => {
      overlay?.classList.add('active');
      menu.classList.add('active');
      menu.setAttribute('aria-hidden', 'false');
      btn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    };
    const shut = () => {
      overlay?.classList.remove('active');
      menu.classList.remove('active');
      menu.setAttribute('aria-hidden', 'true');
      btn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    };

    btn.addEventListener('click', open);
    close?.addEventListener('click', shut);
    overlay?.addEventListener('click', shut);
    menu.querySelectorAll('nav a').forEach(a => a.addEventListener('click', shut));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') shut(); });
  }

  // ---------------------------------------------------------------
  // Accordions (accessible)
  // ---------------------------------------------------------------
  function initAccordions() {
    document.querySelectorAll('.accordion-item').forEach((item, idx) => {
      const trigger = item.querySelector('.accordion-trigger');
      const content = item.querySelector('.accordion-content');
      if (!trigger || !content) return;

      const id = content.id || `acc-content-${idx}-${Math.random().toString(36).slice(2, 7)}`;
      content.id = id;
      trigger.setAttribute('aria-expanded', 'false');
      trigger.setAttribute('aria-controls', id);
      content.setAttribute('role', 'region');

      trigger.addEventListener('click', () => {
        const wasActive = item.classList.contains('active');
        const container = item.closest('.accordion-container');
        container?.querySelectorAll('.accordion-item').forEach(i => {
          i.classList.remove('active');
          i.querySelector('.accordion-trigger')?.setAttribute('aria-expanded', 'false');
        });
        if (!wasActive) {
          item.classList.add('active');
          trigger.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  // ---------------------------------------------------------------
  // Scroll reveal
  // ---------------------------------------------------------------
  function initScrollReveal() {
    const els = document.querySelectorAll('.fade-up, .fade-in, .slide-in-left, .slide-in-right');
    if (reducedMotion) {
      els.forEach(el => el.classList.add('visible'));
      return;
    }
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(el => io.observe(el));
  }

  // ---------------------------------------------------------------
  // Smooth-scroll anchor links
  // ---------------------------------------------------------------
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const href = a.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
        }
      });
    });
  }

  // ---------------------------------------------------------------
  // Contact form (Web3Forms)
  // ---------------------------------------------------------------
  function initContactForm() {
    const form = document.querySelector('[data-contact-form]');
    if (!form) return;
    const status = form.querySelector('.form-status');
    const submit = form.querySelector('button[type="submit"]');

    const setStatus = (msg, kind) => {
      if (!status) return;
      status.textContent = msg;
      status.classList.remove('success', 'error');
      if (kind) status.classList.add(kind);
      status.hidden = false;
    };

    form.addEventListener('submit', async e => {
      e.preventDefault();
      const data = new FormData(form);

      // Honeypot — bot-filled means silent reject
      if (data.get('website')) {
        setStatus('Thanks — we will be in touch shortly.', 'success');
        form.reset();
        return;
      }

      const accessKey = form.dataset.accessKey;
      const useFallback = !accessKey || accessKey === 'YOUR_WEB3FORMS_ACCESS_KEY';

      // mailto: fallback so the form is functional immediately even before
      // a Web3Forms key is configured. Opens the user's email client with
      // a pre-composed message to support@nanoxtech.ai.
      if (useFallback) {
        const fallbackTo = form.dataset.mailto || 'support@nanoxtech.ai';
        const name    = (data.get('name')    || '').toString().trim();
        const email   = (data.get('email')   || '').toString().trim();
        const company = (data.get('company') || '').toString().trim();
        const role    = (data.get('role')    || '').toString().trim();
        const topic   = (data.get('topic')   || '').toString().trim();
        const message = (data.get('message') || '').toString().trim();

        if (!name || !email || !message) {
          setStatus('Please fill in your name, email, and a brief project context.', 'error');
          return;
        }

        const subject = `New enquiry — ${name}${company ? ' (' + company + ')' : ''}`;
        const body = [
          `Name: ${name}`,
          `Email: ${email}`,
          company ? `Company: ${company}` : null,
          role    ? `Role: ${role}` : null,
          topic   ? `Topic: ${topic}` : null,
          '',
          'Project context:',
          message,
        ].filter(Boolean).join('\n');

        const href = `mailto:${fallbackTo}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = href;
        setStatus("Opening your email app… If nothing happens, email " + fallbackTo + " directly.", 'success');
        return;
      }

      data.set('access_key', accessKey);
      data.set('subject', `New enquiry — ${data.get('name') || 'Nanox site'}`);
      data.set('from_name', 'Nanox Technologies Website');

      submit.disabled = true;
      const original = submit.textContent;
      submit.textContent = 'Sending…';
      setStatus('Sending…', null);

      try {
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: data,
        });
        const json = await res.json().catch(() => ({}));
        if (res.ok && json.success) {
          form.reset();
          setStatus("Thanks — we'll be in touch within one business day.", 'success');
        } else {
          setStatus(json.message || 'Something went wrong. Please email support@nanoxtech.ai.', 'error');
        }
      } catch (_) {
        setStatus('Network error. Please email support@nanoxtech.ai.', 'error');
      } finally {
        submit.disabled = false;
        submit.textContent = original;
      }
    });
  }

  // ---------------------------------------------------------------
  // Calendly lazy load
  // ---------------------------------------------------------------
  function initCalendly() {
    const target = document.querySelector('[data-calendly-url]');
    if (!target) return;
    const url = target.dataset.calendlyUrl;
    if (!url || url === 'YOUR_CALENDLY_URL') return; // not configured yet

    const load = () => {
      // Calendly inline widget needs the URL set on a child div with class calendly-inline-widget
      target.classList.add('calendly-inline-widget');
      target.setAttribute('data-url', url);
      target.style.minWidth = '320px';
      target.style.height = '700px';

      if (!document.getElementById('calendly-script')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://assets.calendly.com/assets/external/widget.css';
        document.head.appendChild(link);

        const s = document.createElement('script');
        s.id = 'calendly-script';
        s.src = 'https://assets.calendly.com/assets/external/widget.js';
        s.async = true;
        document.body.appendChild(s);
      }
    };

    if (reducedMotion) return; // user can use mailto fallback
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          load();
          io.disconnect();
        }
      });
    }, { rootMargin: '200px' });
    io.observe(target);
  }

  // ---------------------------------------------------------------
  // WebGL hero — animated gradient mesh on a canvas
  // (Lightweight, no library; falls back gracefully)
  // ---------------------------------------------------------------
  function initHeroCanvas() {
    const canvas = document.querySelector('.hero-canvas');
    if (!canvas || reducedMotion) return;
    const conn = navigator.connection;
    if (conn && (conn.saveData || /^([23]g|slow-2g)$/.test(conn.effectiveType || ''))) return;

    const gl = canvas.getContext('webgl', { alpha: true, antialias: false, premultipliedAlpha: false });
    if (!gl) return;

    const vsrc = `
      attribute vec2 a;
      void main(){ gl_Position = vec4(a, 0.0, 1.0); }
    `;
    // Animated noise / gradient field — cheap two-blob mesh
    const fsrc = `
      precision mediump float;
      uniform vec2 u_res;
      uniform float u_t;
      uniform float u_dark;

      float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float n(vec2 p){
        vec2 i = floor(p), f = fract(p);
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        vec2 u = f*f*(3.0-2.0*f);
        return mix(a, b, u.x) + (c - a)*u.y*(1.0 - u.x) + (d - b)*u.x*u.y;
      }

      void main(){
        vec2 uv = gl_FragCoord.xy / u_res.xy;
        vec2 p = uv * 2.0 - 1.0;
        p.x *= u_res.x / u_res.y;

        float t = u_t * 0.08;
        // Two slow-drifting blobs
        vec2 b1 = vec2(sin(t*1.3)*0.8, cos(t*1.1)*0.5);
        vec2 b2 = vec2(cos(t*0.7)*0.9, sin(t*0.9)*0.6);

        float d1 = 1.0 - smoothstep(0.0, 1.4, length(p - b1));
        float d2 = 1.0 - smoothstep(0.0, 1.2, length(p - b2));

        float gn = n(p * 1.5 + t*0.3) * 0.15;

        // Brand colors (linear-ish)
        vec3 blue = vec3(0.357, 0.659, 0.804);   // #5BA8CC
        vec3 red  = vec3(0.933, 0.239, 0.247);   // #EE3D3F
        vec3 deep = vec3(0.027, 0.035, 0.102);   // bg

        vec3 col = mix(deep, blue, d1 * 0.55);
        col = mix(col, red,  d2 * 0.30);
        col += gn;

        // Light theme: lower red, higher base
        if (u_dark < 0.5) {
          col = mix(vec3(0.98, 0.98, 0.99), col, 0.55);
        }

        // Vignette
        float v = smoothstep(1.4, 0.4, length(p));
        col *= mix(0.7, 1.0, v);

        gl_FragColor = vec4(col, mix(0.0, 0.85, v));
      }
    `;

    function compile(type, src) {
      const s = gl.createShader(type);
      gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { gl.deleteShader(s); return null; }
      return s;
    }
    const vs = compile(gl.VERTEX_SHADER, vsrc);
    const fs = compile(gl.FRAGMENT_SHADER, fsrc);
    if (!vs || !fs) return;
    const prog = gl.createProgram();
    gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW);
    const aLoc = gl.getAttribLocation(prog, 'a');
    gl.enableVertexAttribArray(aLoc);
    gl.vertexAttribPointer(aLoc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, 'u_res');
    const uT   = gl.getUniformLocation(prog, 'u_t');
    const uDark = gl.getUniformLocation(prog, 'u_dark');

    function size() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = canvas.clientWidth * dpr;
      const h = canvas.clientHeight * dpr;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w; canvas.height = h;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
    }

    let raf, t0 = performance.now(), running = true;
    function frame() {
      if (!running) return;
      size();
      const t = (performance.now() - t0) / 1000;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uT, t);
      gl.uniform1f(uDark, document.documentElement.getAttribute('data-theme') === 'light' ? 0.0 : 1.0);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      raf = requestAnimationFrame(frame);
    }
    frame();

    // Pause when off-screen
    const io = new IntersectionObserver(([e]) => {
      running = e.isIntersecting;
      if (running) { t0 = performance.now() - (t0 ? 0 : 0); frame(); }
      else { cancelAnimationFrame(raf); }
    });
    io.observe(canvas);

    window.addEventListener('resize', size);
  }

  // ---------------------------------------------------------------
  // Cookie consent + GA4 gating
  // ---------------------------------------------------------------
  function initCookieConsent() {
    const banner = document.querySelector('[data-cookie-banner]');
    if (!banner) return;

    const stored = (() => { try { return localStorage.getItem('nanox-consent'); } catch (_) { return null; } })();
    const gaId = banner.dataset.gaId;

    function loadGA() {
      if (!gaId || gaId === 'YOUR_GA4_ID' || window.gtagLoaded) return;
      window.gtagLoaded = true;
      const s = document.createElement('script');
      s.async = true;
      s.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
      document.head.appendChild(s);
      window.dataLayer = window.dataLayer || [];
      window.gtag = function() { window.dataLayer.push(arguments); };
      window.gtag('js', new Date());
      window.gtag('config', gaId, { anonymize_ip: true });
    }

    if (stored === 'accepted') { loadGA(); return; }
    if (stored === 'rejected') return;

    // Show after small delay (post-LCP)
    setTimeout(() => banner.classList.add('show'), 1200);

    banner.querySelector('[data-consent-accept]')?.addEventListener('click', () => {
      try { localStorage.setItem('nanox-consent', 'accepted'); } catch (_) {}
      banner.classList.remove('show');
      loadGA();
    });
    banner.querySelector('[data-consent-reject]')?.addEventListener('click', () => {
      try { localStorage.setItem('nanox-consent', 'rejected'); } catch (_) {}
      banner.classList.remove('show');
    });
  }

  // ---------------------------------------------------------------
  // Boot
  // ---------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    initHeader();
    initAnnouncementBar();
    initMobileMenu();
    initAccordions();
    initScrollReveal();
    initSmoothScroll();
    initContactForm();
    initCalendly();
    initHeroCanvas();
    initCookieConsent();
  });
})();
