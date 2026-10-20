/* Meark · 系统面板 — interaction layer
   pinned panel · entrance stagger · spine record · drift */

(function () {
  'use strict';

  /* ---------- 入场 stagger ---------- */
  var targets = document.querySelectorAll('.panel, .intro__head, .sheet, .skill-group, .section-head-row, .spine, .tile, .contact__card');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (entry.isIntersecting) {
          setTimeout(function () {
            entry.target.classList.add('is-in');
          }, Math.min(i * 60, 300));
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });
    targets.forEach(function (el) { el.classList.add('reveal'); io.observe(el); });
  }

  /* ---------- HERO · 面板卡滚动收缩（pinned story） ---------- */
  var panel = document.querySelector('[data-panel]');
  if (panel) {
    var hero = document.querySelector('.hero');
    var heroH = hero ? hero.offsetHeight : window.innerHeight;
    var shrink = function () {
      var y = window.scrollY;
      if (y > heroH * 0.45) {
        panel.classList.add('is-mini');
      } else {
        panel.classList.remove('is-mini');
      }
    };
    window.addEventListener('scroll', shrink, { passive: true });
    shrink();
  }

  /* ---------- WORK · 书脊 → 记录 ---------- */
  var spines = Array.prototype.slice.call(document.querySelectorAll('.spine'));
  var recTitle = document.querySelector('.record__title');
  var recDesc = document.querySelector('.record__desc');
  if (spines.length && recTitle && recDesc) {
    var show = function (spine) {
      spines.forEach(function (s) { s.classList.remove('is-active'); });
      spine.classList.add('is-active');
      var t = spine.getAttribute('data-title') || spine.textContent;
      var d = spine.getAttribute('data-note') || '';
      if (recTitle.textContent !== t) { recTitle.textContent = t; }
      if (recDesc.textContent !== d) { recDesc.textContent = d; }
    };
    spines.forEach(function (spine) {
      spine.addEventListener('mouseenter', function () { show(spine); });
      spine.addEventListener('focusin', function () { show(spine); });
    });
    show(spines[0]);
  }

  /* ---------- 收藏品轻微漂移 ---------- */
  var driftEls = Array.prototype.slice.call(document.querySelectorAll('[data-drift]'));
  if (driftEls.length) {
    var ticking = false;
    var apply = function () {
      var y = window.scrollY;
      driftEls.forEach(function (el) {
        var speed = parseFloat(el.getAttribute('data-drift')) || 0;
        if (!speed) return;
        var t = Math.max(-24, Math.min(24, y * speed));
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
