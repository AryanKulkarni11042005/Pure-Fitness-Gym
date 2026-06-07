/**
 * PURE FITNESS GYM — main.js
 * GSAP 3.x + ScrollTrigger animations, Lucide icons init,
 * slider, counter, ticker, navbar, WhatsApp reveal.
 */

/* ─── Wait for GSAP scripts ──────────────────────────── */
window.addEventListener('load', () => {
  // Init Lucide icons immediately
  if (typeof lucide !== 'undefined') lucide.createIcons();

  // Register GSAP plugins
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  runPreloader();
});

/* ════════════════════════════════════════════════
   1. PRELOADER
════════════════════════════════════════════════ */
function runPreloader() {
  const pre  = document.getElementById('preloader');
  const fill = document.getElementById('preFill');
  let pct = 0;

  const tick = setInterval(() => {
    pct += Math.random() * 20;
    if (pct >= 100) {
      pct = 100;
      clearInterval(tick);
      fill.style.width = '100%';

      setTimeout(() => {
        if (typeof gsap !== 'undefined') {
          gsap.to(pre, {
            opacity: 0, duration: 0.55, ease: 'power2.inOut',
            onComplete: () => { pre.style.display = 'none'; boot(); }
          });
        } else {
          pre.style.opacity = '0';
          pre.style.transition = 'opacity .55s';
          setTimeout(() => { pre.style.display = 'none'; boot(); }, 600);
        }
      }, 350);
    } else {
      fill.style.width = pct + '%';
    }
  }, 75);
}

/* ════════════════════════════════════════════════
   2. BOOT — run all modules
════════════════════════════════════════════════ */
function boot() {
  initNav();
  initMobileMenu();
  initHero();
  initTicker();
  initScrollAnims();
  initSlider();
  initCounters();
  initWhatsApp();
  initParallax();
}

/* ════════════════════════════════════════════════
   3. NAVBAR
════════════════════════════════════════════════ */
function initNav() {
  const nav   = document.getElementById('nav');
  const links = document.querySelectorAll('.nav-links a');

  const update = () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);

    // Active link based on scroll position
    const sections = document.querySelectorAll('section[id], div[id="ticker"]');
    let active = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 140) active = s.id;
    });
    links.forEach(l => {
      const match = l.getAttribute('href') === '#' + active;
      l.classList.toggle('active', match);
    });
  };

  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ════════════════════════════════════════════════
   4. MOBILE MENU
════════════════════════════════════════════════ */
function initMobileMenu() {
  const burger  = document.getElementById('burger');
  const drawer  = document.getElementById('drawer');
  const dLinks  = document.querySelectorAll('.drawer-link, .drawer-pill');

  burger.addEventListener('click', () => {
    const open = drawer.classList.toggle('open');
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    drawer.setAttribute('aria-hidden', String(!open));
  });

  dLinks.forEach(l => l.addEventListener('click', () => {
    drawer.classList.remove('open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    drawer.setAttribute('aria-hidden', 'true');
  }));
}

/* ════════════════════════════════════════════════
   5. HERO ENTRANCE (GSAP)
════════════════════════════════════════════════ */
function initHero() {
  if (typeof gsap === 'undefined') return;

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.fromTo('#hKicker',  { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.65 })
    .fromTo('#hTitle',   { opacity: 0, y: 48 }, { opacity: 1, y: 0, duration: 0.9 },  '-=0.35')
    .fromTo('#hCopy',    { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.65 }, '-=0.5')
    .fromTo('#hActions', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.55 }, '-=0.4')
    .fromTo('#hStats',   { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.55 }, '-=0.3');
}

/* ════════════════════════════════════════════════
   6. TICKER (GSAP infinite scroll)
════════════════════════════════════════════════ */
function initTicker() {
  const origTrack = document.getElementById('tickerTrack');
  if (!origTrack) return;

  // Clone for seamless loop
  const clone = origTrack.cloneNode(true);
  origTrack.parentElement.appendChild(clone);

  if (typeof gsap !== 'undefined') {
    const tracks = document.querySelectorAll('.ticker-track');
    const w = origTrack.scrollWidth;

    gsap.set(tracks, { x: 0 });
    gsap.to(tracks, {
      x: -w,
      duration: 30,
      ease: 'none',
      repeat: -1,
      modifiers: { x: gsap.utils.unitize(x => parseFloat(x) % w) }
    });
  }
}

