// ============================================================================
//  keyboard-fix.js — Sửa lỗi bàn phím che ô nhập trên điện thoại (nhất là iOS).
//  Vấn đề: position:fixed neo đáy màn hình KHÔNG tự co khi bàn phím ảo hiện lên,
//  nên modal/ô nhập bị bàn phím che, người dùng không thấy đang gõ gì.
//
//  Cách xử lý:
//   1) Dùng VisualViewport API tính chiều cao bàn phím → đặt biến CSS --kb.
//      CSS dùng --kb để ĐẨY modal/sheet lên đúng phía trên bàn phím.
//   2) Khi focus 1 ô nhập (trên màn hình nhỏ), tự CUỘN ô đó vào giữa vùng nhìn.
// ============================================================================
(function () {
  'use strict';

  // 1) Theo dõi chiều cao bàn phím qua VisualViewport ----------------------
  var vv = window.visualViewport;
  if (vv) {
    var setKb = function () {
      // Phần màn hình bị bàn phím (và thanh công cụ) chiếm = innerHeight - vùng nhìn thực.
      var kb = Math.max(0, Math.round(window.innerHeight - vv.height - vv.offsetTop));
      document.documentElement.style.setProperty('--kb', kb + 'px');
    };
    vv.addEventListener('resize', setKb);
    vv.addEventListener('scroll', setKb);
    setKb();
  }

  // 2) Cuộn ô đang gõ vào tầm nhìn (chỉ trên màn hình nhỏ — tránh giật ở desktop)
  var isSmall = window.matchMedia('(max-width: 820px)').matches;
  document.addEventListener('focusin', function (e) {
    var t = e.target;
    if (!t || !/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
    if (!isSmall) return;
    // Chờ bàn phím trượt lên (~0.3s) rồi mới cuộn cho chuẩn vị trí.
    setTimeout(function () {
      try { t.scrollIntoView({ block: 'center', behavior: 'smooth' }); } catch (_) {}
    }, 300);
  });
})();
