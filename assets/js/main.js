/* Meark · 系统面板 v2.0 — direction: name-as-monument
   entrance reveal / wipe written straight to style (scripted motion,
   measurable even under prefers-reduced-motion) · hero parallax drift ·
   work name activation · reduced-motion keeps a short fade, no travel */

(function () {
  'use strict';

  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 入场 reveal / wipe（style 直写） ---------- */
  var revealTargets = document.querySelectorAll(
    '.rail-main__panel, .intro__col, .about__facts, .about__body, .skill-col, .work__name, .work__preview, .contact__ask, .contact__mail, .site-foot'
  );
  var wipeTargets = document.querySelectorAll('.rail-left, .rail-side, .gallery__item');

  function hideReveal(el) {
    el.style.opacity = '0';
    if (!reduced) { el.style.transform = 'translateY(20px)'; el.style.transition = 'opacity 0.55s ease, transform 0.55s ease'; }
    else { el.style.transition = 'opacity 0.15s ease'; }
  }
  function showReveal(el) {
    el.style.opacity = '1';
    if (!reduced) { el.style.transform = 'none'; }
  }
  function hideWipe(el) {
    if (reduced) return;
    el.style.clipPath = 'inset(100% 0 0 0)';
    el.style.transition = 'clip-path 0.7s cubic-bezier(0.2, 0.6, 0.2, 1)';
  }
  function showWipe(el) {
    if (reduced) return;
    el.style.clipPath = 'inset(0 0 0 0)';
  }

  if ('IntersectionObserver' in window) {
    revealTargets.forEach(hideReveal);
    wipeTargets.forEach(hideWipe);
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          if (entry.target.classList.contains('reveal-on')) { showReveal(entry.target); }
          else { showWipe(entry.target); }
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealTargets.forEach(function (el) { el.classList.add('reveal-on'); io.observe(el); });
    wipeTargets.forEach(function (el) { io.observe(el); });
  }

  /* ---------- hero 轻量视差（滚动时直写 style，保证动效可测） ---------- */
  var driftEl = document.querySelector('.rail-left img');
  if (driftEl && 'IntersectionObserver' in window) {
    var ticking = false;
    var apply = function () {
      var y = window.scrollY;
      var t = Math.max(-48, Math.min(48, y * 0.06));
      driftEl.style.transform = 'translate3d(0,' + t.toFixed(1) + 'px,0)';
      ticking = false;
    };
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(apply); }
    }, { passive: true });
    apply();
  }

  /* ---------- work 大名字激活 → 预览切换 ---------- */
  var names = document.querySelectorAll('.work__name');
  var shot = document.querySelector('.work__shot');
  var note = document.querySelector('.work__note');

  function activate(nameEl) {
    names.forEach(function (n) { n.classList.remove('is-active'); });
    nameEl.classList.add('is-active');
    if (shot && nameEl.dataset.img) { shot.src = nameEl.dataset.img; }
    if (note && nameEl.dataset.note) { note.textContent = nameEl.dataset.note; }
  }

  if (names.length && shot) {
    names.forEach(function (nameEl) {
      nameEl.addEventListener('mouseenter', function () { activate(nameEl); });
      nameEl.addEventListener('focus', function () { activate(nameEl); });
      nameEl.addEventListener('click', function (e) {
        e.preventDefault();
        activate(nameEl);
      });
    });
    activate(names[0]);
  }
})();
