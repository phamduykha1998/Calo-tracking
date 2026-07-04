// ============================================================================
//  db.js (hệ NAM) — Lớp dữ liệu. Giữ NGUYÊN giao diện cũ (getProfile, upsertLog…)
//  nhưng "ruột" đã đổi từ SQLite-WASM sang Supabase (Postgres đám mây).
//  Nhờ giữ interface, app.js + toàn bộ engine không cần sửa gì thêm.
//
//  Cách hoạt động: DB._boot(ownerId) nạp 1 LẦN lúc trang mở (hồ sơ + mọi ngày +
//  snapshot của "ownerId" — chính mình, hoặc đối tác nếu đang ở chế độ chỉ-xem)
//  vào bộ nhớ RAM. Các hàm đọc (getProfile/getLogs/...) đọc thẳng từ RAM nên
//  VẪN ĐỒNG BỘ như trước — refresh()/render() trong app.js không cần await.
//  Các hàm ghi cập nhật RAM ngay (UI phản hồi tức thì) rồi gửi lên Supabase ở
//  nền (không chặn UI), tương tự cơ chế "ghi rồi lưu nền" của bản SQLite cũ.
// ============================================================================
(function () {
  var _ownerId = null;
  var _profile = null;   // object đã gộp {..data, name, gender}
  var _logs = [];         // mảng log, sắp theo ngày tăng dần
  var _snaps = [];

  function sb() { return window.supabaseClient; }
  function readOnly() { return !!window.VITAL_READONLY; }

  function mergeProfileRow(row) {
    if (!row) return null;
    var p = Object.assign({}, row.data || {});
    p.name = row.name;
    p.gender = row.gender;
    return p;
  }
  function splitProfileForRow(p) {
    var rest = Object.assign({}, p);
    var name = rest.name; var gender = rest.gender;
    delete rest.name; delete rest.gender;
    return { name: name || 'Bạn', gender: gender || 'male', data: rest };
  }

  const DB = {
    today() {
      const d = new Date(); // dùng giờ ĐỊA PHƯƠNG (tránh lệch ngày do UTC)
      return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    },

    // Nạp toàn bộ dữ liệu của "ownerId" từ Supabase vào RAM — gọi 1 lần lúc boot.
    async _boot(ownerId) {
      _ownerId = ownerId;
      const [profRes, logRes, snapRes] = await Promise.all([
        sb().from('profiles').select('*').eq('id', ownerId).maybeSingle(),
        sb().from('logs').select('date,data').eq('owner_id', ownerId).order('date'),
        sb().from('snapshots').select('date,data').eq('owner_id', ownerId).order('date')
      ]);
      if (profRes.error) console.error('VITAL: lỗi tải hồ sơ', profRes.error);
      if (logRes.error) console.error('VITAL: lỗi tải nhật ký', logRes.error);
      if (snapRes.error) console.error('VITAL: lỗi tải snapshot', snapRes.error);
      _profile = mergeProfileRow(profRes.data);
      _logs = (logRes.data || []).map(r => r.data);
      _snaps = (snapRes.data || []).map(r => r.data);
    },

    getProfile() { return _profile; },
    saveProfile(p) {
      if (!p.start_date) p.start_date = DB.today();
      _profile = Object.assign({}, p);
      if (readOnly()) return p;
      const row = splitProfileForRow(p);
      sb().from('profiles').upsert({ id: _ownerId, name: row.name, gender: row.gender, data: row.data })
        .then(r => { if (r.error) console.error('VITAL: lỗi lưu hồ sơ', r.error); });
      return p;
    },
    hasProfile() { return DB.getProfile() !== null; },

    getLogs() { return _logs.slice(); },
    getLog(date) { return _logs.find(l => l.date === date) || null; },
    getTodayLog() { return DB.getLog(DB.today()) || DB._blankLog(DB.today()); },
    _blankLog(date) {
      return {
        date,
        weight_morning: null,
        foods: [],
        acts: [],
        activity: { steps: 0, minutes: 0, type: '' },
        recovery: { sleep_hours: null, water_ml: 0, stress: null }
      };
    },
    upsertLog(log) {
      const i = _logs.findIndex(l => l.date === log.date);
      if (i >= 0) _logs[i] = log; else { _logs.push(log); _logs.sort((a, b) => a.date < b.date ? -1 : 1); }
      if (!readOnly()) {
        sb().from('logs').upsert({ owner_id: _ownerId, date: log.date, data: log }, { onConflict: 'owner_id,date' })
          .then(r => { if (r.error) console.error('VITAL: lỗi lưu nhật ký', r.error); });
      }
      return log;
    },

    getSnaps() { return _snaps.slice(); },
    saveSnap(snap) {
      const i = _snaps.findIndex(s => s.date === snap.date);
      if (i >= 0) _snaps[i] = snap; else _snaps.push(snap);
      if (!readOnly()) {
        sb().from('snapshots').upsert({ owner_id: _ownerId, date: snap.date, data: snap }, { onConflict: 'owner_id,date' })
          .then(r => { if (r.error) console.error('VITAL: lỗi lưu snapshot', r.error); });
      }
      return snap;
    },

    weightDays() { return DB.getLogs().filter(l => l.weight_morning != null).length; },
    daysElapsed() {
      const p = DB.getProfile();
      if (!p || !p.start_date) return 0;
      const ms = new Date(DB.today()) - new Date(p.start_date);
      return Math.max(0, Math.round(ms / 86400000));
    },

    seed(profile, logs) {
      if (readOnly()) return;
      if (profile) DB.saveProfile(profile);
      if (logs) logs.forEach(l => DB.upsertLog(l));
    },
    async clearAll() {
      if (readOnly()) return;
      _profile = null; _logs = []; _snaps = [];
      const [r1, r2, r3] = await Promise.all([
        sb().from('profiles').delete().eq('id', _ownerId),
        sb().from('logs').delete().eq('owner_id', _ownerId),
        sb().from('snapshots').delete().eq('owner_id', _ownerId)
      ]);
      if (r1.error) console.error('VITAL: lỗi xoá hồ sơ', r1.error);
      if (r2.error) console.error('VITAL: lỗi xoá nhật ký', r2.error);
      if (r3.error) console.error('VITAL: lỗi xoá snapshot', r3.error);
    }
  };

  if (typeof window !== 'undefined') window.DB = DB;
  if (typeof module !== 'undefined' && module.exports) module.exports = DB;
})();
