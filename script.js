/* ==========================================================================
   AT Towing — interactions
   Vanilla JS. No dependencies, no external APIs.
   ========================================================================== */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------
     Mobile navigation
     --------------------------------------------------------------- */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');

  function closeNav() {
    if (!nav || !burger) return;
    nav.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  function toggleNav() {
    if (!nav || !burger) return;
    var open = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.style.overflow = open ? 'hidden' : '';
  }

  if (burger && nav) {
    burger.addEventListener('click', toggleNav);

    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeNav();
    });

    document.addEventListener('click', function (e) {
      if (!nav.classList.contains('is-open')) return;
      if (nav.contains(e.target) || burger.contains(e.target)) return;
      closeNav();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNav();
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 900) closeNav();
    });
  }

  /* ---------------------------------------------------------------
     Sticky header shadow
     --------------------------------------------------------------- */
  var header = document.getElementById('header');
  var ticking = false;

  function onScroll() {
    if (header) header.classList.toggle('is-stuck', window.scrollY > 12);
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });
  onScroll();

  /* ---------------------------------------------------------------
     Scroll reveal
     --------------------------------------------------------------- */
  var reveals = Array.prototype.slice.call(document.querySelectorAll('.reveal'));

  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var siblings = Array.prototype.slice.call(el.parentNode.children).filter(function (n) {
          return n.classList && n.classList.contains('reveal');
        });
        var i = Math.min(siblings.indexOf(el), 5);
        el.style.transitionDelay = (i > 0 ? i * 80 : 0) + 'ms';
        el.classList.add('is-in');
        revealObserver.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    reveals.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---------------------------------------------------------------
     Active nav link highlighting
     --------------------------------------------------------------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav__link'));
  var sections = navLinks
    .map(function (link) {
      var id = link.getAttribute('href');
      return id && id.charAt(0) === '#' ? document.querySelector(id) : null;
    })
    .filter(Boolean);

  if (sections.length && 'IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          link.classList.toggle('is-active', link.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------------------------------------------------------------
     FAQ accordion — keep only one open at a time
     --------------------------------------------------------------- */
  var faqItems = Array.prototype.slice.call(document.querySelectorAll('.faq__list .qa'));
  faqItems.forEach(function (item) {
    item.addEventListener('toggle', function () {
      if (!item.open) return;
      faqItems.forEach(function (other) {
        if (other !== item) other.open = false;
      });
    });
  });

  /* ---------------------------------------------------------------
     Gallery lightbox
     --------------------------------------------------------------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxClose = document.getElementById('lightboxClose');
  var lastFocused = null;
  /* Transparent 1x1 placeholder: avoids an empty src="" resolving to the page
     URL, which makes the browser refetch the HTML document as an image. */
  var BLANK_IMG = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

  function openLightbox(src, alt) {
    if (!lightbox || !lightboxImg) return;
    lastFocused = document.activeElement;
    lightboxImg.src = src;
    lightboxImg.alt = alt || 'AT Towing gallery photo';
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    if (lightboxClose) lightboxClose.focus();
  }

  function closeLightbox() {
    if (!lightbox || lightbox.hidden) return;
    lightbox.hidden = true;
    lightboxImg.src = BLANK_IMG;
    document.body.style.overflow = '';
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  Array.prototype.slice.call(document.querySelectorAll('.shot')).forEach(function (shot) {
    shot.addEventListener('click', function () {
      var img = shot.querySelector('img');
      openLightbox(shot.getAttribute('data-full') || (img && img.src), img && img.alt);
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeLightbox();
  });

  /* ---------------------------------------------------------------
     Contact form validation (client side only)
     --------------------------------------------------------------- */
  var form = document.getElementById('contactForm');
  var okMsg = document.getElementById('formOk');
  var badMsg = document.getElementById('formBad');

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
  var PHONE_RE = /^[+()\-.\s\d]{7,}$/;

  function setError(name, message) {
    var field = form.querySelector('[name="' + name + '"]');
    if (!field) return;
    var wrap = field.closest('.field');
    var slot = form.querySelector('[data-err="' + name + '"]');
    if (wrap) wrap.classList.toggle('has-error', Boolean(message));
    if (slot) slot.textContent = message || '';
    if (message) field.setAttribute('aria-invalid', 'true');
    else field.removeAttribute('aria-invalid');
  }

  function validate() {
    var errors = 0;
    var values = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      message: form.message.value.trim()
    };

    if (values.name.length < 2) { setError('name', 'Please enter your full name.'); errors++; }
    else setError('name', '');

    if (!EMAIL_RE.test(values.email)) { setError('email', 'Please enter a valid email address.'); errors++; }
    else setError('email', '');

    var digits = values.phone.replace(/\D/g, '');
    if (!PHONE_RE.test(values.phone) || digits.length < 10) {
      setError('phone', 'Please enter a valid phone number so we can call you back.');
      errors++;
    } else setError('phone', '');

    if (values.message.length < 8) { setError('message', 'Tell us your location and what happened.'); errors++; }
    else setError('message', '');

    return errors === 0;
  }

  if (form) {
    ['name', 'email', 'phone', 'message'].forEach(function (n) {
      var field = form.querySelector('[name="' + n + '"]');
      if (!field) return;
      field.addEventListener('blur', function () {
        if (field.value.trim()) validate();
      });
      field.addEventListener('input', function () {
        var wrap = field.closest('.field');
        if (wrap && wrap.classList.contains('has-error')) setError(n, '');
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (okMsg) okMsg.hidden = true;
      if (badMsg) badMsg.hidden = true;

      if (!validate()) {
        if (badMsg) badMsg.hidden = false;
        var firstBad = form.querySelector('.field.has-error input, .field.has-error textarea');
        if (firstBad) firstBad.focus();
        return;
      }

      var btn = form.querySelector('button[type="submit"]');
      var original = btn ? btn.textContent : '';
      if (btn) { btn.disabled = true; btn.textContent = 'Sending...'; }

      window.setTimeout(function () {
        if (btn) { btn.disabled = false; btn.textContent = original; }
        if (okMsg) okMsg.hidden = false;
        form.reset();
        ['name', 'email', 'phone', 'message'].forEach(function (n) { setError(n, ''); });
        if (okMsg && okMsg.scrollIntoView) {
          okMsg.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
        }
      }, 700);
    });
  }

  /* ---------------------------------------------------------------
     Footer year
     --------------------------------------------------------------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
