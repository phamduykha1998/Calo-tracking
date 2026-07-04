/* VITAL · index.js — Đăng nhập / Tạo tài khoản (Supabase Auth) */
(function () {
'use strict';

/* ─── Chạy lại hiệu ứng fade-in khi quay về từ bộ nhớ đệm (nút back) ─── */
window.addEventListener('pageshow', function (e) {
  if (!e.persisted) return;
  var sc = document.getElementById('scene');
  if (!sc) return;
  sc.style.animation = 'none';
  void sc.offsetWidth;
  sc.style.animation = '';
});

/* ─── Lời chào theo giờ ─── */
(function greeting() {
  var h = new Date().getHours();
  var g = h < 11 ? 'Chào buổi sáng' : h < 14 ? 'Chào buổi trưa' : h < 18 ? 'Chào buổi chiều' : 'Chào buổi tối';
  var el = document.getElementById('greeting');
  if (el) el.textContent = g;
})();

/* ─── Canvas hạt nền (thuần trang trí, giữ nguyên hiệu ứng cũ) ─── */
var canvas = document.getElementById('particles');
var ctx = canvas && canvas.getContext('2d');
var particles = [];
function initCanvas() { if (!canvas) return; canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; }
function mkParticle() {
  return {
    x: Math.random() * canvas.width, y: Math.random() * canvas.height, r: Math.random() * 1.5 + 0.4,
    vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3, alpha: Math.random() * 0.4 + 0.1
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

/* ─── Loader / điều hướng có hiệu ứng ─── */
var loader = document.getElementById('loader');
var loaderArc = document.getElementById('loader-arc');
var loaderName = document.getElementById('loader-name');
var TOTAL_DASH = 138.2;
function navigate(name, href) {
  if (loaderName) loaderName.textContent = name;
  if (loader) loader.classList.add('show');
  var start = null, dur = 900;
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

/* ─── Supabase helpers ─── */
function sb() { return window.supabaseClient; }
function dashboardOf(gender) { return gender === 'male' ? 'H.Phuc/Phuc_calo.html' : 'N.Anh/Anh_calo.html'; }

var authMsgEl = document.getElementById('authMsg');
function showMsg(text, kind) {
  if (!authMsgEl) return;
  authMsgEl.textContent = text;
  authMsgEl.className = 'auth-msg show ' + (kind || 'err');
}
function clearMsg() {
  if (!authMsgEl) return;
  authMsgEl.className = 'auth-msg';
  authMsgEl.textContent = '';
}

/* ─── Tabs đăng nhập / đăng ký ─── */
var tabLogin = document.getElementById('tabLogin');
var tabRegister = document.getElementById('tabRegister');
var formLogin = document.getElementById('formLogin');
var formRegister = document.getElementById('formRegister');
function showTab(which) {
  clearMsg();
  tabLogin.classList.toggle('on', which === 'login');
  tabRegister.classList.toggle('on', which === 'register');
  formLogin.classList.toggle('on', which === 'login');
  formRegister.classList.toggle('on', which === 'register');
}
tabLogin.addEventListener('click', function () { showTab('login'); });
tabRegister.addEventListener('click', function () { showTab('register'); });

/* ─── Chọn giới tính khi đăng ký ─── */
var regGender = 'male';
var genderPick = document.getElementById('genderPick');
genderPick.addEventListener('click', function (e) {
  var opt = e.target.closest('.gender-opt');
  if (!opt) return;
  genderPick.querySelectorAll('.gender-opt').forEach(function (o) { o.classList.remove('sel'); });
  opt.classList.add('sel');
  regGender = opt.dataset.v;
});

/* ─── Submit: Đăng nhập ─── */
formLogin.addEventListener('submit', function (e) {
  e.preventDefault();
  clearMsg();
  var email = document.getElementById('loginEmail').value.trim();
  var password = document.getElementById('loginPassword').value;
  var btn = document.getElementById('btnLogin');
  btn.disabled = true;
  sb().auth.signInWithPassword({ email: email, password: password })
    .then(function (res) {
      if (res.error) { showMsg('Sai email hoặc mật khẩu.'); return null; }
      return sb().from('profiles').select('*').eq('id', res.data.user.id).maybeSingle();
    })
    .then(function (profRes) {
      if (!profRes) return; // đã báo lỗi ở bước trên
      if (profRes.error || !profRes.data) { showMsg('Đăng nhập được nhưng chưa có hồ sơ — liên hệ người quản trị.'); return; }
      navigate(profRes.data.name || 'Bạn', dashboardOf(profRes.data.gender));
    })
    .catch(function (err) { showMsg('Lỗi kết nối: ' + err.message); })
    .finally(function () { btn.disabled = false; });
});

/* ─── Submit: Tạo tài khoản ─── */
formRegister.addEventListener('submit', function (e) {
  e.preventDefault();
  clearMsg();
  var name = document.getElementById('regName').value.trim();
  var email = document.getElementById('regEmail').value.trim();
  var password = document.getElementById('regPassword').value;
  var btn = document.getElementById('btnRegister');
  if (!name) { showMsg('Nhập tên hiển thị đã nhé.'); return; }
  btn.disabled = true;
  sb().auth.signUp({ email: email, password: password })
    .then(function (res) {
      if (res.error) { showMsg(res.error.message); return null; }
      if (!res.data.user) { showMsg('Đăng ký thành công — kiểm tra email để xác nhận rồi quay lại đăng nhập.', 'ok'); return null; }
      return sb().from('profiles').insert({ id: res.data.user.id, email: email, name: name, gender: regGender })
        .then(function (insertRes) {
          if (insertRes.error) { showMsg('Tạo tài khoản xong nhưng lưu hồ sơ lỗi: ' + insertRes.error.message); return; }
          navigate(name, dashboardOf(regGender));
        });
    })
    .catch(function (err) { showMsg('Lỗi kết nối: ' + err.message); })
    .finally(function () { btn.disabled = false; });
});

/* ─── Đã đăng nhập sẵn (mở lại trang index) — hiện thẻ vào thẳng dashboard ─── */
function checkExistingSession() {
  if (!sb()) return;
  sb().auth.getSession().then(function (s) {
    var session = s.data && s.data.session;
    if (!session) return;
    return sb().from('profiles').select('*').eq('id', session.user.id).maybeSingle().then(function (profRes) {
      if (profRes.error || !profRes.data) return;
      var me = profRes.data;

      document.getElementById('authBox').style.display = 'none';
      document.getElementById('heroTitle').innerHTML = 'Chào mừng<br>trở lại';
      document.getElementById('heroNote').textContent = 'Bạn đã đăng nhập — vào thẳng trang của mình hoặc xem trang đối tác.';
      var whoCard = document.getElementById('whoCard');
      whoCard.style.display = 'flex';
      document.getElementById('whoName').textContent = me.name || 'bạn';

      document.getElementById('btnGoMine').addEventListener('click', function () {
        navigate(me.name || 'Bạn', dashboardOf(me.gender));
      });

      if (me.partner_id) {
        var partnerBtn = document.getElementById('btnGoPartner');
        partnerBtn.style.display = 'block';
        partnerBtn.addEventListener('click', function () {
          sb().from('profiles').select('*').eq('id', me.partner_id).maybeSingle().then(function (pRes) {
            var pName = (pRes.data && pRes.data.name) || 'đối tác';
            var pGender = (pRes.data && pRes.data.gender) || (me.gender === 'male' ? 'female' : 'male');
            navigate(pName, dashboardOf(pGender) + '?view=partner');
          });
        });
      }

      document.getElementById('btnLogout').addEventListener('click', function () {
        sb().auth.signOut().then(function () { window.location.reload(); });
      });
    });
  }).catch(function () {});
}
checkExistingSession();

})();
