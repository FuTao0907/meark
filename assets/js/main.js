/* ============================================================
   Meark · 个人档案站 · 交互
   dark-room：展品条点亮 / 区块入场 / 项目索引切换
   ============================================================ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Hero 展品条：中心帧点亮 ---------- */
  var strip = document.querySelector('.strip');
  if (strip) {
    var frames = Array.prototype.slice.call(strip.querySelectorAll('.strip__frame img'));

    function lightCentre() {
      var rect = strip.getBoundingClientRect();
      var centre = rect.left + rect.width / 2;
      frames.forEach(function (img) {
        var f = img.getBoundingClientRect();
        var imgCentre = f.left + f.width / 2;
        var hot = Math.abs(imgCentre - centre) < f.width / 2 + 12;
        img.classList.toggle('is-hot', hot);
      });
    }

    var ticking = false;
    strip.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          lightCentre();
          ticking = false;
        });
        ticking = true;
      }
    });
    window.addEventListener('resize', lightCentre);
    lightCentre();
  }

  /* ---------- 2. 区块入场 ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length && 'IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el, i) {
      el.style.transitionDelay = (i % 3) * 90 + 'ms';
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- 3. Work 索引：切换活动项与预览图 ---------- */
  var rows = Array.prototype.slice.call(document.querySelectorAll('.work__index a'));
  var previewImgs = Array.prototype.slice.call(document.querySelectorAll('.work__preview img'));
  if (rows.length && previewImgs.length) {
    function setActive(link) {
      rows.forEach(function (r) {
        var on = r === link;
        r.classList.toggle('is-active', on);
        if (on) r.setAttribute('aria-current', 'true');
        else r.removeAttribute('aria-current');
      });
      var name = link.getAttribute('data-img');
      previewImgs.forEach(function (img) {
        var on = img.getAttribute('src').indexOf(name) !== -1;
        img.classList.toggle('is-visible', on);
      });
    }
    rows.forEach(function (link) {
      link.addEventListener('mouseenter', function () { setActive(link); });
      link.addEventListener('focus', function () { setActive(link); });
      link.addEventListener('click', function (e) { e.preventDefault(); setActive(link); });
    });
  }

  /* ---------- 4. 滚动视差：暗房展品的层次感 ---------- */
  // 轻量视差，直接写 style.transform（滚动驱动，不依赖 CSS 动画状态）
  var parallaxEls = Array.prototype.slice.call(
    document.querySelectorAll('.about__pass figure, .strip__frame, .work__index a')
  );
  if (parallaxEls.length) {
    var ticking2 = false;
    function applyParallax() {
      parallaxEls.forEach(function (el) {
        var r = el.getBoundingClientRect();
        var speed = el.classList.contains('about__pass') ? 0.07
          : el.classList.contains('strip__frame') ? 0.04
          : 0.05;
        var y = Math.max(-56, Math.min(56, r.top * speed));
        el.style.transform = 'translateY(' + y.toFixed(1) + 'px)';
      });
      ticking2 = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking2) {
        window.requestAnimationFrame(applyParallax);
        ticking2 = true;
      }
    }, { passive: true });
    window.addEventListener('resize', applyParallax);
    applyParallax();
  }
})();
