/* ─── Utility ─────────────────────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ─── Scroll Progress Bar ─────────────────────────────────────── */
const progressBar = document.createElement('div');
progressBar.id = 'scroll-progress';
document.body.prepend(progressBar);
window.addEventListener('scroll', () => {
  const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
  progressBar.style.transform = `scaleX(${pct})`;
}, { passive: true });



/* ─── Intersection Observer Reveals (staggered) ───────────────── */
const revealEls = $$('.reveal');
if ('IntersectionObserver' in window && !reduceMotion) {
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const delay = el.dataset.delay ? parseFloat(el.dataset.delay) : 0;
      setTimeout(() => el.classList.add('is-visible'), delay);
      obs.unobserve(el);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => io.observe(el));

  /* Skill pills — separate staggered observer */
  const pillObs = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      obs.unobserve(entry.target);
      $$('.skill-pill').forEach((pill, i) => {
        setTimeout(() => pill.classList.add('is-visible'), i * 45);
      });
    });
  }, { threshold: 0.15 });
  const pillsBlock = $('.skill-pills');
  if (pillsBlock) pillObs.observe(pillsBlock);
} else {
  revealEls.forEach(el => el.classList.add('is-visible'));
  $$('.skill-pill').forEach(el => el.classList.add('is-visible'));
}

/* ─── Typed Hero Tagline ──────────────────────────────────────── */
const typeTarget = $('#typed-roles');
if (typeTarget && !reduceMotion) {
  const roles = ['Full-Stack Developer', 'UI Craftsman', 'Problem Solver', 'CS Engineer'];
  let ri = 0, ci = 0, deleting = false;
  const TYPE_SPD = 80, DEL_SPD = 45, PAUSE = 1800;

  function type() {
    const word = roles[ri];
    if (!deleting) {
      typeTarget.textContent = word.slice(0, ++ci);
      if (ci === word.length) { deleting = true; return setTimeout(type, PAUSE); }
    } else {
      typeTarget.textContent = word.slice(0, --ci);
      if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; }
    }
    setTimeout(type, deleting ? DEL_SPD : TYPE_SPD);
  }
  type();
}

/* ─── Animated Count-Up Numbers ──────────────────────────────── */
function countUp(el) {
  const end = parseFloat(el.dataset.count);
  const dec = el.dataset.dec ? parseInt(el.dataset.dec) : 0;
  const dur = 1800;
  const start = performance.now();
  (function frame(now) {
    const p = Math.min((now - start) / dur, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = (end * ease).toFixed(dec);
    if (p < 1) requestAnimationFrame(frame);
  })(start);
}
if (!reduceMotion) {
  const numObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { countUp(e.target); numObs.unobserve(e.target); } });
  }, { threshold: 0.5 });
  $$('[data-count]').forEach(el => numObs.observe(el));
}

/* ─── Parallax Hero Image ─────────────────────────────────────── */
if (!reduceMotion && window.innerWidth > 900) {
  const artFrame = $('.art-frame img');
  window.addEventListener('scroll', () => {
    if (!artFrame) return;
    const y = window.scrollY * 0.18;
    artFrame.style.transform = `scale(1.06) translateY(${y}px)`;
  }, { passive: true });
}

/* ─── 3D Tilt Project Cards ───────────────────────────────────── */
if (!reduceMotion && window.innerWidth > 900) {
  $$('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 6}deg) scale(1.02)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ─── Credential Card Hover Glow ──────────────────────────────── */
$$('.credential-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width  * 100).toFixed(1);
    const y = ((e.clientY - r.top)  / r.height * 100).toFixed(1);
    card.style.setProperty('--mx', x + '%');
    card.style.setProperty('--my', y + '%');
  });
});

/* ─── Magnetic Buttons ────────────────────────────────────────── */
if (!reduceMotion && window.innerWidth > 900) {
  $$('.button').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width  / 2) * 0.3;
      const y = (e.clientY - r.top  - r.height / 2) * 0.3;
      btn.style.transform = `translate(${x}px,${y}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });
}

/* ─── Active Nav Link Highlight ───────────────────────────────── */
const sections = $$('section[id]');
const navLinks = $$('.nav-links a');
const navObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(a => a.classList.toggle('nav-active', a.getAttribute('href') === '#' + e.target.id));
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });
sections.forEach(s => navObs.observe(s));

/* ─── Header shrink on scroll ─────────────────────────────────── */
const header = $('.site-header');
window.addEventListener('scroll', () => {
  header.classList.toggle('header-scrolled', window.scrollY > 60);
}, { passive: true });

/* ─── Mobile Menu ─────────────────────────────────────────────── */
const menuBtn = $('.menu-toggle');
const nav = $('#primary-nav');
menuBtn.addEventListener('click', () => {
  const open = menuBtn.getAttribute('aria-expanded') === 'true';
  menuBtn.setAttribute('aria-expanded', String(!open));
  menuBtn.setAttribute('aria-label', open ? 'Open navigation' : 'Close navigation');
  nav.classList.toggle('is-open', !open);
  document.body.classList.toggle('menu-open', !open);
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  menuBtn.setAttribute('aria-expanded', 'false');
  menuBtn.setAttribute('aria-label', 'Open navigation');
  nav.classList.remove('is-open');
  document.body.classList.remove('menu-open');
}));

/* ─── Sticker slow spin (CSS handles it but we add interaction) ── */
const sticker = $('.art-sticker');
if (sticker && !reduceMotion) {
  let angle = 0;
  window.addEventListener('scroll', () => {
    angle = window.scrollY * 0.08;
    sticker.style.transform = `rotate(${-12 + angle * 0.3}deg)`;
  }, { passive: true });
}

/* ─── Timeline items stagger delay ───────────────────────────────*/
$$('.timeline-item.reveal').forEach((el, i) => { el.dataset.delay = i * 100; });
$$('.credential-card.reveal').forEach((el, i) => { el.dataset.delay = (i % 2) * 80; });
