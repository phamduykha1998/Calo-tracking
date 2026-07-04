// ============================================================================
//  vital-auth.js — helper dùng chung cho 2 trang dashboard (H.Phuc, N.Anh):
//  đọc phiên đăng nhập, đọc hồ sơ, xác định đang xem dữ liệu của AI (mình hay
//  đối tác) và có phải chế độ CHỈ-XEM hay không.
//  Trang index.html tự lo đăng nhập/đăng ký, không cần file này.
// ============================================================================
(function () {
  'use strict';

  function sb() { return window.supabaseClient; }

  async function getSession() {
    var r = await sb().auth.getSession();
    return (r.data && r.data.session) || null;
  }

  async function getProfile(id) {
    var r = await sb().from('profiles').select('*').eq('id', id).maybeSingle();
    if (r.error) { console.error('VITAL: lỗi tải hồ sơ', r.error); return null; }
    return r.data;
  }

  // homePath = đường dẫn về index.html ('../index.html' từ trang con).
  // Trả về null (và tự điều hướng về homePath) nếu chưa đăng nhập / chưa có hồ sơ.
  async function resolveViewContext(homePath) {
    var session = await getSession();
    if (!session) { window.location.href = homePath; return null; }
    var me = await getProfile(session.user.id);
    if (!me) { window.location.href = homePath; return null; }

    var params = new URLSearchParams(location.search);
    var wantPartner = params.get('view') === 'partner';
    var ownerId = (wantPartner && me.partner_id) ? me.partner_id : me.id;
    var readOnly = ownerId !== me.id;
    var ownerProfile = readOnly ? await getProfile(ownerId) : me;

    return { session: session, me: me, ownerId: ownerId, readOnly: readOnly, ownerProfile: ownerProfile };
  }

  // Trỏ sang dashboard của giới còn lại, ở chế độ chỉ-xem.
  function partnerHref(myGender) {
    return myGender === 'male' ? '../N.Anh/Anh_calo.html?view=partner' : '../H.Phuc/Phuc_calo.html?view=partner';
  }

  async function logout(homePath) {
    await sb().auth.signOut();
    window.location.href = homePath;
  }

  // Banner cố định đầu trang khi đang ở chế độ chỉ-xem dữ liệu đối tác.
  function mountReadOnlyBanner(name) {
    var el = document.createElement('div');
    el.className = 'vital-ro-banner';
    el.textContent = 'Đang xem dữ liệu của ' + name + ' · Chỉ xem, không chỉnh sửa được';
    var css = document.createElement('style');
    css.textContent =
      '.vital-ro-banner{position:fixed;top:0;left:0;right:0;z-index:400;' +
      'padding:calc(env(safe-area-inset-top,0px) + 8px) 14px 8px;text-align:center;' +
      'font-family:ui-monospace,monospace;font-size:11px;font-weight:700;letter-spacing:.02em;' +
      'background:rgba(244,63,94,.92);color:#fff;pointer-events:none}';
    document.head.appendChild(css);
    document.body.appendChild(el);
  }

  window.VitalAuth = {
    getSession: getSession,
    getProfile: getProfile,
    resolveViewContext: resolveViewContext,
    partnerHref: partnerHref,
    logout: logout,
    mountReadOnlyBanner: mountReadOnlyBanner
  };
})();
