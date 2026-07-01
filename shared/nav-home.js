// ============================================================================
//  nav-home.js — Nút "quay lại" trên 2 trang hồ sơ (Phúc / Ngọc Anh).
//  Bấm nút → phủ một lớp màn (veil) mờ dần sang màu nền của trang index,
//  rồi mới chuyển về ../index.html. Nhờ vậy cảm giác như "chuyển cảnh"
//  liền mạch: trang chính tối đi → trang chọn hồ sơ hiện lên (index tự
//  fade-in). Không phụ thuộc View Transitions API nên chạy được mọi trình duyệt.
// ============================================================================
(function () {
  'use strict';

  var HOME = '../index.html';   // 2 trang hồ sơ đều nằm sâu 1 cấp
  var BG   = '#0B0F1A';         // = màu nền index (khớp theme-color) → nối cảnh mượt

  // --- Lớp phủ chuyển cảnh --------------------------------------------------
  var veil = document.createElement('div');
  veil.className = 'nav-veil';
  veil.setAttribute('aria-hidden', 'true');

  // --- Nút quay lại ---------------------------------------------------------
  var btn = document.createElement('button');
  btn.className = 'nav-home';
  btn.type = 'button';
  btn.setAttribute('aria-label', 'Quay lại chọn hồ sơ');
  btn.innerHTML =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>';

  // --- CSS tự chứa (nền mờ, hợp cả nền sáng lẫn tối) ------------------------
  var css = document.createElement('style');
  css.textContent =
    '.nav-home{position:fixed;top:calc(env(safe-area-inset-top,0px) + 10px);' +
    'left:calc(env(safe-area-inset-left,0px) + 12px);z-index:310;' +
    'width:38px;height:38px;display:flex;align-items:center;justify-content:center;' +
    'border-radius:50%;border:1px solid rgba(150,150,160,.28);' +
    'background:rgba(130,130,140,.16);backdrop-filter:blur(8px);' +
    '-webkit-backdrop-filter:blur(8px);color:currentColor;cursor:pointer;' +
    'opacity:.85;transition:transform .18s ease,opacity .18s ease;' +
    '-webkit-tap-highlight-color:transparent}' +
    '.nav-home:hover{opacity:1}' +
    '.nav-home:active{transform:scale(.9)}' +
    '.nav-home svg{width:20px;height:20px;display:block}' +
    '.nav-veil{position:fixed;inset:0;z-index:9999;background:' + BG + ';' +
    'opacity:0;pointer-events:none;transition:opacity .34s ease}' +
    '.nav-veil.show{opacity:1;pointer-events:auto}';

  function leave() {
    veil.classList.add('show');
    setTimeout(function () { window.location.href = HOME; }, 340);
  }

  btn.addEventListener('click', leave);

  function mount() {
    document.head.appendChild(css);
    document.body.appendChild(veil);
    document.body.appendChild(btn);
  }
  if (document.body) mount();
  else document.addEventListener('DOMContentLoaded', mount);
})();