/* ════════════════════════════════════════════════
   7. SCROLL-TRIGGERED ANIMATIONS
════════════════════════════════════════════════ */
function initScrollAnims() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  const reveal = (selector, vars, triggerEl) => {
    gsap.fromTo(selector,
      { opacity: 0, ...vars.from },
      {
        opacity: 1, ...vars.to,
        scrollTrigger: { trigger: triggerEl || selector, start: 'top 84%' }
      }
    );
  };

  // About
  gsap.fromTo('#aboutVisual', { opacity: 0, x: -56 }, {
    opacity: 1, x: 0, duration: 0.9, ease: 'power3.out',
    scrollTrigger: { trigger: '#aboutVisual', start: 'top 82%' }
  });
  gsap.fromTo('#aboutText', { opacity: 0, x: 56 }, {
    opacity: 1, x: 0, duration: 0.9, ease: 'power3.out',
    scrollTrigger: { trigger: '#aboutText', start: 'top 82%' }
  });

  // Section heads
  ['#servicesHead', '#testimonialsHead', '#membershipHead', '#locationHead'].forEach(id => {
    gsap.fromTo(id, { opacity: 0, y: 36 }, {
      opacity: 1, y: 0, duration: 0.7, ease: 'power2.out',
      scrollTrigger: { trigger: id, start: 'top 86%' }
    });
  });

  // Service cards — stagger
  gsap.fromTo('.svc-card', { opacity: 0, y: 44, scale: 0.95 }, {
    opacity: 1, y: 0, scale: 1,
    duration: 0.6, ease: 'back.out(1.3)',
    stagger: 0.08,
    scrollTrigger: { trigger: '#servicesGrid', start: 'top 82%' }
  });

  // Pillars
  gsap.fromTo('.pillar', { opacity: 0, y: 28 }, {
    opacity: 1, y: 0, duration: 0.55, stagger: 0.1, ease: 'power2.out',
    scrollTrigger: { trigger: '#pillarsGrid', start: 'top 86%' }
  });

  // Review cards
  gsap.fromTo('.review-card', { opacity: 0, y: 44, scale: 0.96 }, {
    opacity: 1, y: 0, scale: 1,
    duration: 0.65, ease: 'back.out(1.2)', stagger: 0.12,
    scrollTrigger: { trigger: '#reviewsTrack', start: 'top 84%' }
  });

  // Rating bar
  gsap.fromTo('#ratingBar', { opacity: 0, y: 24 }, {
    opacity: 1, y: 0, duration: 0.65, ease: 'power2.out',
    scrollTrigger: { trigger: '#ratingBar', start: 'top 88%' }
  });

  // Plan cards
  gsap.fromTo('.plan-card', { opacity: 0, y: 40 }, {
    opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out',
    scrollTrigger: { trigger: '#plansRow', start: 'top 84%' }
  });

  // Location
  gsap.fromTo('#mapBox', { opacity: 0, x: -40 }, {
    opacity: 1, x: 0, duration: 0.8, ease: 'power3.out',
    scrollTrigger: { trigger: '#mapBox', start: 'top 84%' }
  });
  gsap.fromTo('.loc-card', { opacity: 0, x: 40 }, {
    opacity: 1, x: 0, duration: 0.6, stagger: 0.12, ease: 'power2.out',
    scrollTrigger: { trigger: '#locationCards', start: 'top 84%' }
  });
}

/* ════════════════════════════════════════════════
   8. TESTIMONIALS SLIDER
════════════════════════════════════════════════ */
function initSlider() {
  const track  = document.getElementById('reviewsTrack');
  const cards  = track ? [...track.querySelectorAll('.review-card')] : [];
  const prev   = document.getElementById('rPrev');
  const next   = document.getElementById('rNext');
  const dots   = document.querySelectorAll('.rdot');
  let cur = 0, timer;

  if (!track || !cards.length) return;

  const perView = () => window.innerWidth <= 768 ? 1 : window.innerWidth <= 1024 ? 2 : 3;
  const maxIdx  = () => Math.max(0, cards.length - perView());

  const go = idx => {
    cur = Math.max(0, Math.min(idx, maxIdx()));
    const gap  = 20;
    const w    = cards[0].offsetWidth + gap;
    track.style.transform = `translateX(-${cur * w}px)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === cur));
  };

  const auto = () => { clearInterval(timer); timer = setInterval(() => go(cur >= maxIdx() ? 0 : cur + 1), 4500); };

  prev && prev.addEventListener('click', () => { go(cur - 1); auto(); });
  next && next.addEventListener('click', () => { go(cur + 1); auto(); });
  dots.forEach(d => d.addEventListener('click', () => { go(+d.dataset.i); auto(); }));

  track.addEventListener('mouseenter', () => clearInterval(timer));
  track.addEventListener('mouseleave', auto);

  // Touch swipe
  let tx = 0;
  track.addEventListener('touchstart', e => { tx = e.changedTouches[0].screenX; }, { passive: true });
  track.addEventListener('touchend',   e => {
    const diff = tx - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 40) { diff > 0 ? go(cur + 1) : go(cur - 1); }
  }, { passive: true });

  let rt;
  window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => go(cur), 200); });

  go(0); auto();
}

/* ════════════════════════════════════════════════
   9. COUNT-UP STATS
════════════════════════════════════════════════ */
function initCounters() {
  const els = document.querySelectorAll('.hstat-n');
  if (!els.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = +el.dataset.target;
      const dur = 1600;
      const start = performance.now();
      const tick = now => {
        const t = Math.min((now - start) / dur, 1);
        el.textContent = Math.round((1 - Math.pow(1 - t, 3)) * target);
        if (t < 1) requestAnimationFrame(tick);
        else el.textContent = target;
      };
      requestAnimationFrame(tick);
      obs.unobserve(el);
    });
  }, { threshold: 0.6 });

  els.forEach(el => obs.observe(el));
}

/* ════════════════════════════════════════════════
   10. WHATSAPP FLOAT REVEAL
════════════════════════════════════════════════ */
function initWhatsApp() {
  const wa = document.getElementById('waFloat');
  if (!wa) return;

  const check = () => {
    const shown = window.scrollY > 280;
    wa.classList.toggle('visible', shown);
  };

  window.addEventListener('scroll', check, { passive: true });
  check();
}

/* ════════════════════════════════════════════════
   11. HERO PARALLAX (subtle)
════════════════════════════════════════════════ */
function initParallax() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.to('.hero-img', {
    yPercent: 18,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });
}

/* ════════════════════════════════════════════════
   12. SMOOTH SCROLL
════════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const offset = document.getElementById('nav').offsetHeight;
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
  });
});
