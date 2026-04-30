/* ===== That's Eat Co. — Main JS ===== */
(function(){
  'use strict';

  /* --- Navbar scroll --- */
  const nav = document.getElementById('navbar');
  const ham = document.getElementById('nav-hamburger');
  const mob = document.getElementById('mobile-menu');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 80);
  });

  if (ham) {
    ham.addEventListener('click', () => {
      ham.classList.toggle('active');
      mob.classList.toggle('active');
    });
    mob.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => { ham.classList.remove('active'); mob.classList.remove('active'); });
    });
  }

  /* --- Scroll reveal (IntersectionObserver) --- */
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-text');
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }});
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => revealObs.observe(el));

  /* --- Particle system (hero + CTA) --- */
  function initParticles(canvasId, color, count) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let w, h;

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      w = canvas.width = rect.width;
      h = canvas.height = rect.height;
    }

    function createParticle() {
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 3 + 1,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5 - 0.3,
        alpha: Math.random() * 0.5 + 0.15,
        life: Math.random() * 200 + 100
      };
    }

    function init() {
      resize();
      particles = [];
      for (let i = 0; i < count; i++) particles.push(createParticle());
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
        if (p.life <= 0 || p.x < -10 || p.x > w + 10 || p.y < -10 || p.y > h + 10) {
          particles[i] = createParticle();
          particles[i].y = h + 5;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = color.replace('A)', p.alpha + ')');
        ctx.fill();
      });
      requestAnimationFrame(draw);
    }

    window.addEventListener('resize', resize);
    init();
    draw();
  }

  initParticles('particle-canvas', 'rgba(232,114,42,A)', 40);
  initParticles('cta-particles', 'rgba(255,255,255,A)', 30);

  /* --- Horizontal scroll --- */
  const hWrapper = document.getElementById('horizontal-scroll');
  const hTrack = document.getElementById('h-scroll-track');
  const hProgress = document.getElementById('h-progress-bar');

  if (hWrapper && hTrack) {
    function updateHScroll() {
      const rect = hWrapper.getBoundingClientRect();
      const wrapH = hWrapper.offsetHeight;
      const viewH = window.innerHeight;
      const scrolled = -rect.top;
      const maxScroll = wrapH - viewH;

      if (scrolled < 0 || scrolled > maxScroll) return;

      const progress = scrolled / maxScroll;
      const panels = hTrack.children.length;
      const totalMove = (panels - 1) * window.innerWidth;
      const tx = progress * totalMove;

      hTrack.style.transform = 'translateX(' + (-tx) + 'px)';
      if (hProgress) hProgress.style.width = (progress * 100) + '%';
    }

    window.addEventListener('scroll', updateHScroll, { passive: true });
    window.addEventListener('resize', updateHScroll);
  }

  /* --- Why-Us: animated icons + countUp --- */
  const pillars = document.querySelectorAll('.why-pillar');
  const pillarObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('animated');
        const stat = e.target.querySelector('.pillar-stat');
        if (stat) countUp(stat, parseInt(stat.dataset.target));
        pillarObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });
  pillars.forEach(p => pillarObs.observe(p));

  function countUp(el, target) {
    let current = 0;
    const step = Math.max(1, Math.floor(target / 40));
    const interval = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(interval); }
      el.textContent = current;
    }, 30);
  }

  /* --- Parallax on hero products --- */
  const heroMain = document.querySelector('.hero-product-main');
  if (heroMain) {
    window.addEventListener('scroll', () => {
      const s = window.scrollY;
      if (s < window.innerHeight * 1.2) {
        heroMain.style.transform = 'translateY(' + (s * -0.15) + 'px)';
        const sec = document.querySelector('.hero-product-secondary');
        const ter = document.querySelector('.hero-product-tertiary');
        if (sec) sec.style.transform = 'rotate(5deg) translateY(' + (s * -0.08) + 'px)';
        if (ter) ter.style.transform = 'rotate(-8deg) translateY(' + (s * -0.1) + 'px)';
      }
    }, { passive: true });
  }

})();
