/* VITAL · index.js — Logic màn hình chọn hồ sơ */
(function () {
'use strict';

/* ─── Lời chào ─── */
var GREET_KEY = 'vital_last_user';
var lastUser  = localStorage.getItem(GREET_KEY);

function greeting() {
  var h = new Date().getHours();
  var g = h < 11 ? 'Chào buổi sáng' : h < 14 ? 'Chào buổi trưa' : h < 18 ? 'Chào buổi chiều' : 'Chào buổi tối';
  var el = document.getElementById('greeting');
  if (!el) return;
  el.textContent = g;
}
greeting();

/* ─── Badge streak & cân (đọc TỪ SQLite — dùng chung VitalSQL) ─── */
function todayStr() {
  var d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}
function addDays(s, n) {
  var d = new Date(s + 'T00:00'); d.setDate(d.getDate() + n);
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}
function userStreak(user) {
  try {
    var rows = window.VitalSQL.all('SELECT date,json FROM logs WHERE user=?', [user]);
    var set = {};
    rows.forEach(function (r) { try { var l = JSON.parse(r.json); if (l.foods && l.foods.length) set[r.date] = 1; } catch (e) {} });
    var d = todayStr(), n = 0;
    while (set[d]) { n++; d = addDays(d, -1); }
    return n;
  } catch (e) { return 0; }
}
function userWeight(user, field) {
  try {
    var rows = window.VitalSQL.all('SELECT json FROM logs WHERE user=? ORDER BY date', [user]);
    for (var i = rows.length - 1; i >= 0; i--) { var l = JSON.parse(rows[i].json); if (l[field]) return l[field]; }
    return null;
  } catch (e) { return null; }
}
function renderBadges() {
  var ps = userStreak('phuc'), as = userStreak('anh');
  var pw = userWeight('phuc', 'weight_morning'), aw = userWeight('anh', 'weight');
  var spEl = document.getElementById('streak-phuc');
  if (spEl) spEl.innerHTML = (ps > 0 ? '🔥 ' + ps + ' ngày<br>' : '') + (pw ? pw.toFixed(1) + ' kg' : '');
  var saEl = document.getElementById('streak-anh');
  if (saEl) saEl.innerHTML = (as > 0 ? '🔥 ' + as + ' ngày<br>' : '') + (aw ? aw.toFixed(1) + ' kg' : '');
}
if (window.VitalSQL) { window.VitalSQL.init().then(renderBadges).catch(function () {}); }

/* ─── Tô sáng hồ sơ mở gần nhất ─── */
if (lastUser) {
  var card = document.getElementById('card-' + lastUser);
  if (card) card.style.outline = '2px solid rgba(255,255,255,.18)';
}

/* ─── Canvas hạt nền ─── */
var canvas = document.getElementById('particles');
var ctx    = canvas && canvas.getContext('2d');
var particles = [];

function initCanvas() {
  if (!canvas) return;
  canvas.width  = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
function mkParticle() {
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.5 + 0.4,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    alpha: Math.random() * 0.4 + 0.1
  };
}
function initParticles() {
  if (!canvas) return;
  particles = [];
  var count = Math.min(80, Math.floor(canvas.width * canvas.height / 6000));
  for (var i = 0; i < count; i++) particles.push(mkParticle());
}
var rafId;
function animParticles() {
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(function (p) {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0) p.x = canvas.width;
    if (p.x > canvas.width) p.x = 0;
    if (p.y < 0) p.y = canvas.height;
    if (p.y > canvas.height) p.y = 0;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,' + p.alpha + ')';
    ctx.fill();
  });
  rafId = requestAnimationFrame(animParticles);
}
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  initCanvas();
  initParticles();
  animParticles();
  window.addEventListener('resize', function () {
    cancelAnimationFrame(rafId);
    initCanvas();
    initParticles();
    animParticles();
  });
}

/* ─── Nghiêng 3D khi rê chuột ─── */
var cards = document.querySelectorAll('.card');
cards.forEach(function (card) {
  card.addEventListener('mousemove', function (e) {
    var rect = card.getBoundingClientRect();
    var cx = rect.left + rect.width / 2;
    var cy = rect.top  + rect.height / 2;
    var dx = (e.clientX - cx) / (rect.width / 2);
    var dy = (e.clientY - cy) / (rect.height / 2);
    card.style.transform = 'perspective(800px) rotateY(' + (dx * 7) + 'deg) rotateX(' + (-dy * 4) + 'deg) translateZ(8px)';
  });
  card.addEventListener('mouseleave', function () {
    card.style.transform = '';
  });
});

/* ─── Gợn sóng khi bấm ─── */
function spawnRipple(card, e) {
  var rect = card.getBoundingClientRect();
  var x = e.clientX - rect.left;
  var y = e.clientY - rect.top;
  var size = Math.max(rect.width, rect.height);
  var layer = card.querySelector('.ripple-layer');
  if (!layer) return;
  var rip = document.createElement('div');
  rip.className = 'ripple';
  rip.style.cssText = 'width:' + size + 'px;height:' + size + 'px;left:' + (x - size / 2) + 'px;top:' + (y - size / 2) + 'px';
  layer.appendChild(rip);
  rip.addEventListener('animationend', function () { rip.remove(); });
}

/* ─── Prefetch khi rê vào ─── */
var prefetched = {};
function prefetch(href) {
  if (prefetched[href]) return;
  prefetched[href] = true;
  var link = document.createElement('link');
  link.rel = 'prefetch'; link.href = href;
  document.head.appendChild(link);
}
cards.forEach(function (card) {
  card.addEventListener('mouseenter', function () { prefetch(card.href); });
  card.addEventListener('touchstart', function () { prefetch(card.href); }, { passive: true });
});

/* ─── Điều hướng kèm hiệu ứng loading ─── */
var loader     = document.getElementById('loader');
var loaderArc  = document.getElementById('loader-arc');
var loaderName = document.getElementById('loader-name');
var TOTAL_DASH = 138.2;

function navigate(who, href) {
  localStorage.setItem(GREET_KEY, who);
  var name = who === 'phuc' ? 'Phúc' : 'Ngọc Anh';
  if (loaderName) loaderName.textContent = name;
  if (loader) loader.classList.add('show');

  var start = null, dur = 1500;
  function step(ts) {
    if (!start) start = ts;
    var pct = Math.min((ts - start) / dur, 1);
    var off = TOTAL_DASH * (1 - pct);
    if (loaderArc) loaderArc.style.strokeDashoffset = off;
    if (pct < 1) requestAnimationFrame(step);
    else window.location.href = href;
  }
  requestAnimationFrame(step);
}

cards.forEach(function (card) {
  card.addEventListener('click', function (e) {
    e.preventDefault();
    spawnRipple(card, e);
    var who  = card.dataset.who;
    var href = card.href;
    navigate(who, href);
  });
});

})();
