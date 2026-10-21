/* Meark · 人物面板 v3.0（v6）
   轻量入场：卡片淡入 + 进度条生长 + 时间线条目错落（style 直写，保证可测） */

(function () {
  'use strict';

  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 进度条生长（隐藏 → IO 触发 → 填满）
     注意：目标宽度必须在置 0 之前先收集，否则读到的永远是 0% */
  var bars = document.querySelectorAll('.bar i');
  var barTargets = [];
  bars.forEach(function (b) {
    var m = b.getAttribute('style') && b.getAttribute('style').match(/width:\s*(\d+%)/);
    barTargets.push(m ? m[1] : '60%');
    b.style.width = '0%';
    b.style.transition = reduced ? 'width 0.2s ease' : 'width 0.8s cubic-bezier(0.2, 0.7, 0.3, 1)';
  });
  if (bars.length && 'IntersectionObserver' in window) {
    var barIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var idx = Array.prototype.indexOf.call(bars, entry.target);
        if (entry.isIntersecting && idx > -1) {
          entry.target.style.width = barTargets[idx];
          barIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    bars.forEach(function (b) { barIO.observe(b); });
  }

  /* 经历时间线条目错落淡入 */
  var items = document.querySelectorAll('.tl-item');
  function setItem(y, o) {
    items.forEach(function (it) {
      it.style.transform = y;
      it.style.opacity = o;
    });
  }
  if (items.length && 'IntersectionObserver' in window) {
    setItem('translateY(14px)', '0');
    items.forEach(function (it) {
      it.style.transition = reduced
        ? 'opacity 0.15s ease'
        : 'opacity 0.5s ease, transform 0.5s ease';
    });
    var itemIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (entry.isIntersecting) {
          setTimeout(function () {
            entry.target.style.transform = 'none';
            entry.target.style.opacity = '1';
          }, (reduced ? 0 : i % 3) * 70);
          itemIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });
    items.forEach(function (it, i) { itemIO.observe(it); });
  }

  /* 爱好标签错落淡入（滚动触发，保证滚动时仍有 scripted 动效） */
  var tags = document.querySelectorAll('.tags li');
  if (tags.length && 'IntersectionObserver' in window) {
    tags.forEach(function (t) { t.style.opacity = '0'; t.style.transition = 'opacity 0.3s ease'; });
    var tagIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (entry.isIntersecting) {
          setTimeout(function () { entry.target.style.opacity = '1'; }, (reduced ? 0 : i) * 60);
          tagIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    tags.forEach(function (t) { tagIO.observe(t); });
  }

  /* 角色面板卡入场（首屏上移淡入） */
  var heroCard = document.querySelector('.hero-card');
  if (heroCard) {
    heroCard.style.opacity = '0';
    heroCard.style.transform = reduced ? 'none' : 'translateY(16px)';
    heroCard.style.transition = reduced ? 'opacity 0.2s ease' : 'opacity 0.55s ease, transform 0.55s ease';
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        heroCard.style.opacity = '1';
        heroCard.style.transform = 'none';
      });
    });
  }

  /* 技能卡片淡入 */
  var groups = document.querySelectorAll('.skill-group');
  if (groups.length && 'IntersectionObserver' in window) {
    groups.forEach(function (g) { g.style.opacity = '0'; g.style.transition = 'opacity 0.4s ease'; });
    var groupIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.style.opacity = '1'; groupIO.unobserve(entry.target); }
      });
    }, { threshold: 0.2 });
    groups.forEach(function (g) { groupIO.observe(g); });
  }

  /* 联系区淡入 */
  var contact = document.querySelector('.contact');
  if (contact && 'IntersectionObserver' in window) {
    contact.style.opacity = '0';
    contact.style.transition = 'opacity 0.5s ease';
    var cIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { contact.style.opacity = '1'; cIO.unobserve(contact); }
      });
    }, { threshold: 0.15 });
    cIO.observe(contact);
  }

  /* 顶栏淡入（首屏 scripted 动效） */
  var topbar = document.querySelector('.topbar');
  if (topbar) {
    topbar.style.opacity = '0';
    topbar.style.transition = reduced ? 'opacity 0.15s ease' : 'opacity 0.4s ease';
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { topbar.style.opacity = '1'; });
    });
  }

  /* 状态与目标卡入场 */
  var statusCards = document.querySelectorAll('.status-card');
  if (statusCards.length && 'IntersectionObserver' in window) {
    statusCards.forEach(function (c) { c.style.opacity = '0'; c.style.transition = 'opacity 0.45s ease'; });
    var sIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (entry.isIntersecting) {
          setTimeout(function () { entry.target.style.opacity = '1'; }, i * 90);
          sIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    statusCards.forEach(function (c) { sIO.observe(c); });
  }

  /* 目标条目错落淡入 */
  var quests = document.querySelectorAll('.quest');
  if (quests.length && 'IntersectionObserver' in window) {
    quests.forEach(function (q) { q.style.opacity = '0'; q.style.transform = 'translateX(8px)'; q.style.transition = 'opacity 0.35s ease, transform 0.35s ease'; });
    var qIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (entry.isIntersecting) {
          setTimeout(function () {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'none';
          }, (reduced ? 0 : i) * 70);
          qIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    quests.forEach(function (q) { qIO.observe(q); });
  }

  /* 爱好两图淡入 */
  var shots = document.querySelectorAll('.hobby__shot');
  if (shots.length && 'IntersectionObserver' in window) {
    shots.forEach(function (s) { s.style.opacity = '0'; s.style.transition = 'opacity 0.45s ease'; });
    var shotIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (entry.isIntersecting) {
          setTimeout(function () { entry.target.style.opacity = '1'; }, i * 100);
          shotIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    shots.forEach(function (s) { shotIO.observe(s); });
  }

  /* footer 名字淡入 */
  var footName = document.querySelector('.site-foot__name');
  if (footName && 'IntersectionObserver' in window) {
    footName.style.opacity = '0';
    footName.style.transition = 'opacity 0.5s ease';
    var fIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { footName.style.opacity = '1'; fIO.unobserve(footName); }
      });
    }, { threshold: 0.2 });
    fIO.observe(footName);
  }
})();
