/**
 * That's Eat Co. — V4
 * JavaScript: purposeful, minimal, performant
 */
(function () {
  'use strict';

  /* ─── NAV SCROLL BEHAVIOUR ─────────────────────────── */
  const nav = document.getElementById('nav');
  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 72);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // Run on load
  }

  /* ─── MOBILE MENU ──────────────────────────────────── */
  const burger    = document.getElementById('nav-burger');
  const mobileNav = document.getElementById('nav-mobile');

  if (burger && mobileNav) {
    const openMenu = () => {
      burger.classList.add('open');
      mobileNav.classList.add('open');
      burger.setAttribute('aria-expanded', 'true');
      mobileNav.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    };

    const closeMenu = () => {
      burger.classList.remove('open');
      mobileNav.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      mobileNav.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    burger.addEventListener('click', () => {
      burger.classList.contains('open') ? closeMenu() : openMenu();
    });

    // Close on any nav link click
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Close on Escape key
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && burger.classList.contains('open')) closeMenu();
    });
  }

  /* ─── SCROLL REVEAL ────────────────────────────────── */
  const reveals = document.querySelectorAll('.reveal');

  if (reveals.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -32px 0px' }
    );

    reveals.forEach(el => observer.observe(el));
  } else {
    // Fallback: show all instantly if no IntersectionObserver
    reveals.forEach(el => el.classList.add('visible'));
  }

  /* ─── SMOOTH HASH NAVIGATION ───────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const navH = nav ? nav.offsetHeight : 0;
        const top = target.getBoundingClientRect().top + window.scrollY - navH;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ─── NEWSLETTER FORM ──────────────────────────────── */
  const nlForm = document.getElementById('newsletter-form');
  if (nlForm) {
    nlForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const input = this.querySelector('#nl-email');
      const btn   = this.querySelector('.nl-btn');
      if (!input || !input.value) return;

      // Optimistic UI — replace with real API call
      btn.textContent = '✓ JOINED';
      btn.style.background = '#1A7A0A';
      btn.style.color = '#F4EFE6';
      input.value = '';
      input.disabled = true;
      btn.disabled = true;
    });
  }

  /* ─── REDUCED MOTION SUPPORT ───────────────────────── */
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (mq.matches) {
    // Reveal elements immediately, skip animations
    reveals.forEach(el => {
      el.style.transition = 'none';
      el.classList.add('visible');
    });
    // Stop marquees
    document.querySelectorAll('.cb-track, .ft-mq-track').forEach(el => {
      el.style.animationPlayState = 'paused';
    });
  }

})();
