/* ===== That's Eat Co. — Scroll Experience Engine ===== */
(function(){
  'use strict';

  /* --- Navbar --- */
  const nav = document.getElementById('navbar');
  const ham = document.getElementById('nav-hamburger');
  const mob = document.getElementById('mobile-menu');
  window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > window.innerHeight * 0.6));
  if (ham) {
    ham.addEventListener('click', () => { ham.classList.toggle('active'); mob.classList.toggle('active'); });
    mob.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { ham.classList.remove('active'); mob.classList.remove('active'); }));
  }

  /* --- Scroll reveals --- */
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }});
  }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.reveal-up').forEach(el => revealObs.observe(el));

  /* --- Particle system --- */
  function initParticles(id, color, count) {
    const c = document.getElementById(id);
    if (!c) return;
    const ctx = c.getContext('2d');
    let pts = [], w, h;
    function resize() { const r = c.parentElement.getBoundingClientRect(); w = c.width = r.width; h = c.height = r.height; }
    function make() { return { x: Math.random()*w, y: Math.random()*h, r: Math.random()*2+.5, vx: (Math.random()-.5)*.3, vy: (Math.random()-.5)*.3-.15, a: Math.random()*.3+.08, life: Math.random()*300+100 }; }
    function init() { resize(); pts = []; for (let i = 0; i < count; i++) pts.push(make()); }
    function draw() {
      ctx.clearRect(0,0,w,h);
      pts.forEach((p,i) => { p.x += p.vx; p.y += p.vy; p.life--; if (p.life <= 0 || p.x < -5 || p.x > w+5 || p.y < -5 || p.y > h+5) { pts[i] = make(); pts[i].y = h+3; } ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fillStyle = color.replace('A)',p.a+')'); ctx.fill(); });
      requestAnimationFrame(draw);
    }
    window.addEventListener('resize', resize); init(); draw();
  }
  initParticles('particle-canvas', 'rgba(232,114,42,A)', 25);
  initParticles('cta-particles', 'rgba(255,255,255,A)', 25);

  /* --- THE STAGE: Gravitational Drift --- */
  const stageProducts = document.querySelectorAll('.stage-product');
  let driftTime = 0;

  function updateDrift(timestamp) {
    driftTime = timestamp * 0.001; // seconds
    stageProducts.forEach(p => {
      const drift = parseFloat(p.dataset.drift || 0.3);
      const period = 8 + drift * 6; // different period per product
      const dx = Math.sin(driftTime / period * Math.PI * 2) * drift * 8;
      const dy = Math.cos(driftTime / period * Math.PI * 2 + 1) * drift * 5;

      // Preserve the original transform and add drift
      if (p.classList.contains('stage-product-hero')) {
        p.style.transform = 'translate(calc(-50% + ' + dx + 'px), calc(-50% + ' + dy + 'px))';
      } else if (p.classList.contains('stage-product-back-l')) {
        p.style.transform = 'rotate(-5deg) translate(' + dx + 'px,' + dy + 'px)';
      } else if (p.classList.contains('stage-product-back-r')) {
        p.style.transform = 'rotate(4deg) translate(' + dx + 'px,' + dy + 'px)';
      }
    });
    requestAnimationFrame(updateDrift);
  }
  if (stageProducts.length) requestAnimationFrame(updateDrift);

  /* --- Stage scroll fade --- */
  const stage = document.querySelector('.the-stage');
  function updateStageScroll() {
    if (!stage) return;
    const sy = window.scrollY;
    const vh = window.innerHeight;
    if (sy < vh) {
      const fade = 1 - (sy / vh) * 1.2;
      stage.style.opacity = Math.max(0, fade);
    }
  }

  /* --- THE SPREAD: Parallax on products --- */
  function updateSpread() {
    const items = document.querySelectorAll('.spread-item, .spread-word');
    const spread = document.querySelector('.the-spread');
    if (!spread) return;
    const rect = spread.getBoundingClientRect();
    const progress = -rect.top / (rect.height - window.innerHeight);
    if (progress < -0.3 || progress > 1.3) return;
    items.forEach(item => {
      const speed = parseFloat(item.dataset.speed || 0.3);
      const offset = (progress - 0.5) * speed * 120;
      item.style.transform = 'rotate(var(--r,0deg)) translateY(' + offset + 'px)';
    });
  }

  /* --- HORIZONTAL SCROLL (THE RIVER) --- */
  const hWrapper = document.getElementById('the-river');
  const hSticky = hWrapper ? hWrapper.querySelector('.horizontal-scroll-sticky') : null;
  const hTrack = document.getElementById('h-scroll-track');
  const hProgress = document.getElementById('h-progress-bar');
  const hWord = document.getElementById('river-progress-word');
  const riverWords = ['RAW', 'CRAFTED', 'OBSESSED', 'READY'];

  function updateRiver() {
    if (!hWrapper || !hTrack || !hSticky) return;
    const rect = hWrapper.getBoundingClientRect();
    const wrapH = hWrapper.offsetHeight;
    const viewH = window.innerHeight;
    const scrolled = -rect.top;
    const maxScroll = wrapH - viewH;

    if (scrolled < -1) {
      hSticky.classList.remove('is-fixed', 'is-bottom');
      hTrack.style.transform = 'translateX(0px)';
      if (hProgress) hProgress.style.width = '0%';
      if (hWord) hWord.textContent = riverWords[0];
      return;
    }
    
    if (scrolled > maxScroll) {
      hSticky.classList.remove('is-fixed');
      hSticky.classList.add('is-bottom');
      const panels = hTrack.children.length;
      const tx = (panels - 1) * window.innerWidth;
      hTrack.style.transform = 'translateX(' + (-tx) + 'px)';
      if (hProgress) hProgress.style.width = '100%';
      if (hWord) hWord.textContent = riverWords[riverWords.length-1];
      return;
    }

    hSticky.classList.add('is-fixed');
    hSticky.classList.remove('is-bottom');
    const progress = Math.max(0, Math.min(1, scrolled / maxScroll));
    const panels = hTrack.children.length;
    const tx = progress * (panels - 1) * window.innerWidth;
    hTrack.style.transform = 'translateX(' + (-tx) + 'px)';
    if (hProgress) hProgress.style.width = (progress * 100) + '%';
    if (hWord) { const idx = Math.min(Math.floor(progress * panels), panels - 1); hWord.textContent = riverWords[idx] || riverWords[riverWords.length-1]; }
  }

  /* --- THE CASE: Ingredient reveal --- */
  const ingredientReveal = document.getElementById('ingredient-reveal');
  if (ingredientReveal) {
    const ingObs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('reveal'); ingObs.unobserve(e.target); }});
    }, { threshold: 0.5 });
    ingObs.observe(ingredientReveal);
  }

  /* --- TASTE word weight animation --- */
  const tasteWord = document.getElementById('taste-word');
  if (tasteWord) {
    const tasteObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          let w = 400; const max = 800;
          const interval = setInterval(() => { w += 15; if (w >= max) { w = max; clearInterval(interval); } tasteWord.style.fontWeight = w; }, 30);
          tasteObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.4 });
    tasteObs.observe(tasteWord);
  }

  /* --- THE WORLD: Counter --- */
  function countUp(el, target) {
    let cur = 0; const step = Math.max(1, Math.floor(target / 60));
    const iv = setInterval(() => { cur += step; if (cur >= target) { cur = target; clearInterval(iv); } el.textContent = cur.toLocaleString(); }, 25);
  }
  const counterEl = document.querySelector('.counter-num');
  if (counterEl) {
    const cObs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { countUp(e.target, parseInt(e.target.dataset.target)); cObs.unobserve(e.target); }});
    }, { threshold: 0.5 });
    cObs.observe(counterEl);
  }

  /* --- Master scroll handler --- */
  function onScroll() { updateStageScroll(); updateSpread(); updateRiver(); }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

})();
