/* Meark · personal archive — contact-sheet interaction layer
   index with preview · entrance stagger · marquee · scroll drift */

(function () {
  'use strict';

  /* ---------- Entrance stagger ---------- */
  var revealTargets = document.querySelectorAll('.sheet__item, .about__facts, .about__para, .about__row2, .skills__title, .skills__row, .work__head, .spine, .gallery__stmt, .gallery__feature, .gallery__sheet figure, .contact__title');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (entry.isIntersecting) {
          setTimeout(function () {
            entry.target.classList.add('is-in');
          }, Math.min(i * 70, 350));
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -8% 0px' });
    revealTargets.forEach(function (el) { io.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- Work · index with preview ---------- */
  var spines = Array.prototype.slice.call(document.querySelectorAll('.spine'));
  var previewImg = document.querySelector('.work__preview img');
  if (spines.length && previewImg) {
    var setActive = function (spine) {
      spines.forEach(function (s) { s.classList.remove('is-active'); });
      spine.classList.add('is-active');
      var src = spine.getAttribute('data-preview');
      if (src && previewImg.getAttribute('src') !== src) {
        previewImg.setAttribute('src', src);
        previewImg.classList.add('is-visible');
      }
    };
    spines.forEach(function (spine) {
      spine.addEventListener('mouseenter', function () { setActive(spine); });
      spine.addEventListener('focusin', function () { setActive(spine); });
      spine.addEventListener('focus', function () { setActive(spine); });
    });
    setActive(spines[0]);
  }

  /* ---------- Contact · photo strip marquee ---------- */
  var strip = document.querySelector('.contact__strip-inner');
  if (strip) {
    strip.innerHTML += strip.innerHTML;
    var x = 0;
    var SPEED = 0.55;
    var step = function () {
      x -= SPEED;
      var half = strip.scrollWidth / 2;
      if (x <= -half) { x = 0; }
      strip.style.transform = 'translateX(' + x + 'px)';
      window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
  }

  /* ---------- Scroll drift on many elements ---------- */
  // 每个元素按 data-drift 的速度上浮/下沉，形成整页的“档案在缓慢移动”感
  var driftEls = Array.prototype.slice.call(document.querySelectorAll('[data-drift]'));
  if (driftEls.length) {
    var ticking = false;
    var apply = function () {
      var y = window.scrollY;
      driftEls.forEach(function (el) {
        var speed = parseFloat(el.getAttribute('data-drift')) || 0;
        if (!speed) return;
        var t = Math.max(-40, Math.min(40, y * speed));
        el.style.transform = 'translate3d(0,' + t.toFixed(1) + 'px,0)';
      });
      ticking = false;
    };
    window.addEventListener('scroll', function () {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(apply);
      }
    }, { passive: true });
    apply();
  }
})();
