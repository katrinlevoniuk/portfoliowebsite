/* =============================================
   KATERYNA LEVONIUK — script.js v4
   ============================================= */

// ─── CURSOR ──────────────────────────────────
const cursor   = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');

if (cursor && follower) {
  let mx = 0, my = 0, fx = 0, fy = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  (function animFollower() {
    fx += (mx - fx) * 0.11;
    fy += (my - fy) * 0.11;
    follower.style.left = fx + 'px';
    follower.style.top  = fy + 'px';
    requestAnimationFrame(animFollower);
  })();

  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-link'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-link'));
  });

  document.querySelectorAll('.project').forEach(el => {
    el.addEventListener('mouseenter', () => {
      document.body.classList.remove('cursor-link');
      document.body.classList.add('cursor-hover');
    });
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0'; follower.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1'; follower.style.opacity = '1';
  });
}

// ─── NAV ─────────────────────────────────────
const nav = document.getElementById('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

// ─── MOBILE NAV ──────────────────────────────
const toggle   = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

if (toggle && navLinks) {
  toggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', false);
      document.body.style.overflow = '';
    });
  });
}

// ─── SCROLL REVEAL ───────────────────────────
const revealEls = document.querySelectorAll('.reveal-up');

if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const d = parseInt(e.target.dataset.delay || 0);
      setTimeout(() => e.target.classList.add('in'), d);
      io.unobserve(e.target);
    });
  }, { threshold: 0.06, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => io.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('in'));
}

// ─── HERO MORPH ──────────────────────────────
const morph = document.getElementById('heroMorph');
if (morph) {
  const words = [
    'convert more',
    'retain users',
    'reduce drop-off',
    'grow faster',
    'ship clearer'
  ];
  let wi = 0, ci = 0, deleting = false;

  function type() {
    const w = words[wi];
    morph.textContent = deleting ? w.slice(0, ci--) : w.slice(0, ++ci);
    let delay = deleting ? 45 : 75;
    if (!deleting && ci === w.length) { delay = 2400; deleting = true; }
    else if (deleting && ci === 0) { deleting = false; wi = (wi + 1) % words.length; delay = 350; }
    setTimeout(type, delay);
  }

  setTimeout(type, 2600);
}

// ─── TESTIMONIALS SLIDER ─────────────────────
const slider     = document.getElementById('slider');
const sliderPrev = document.getElementById('sliderPrev');
const sliderNext = document.getElementById('sliderNext');
const dotsWrap   = document.getElementById('sliderDots');

if (slider && sliderPrev && sliderNext) {
  const slides = slider.querySelectorAll('.slide');
  const total  = slides.length;
  let current  = 0;
  let autoTimer;

  // Build dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Go to review ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  function goTo(n) {
    current = (n + total) % total;
    slider.style.transform = `translateX(-${current * 100}%)`;
    dotsWrap.querySelectorAll('.slider-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
    resetAuto();
  }

  function resetAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => goTo(current + 1), 5500);
  }

  sliderPrev.addEventListener('click', () => goTo(current - 1));
  sliderNext.addEventListener('click', () => goTo(current + 1));

  // Touch / swipe
  let touchX = 0;
  slider.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
  slider.addEventListener('touchend', e => {
    const diff = touchX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) goTo(diff > 0 ? current + 1 : current - 1);
  });

  // Keyboard
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') goTo(current - 1);
    if (e.key === 'ArrowRight') goTo(current + 1);
  });

  resetAuto();
}

// ─── CONTACT FORM ────────────────────────────
const form        = document.getElementById('contactForm');
const submitText  = document.getElementById('submitText');
const formSuccess = document.getElementById('formSuccess');

if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    submitText.textContent = 'Sending…';

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        form.reset();
        submitText.textContent = 'Send message';
        formSuccess.classList.add('visible');
        setTimeout(() => formSuccess.classList.remove('visible'), 6000);
      } else {
        submitText.textContent = 'Try again';
      }
    } catch {
      submitText.textContent = 'Try again';
    }
  });
}

// ─── ACTIVE NAV ──────────────────────────────
const secs  = document.querySelectorAll('section[id]');
const navAs = document.querySelectorAll('.nav-links a[href^="#"]');

window.addEventListener('scroll', () => {
  let current = '';
  secs.forEach(s => { if (window.scrollY >= s.offsetTop - 130) current = s.id; });
  navAs.forEach(a => {
    a.style.color = a.getAttribute('href') === `#${current}` ? 'var(--text)' : '';
  });
}, { passive: true });
