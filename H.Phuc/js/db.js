// ============================================================================
//  db.js (hệ NAM) — Lớp dữ liệu. Giữ NGUYÊN giao diện cũ (getProfile, upsertLog…)
//  nhưng "ruột" đã đổi từ localStorage sang SQLite-WASM (xem shared/vital-sqlite.js).
//  Nhờ giữ interface, toàn bộ engine + app.js không cần sửa.
//
//  Dữ liệu 1 hồ sơ lưu dạng JSON trong bảng `profile` / `logs` / `snapshots`,
//  phân biệt theo cột `user` (ở đây = 'phuc').
// ============================================================================
(function () {
  function U() { return (window.VitalSQL && window.VitalSQL.user) || 'phuc'; }
  function Q() { return window.VitalSQL; } // helper SQL đồng bộ (lấy lúc gọi)

  const DB = {
    today() {
      const d = new Date(); // dùng giờ ĐỊA PHƯƠNG (tránh lệch ngày do UTC)
      return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    },

    getProfile() {
      const r = Q().get('SELECT json FROM profile WHERE user=?', [U()]);
      return r ? JSON.parse(r.json) : null;
    },
    saveProfile(p) {
      if (!p.start_date) p.start_date = DB.today();
      Q().run('INSERT OR REPLACE INTO profile (user,json) VALUES (?,?)', [U(), JSON.stringify(p)]);
      return p;
    },
    hasProfile() { return DB.getProfile() !== null; },

    getLogs() {
      return Q().all('SELECT json FROM logs WHERE user=? ORDER BY date', [U()])
        .map(r => JSON.parse(r.json));
    },
    getLog(date) {
      const r = Q().get('SELECT json FROM logs WHERE user=? AND date=?', [U(), date]);
      return r ? JSON.parse(r.json) : null;
    },
    getTodayLog() {
      return DB.getLog(DB.today()) || DB._blankLog(DB.today());
    },
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
      Q().run('INSERT OR REPLACE INTO logs (user,date,json) VALUES (?,?,?)', [U(), log.date, JSON.stringify(log)]);
      return log;
    },

    getSnaps() {
      return Q().all('SELECT json FROM snapshots WHERE user=? ORDER BY date', [U()])
        .map(r => JSON.parse(r.json));
    },
    saveSnap(snap) {
      Q().run('INSERT OR REPLACE INTO snapshots (user,date,json) VALUES (?,?,?)', [U(), snap.date, JSON.stringify(snap)]);
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
      if (profile) DB.saveProfile(profile);
      if (logs) logs.forEach(l => DB.upsertLog(l));
    },
    clearAll() {
      Q().run('DELETE FROM profile WHERE user=?', [U()]);
      Q().run('DELETE FROM logs WHERE user=?', [U()]);
      Q().run('DELETE FROM snapshots WHERE user=?', [U()]);
    }
  };

  if (typeof window !== 'undefined') window.DB = DB;
  if (typeof module !== 'undefined' && module.exports) module.exports = DB;
})();
