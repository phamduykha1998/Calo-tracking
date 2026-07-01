// ============================================================================
//  vital-sqlite.js — SQLite chạy NGAY TRONG TRÌNH DUYỆT (sql.js / WebAssembly)
//  Dữ liệu lưu vào IndexedDB của thiết bị → không cần server, chạy offline.
//
//  Ý tưởng cốt lõi:
//    • sql.js nạp 1 file .wasm (~660KB) → có 1 "database SQLite" sống trong RAM.
//    • Mọi truy vấn SQL chạy ĐỒNG BỘ trong RAM (nhanh, không async).
//    • Sau mỗi lần ghi, ta "xuất" toàn bộ DB ra mảng byte rồi lưu vào IndexedDB
//      (bất đồng bộ, gộp nhịp 300ms). Mở lại app → nạp byte đó ra → còn nguyên.
//
//  Cách dùng:
//    await VitalSQL.init();           // 1 lần lúc app khởi động
//    VitalSQL.run('INSERT ...', []);  // ghi (tự lên lịch lưu)
//    VitalSQL.all('SELECT ...', []);  // đọc nhiều dòng → mảng object
//    VitalSQL.get('SELECT ...', []);  // đọc 1 dòng → object | null
// ============================================================================
(function () {
  'use strict';

  // Ghi nhớ vị trí file này để tìm ra thư mục vendor/sqljs/ dù trang ở cấp nào.
  var SELF = document.currentScript ? document.currentScript.src : location.href;
  var WASM_DIR = new URL('../vendor/sqljs/', SELF).href;

  var IDB_NAME = 'vital-store';   // tên IndexedDB
  var IDB_STORE = 'kv';           // object store dạng key-value
  var IDB_KEY = 'vital-db';       // 1 khóa chứa toàn bộ file SQLite

  // Schema cho bản chạy trong trình duyệt.
  // Dữ liệu người dùng lưu dạng JSON (giữ đúng cấu trúc engine đang dùng);
  // danh mục foods/activities là bảng quan hệ thật để truy vấn/học SQL.
  var SCHEMA = [
    'CREATE TABLE IF NOT EXISTS profile  (user TEXT PRIMARY KEY, json TEXT NOT NULL);',
    'CREATE TABLE IF NOT EXISTS logs      (user TEXT NOT NULL, date TEXT NOT NULL, json TEXT NOT NULL, PRIMARY KEY(user,date));',
    'CREATE TABLE IF NOT EXISTS snapshots (user TEXT NOT NULL, date TEXT NOT NULL, json TEXT NOT NULL, PRIMARY KEY(user,date));',
    'CREATE TABLE IF NOT EXISTS foods (id TEXT PRIMARY KEY, name TEXT, kcal REAL, protein REAL, carb REAL, fat REAL, fiber REAL, sugar REAL, serving REAL, unit TEXT, processed INTEGER);',
    // Món do NGƯỜI DÙNG tự thêm (mỗi hồ sơ 1 danh mục riêng) → tìm lại được ở lần sau.
    'CREATE TABLE IF NOT EXISTS custom_foods (user TEXT NOT NULL, id TEXT NOT NULL, json TEXT NOT NULL, PRIMARY KEY(user,id));',
    'CREATE TABLE IF NOT EXISTS activities (id TEXT PRIMARY KEY, name TEXT, met REAL, icon TEXT);',
    'CREATE INDEX IF NOT EXISTS idx_logs_user_date ON logs(user,date);',
    'CREATE INDEX IF NOT EXISTS idx_foods_name ON foods(name);'
  ].join('\n');

  var db = null;          // đối tượng sql.js Database (sống trong RAM)
  var _readyPromise = null;
  var _saveTimer = null;

  // --- IndexedDB tối giản (nơi lưu file SQLite dưới dạng byte) --------------
  function idbOpen() {
    return new Promise(function (resolve, reject) {
      var req = indexedDB.open(IDB_NAME, 1);
      req.onupgradeneeded = function () { req.result.createObjectStore(IDB_STORE); };
      req.onsuccess = function () { resolve(req.result); };
      req.onerror = function () { reject(req.error); };
    });
  }
  function idbGet(key) {
    return idbOpen().then(function (d) {
      return new Promise(function (resolve, reject) {
        var tx = d.transaction(IDB_STORE, 'readonly').objectStore(IDB_STORE).get(key);
        tx.onsuccess = function () { resolve(tx.result || null); };
        tx.onerror = function () { reject(tx.error); };
      });
    });
  }
  function idbPut(key, val) {
    return idbOpen().then(function (d) {
      return new Promise(function (resolve, reject) {
        var tx = d.transaction(IDB_STORE, 'readwrite').objectStore(IDB_STORE).put(val, key);
        tx.onsuccess = function () { resolve(); };
        tx.onerror = function () { reject(tx.error); };
      });
    });
  }

  // --- Lưu DB ra IndexedDB (gộp nhịp để không lưu liên tục) -----------------
  function schedulePersist() {
    clearTimeout(_saveTimer);
    _saveTimer = setTimeout(flush, 300);
  }
  function flush() {
    if (!db) return Promise.resolve();
    clearTimeout(_saveTimer);
    try { return idbPut(IDB_KEY, db.export()); }
    catch (e) { console.error('VitalSQL persist lỗi:', e); return Promise.resolve(); }
  }

  // --- Nạp danh mục món ăn / hoạt động (1 lần, nếu bảng còn rỗng) -----------
  function seedCatalog() {
    var n = get('SELECT COUNT(*) AS n FROM foods');
    if (n && n.n > 0) return; // đã seed rồi

    if (window.FOOD_DB && window.FOOD_DB.length) {
      db.run('BEGIN');
      var f = db.prepare('INSERT OR REPLACE INTO foods VALUES (?,?,?,?,?,?,?,?,?,?,?)');
      window.FOOD_DB.forEach(function (x) {
        f.run([x.id, x.name, x.kcal || 0, x.protein || 0, x.carb || 0, x.fat || 0,
               x.fiber || 0, x.sugar || 0, x.serving || x.qty || 1, x.unit || '', x.processed || 0]);
      });
      f.free();
      db.run('COMMIT');
    }
    if (window.ACT_DB && window.ACT_DB.length) {
      db.run('BEGIN');
      var a = db.prepare('INSERT OR REPLACE INTO activities VALUES (?,?,?,?)');
      window.ACT_DB.forEach(function (x) { a.run([x.id, x.name, x.met || 0, x.icon || '']); });
      a.free();
      db.run('COMMIT');
    }
    schedulePersist();
  }

  // --- Helper truy vấn ĐỒNG BỘ ---------------------------------------------
  function run(sql, params) {
    db.run(sql, params || []);
    schedulePersist();
  }
  function all(sql, params) {
    var stmt = db.prepare(sql);
    if (params) stmt.bind(params);
    var rows = [];
    while (stmt.step()) rows.push(stmt.getAsObject());
    stmt.free();
    return rows;
  }
  function get(sql, params) {
    var r = all(sql, params);
    return r.length ? r[0] : null;
  }

  // --- Khởi tạo ------------------------------------------------------------
  function init(opts) {
    if (_readyPromise) return _readyPromise; // chỉ init 1 lần
    VitalSQL.user = (opts && opts.user) || 'default';

    _readyPromise = initSqlJs({ locateFile: function (file) { return WASM_DIR + file; } })
      .then(function (SQL) {
        return idbGet(IDB_KEY).then(function (saved) {
          db = saved ? new SQL.Database(new Uint8Array(saved)) : new SQL.Database();
          db.run(SCHEMA);   // tạo bảng nếu chưa có (idempotent)
          seedCatalog();    // nạp danh mục nếu rỗng

          // Lưu nốt khi rời trang / ẩn tab (an toàn trên điện thoại).
          window.addEventListener('pagehide', flush);
          window.addEventListener('visibilitychange', function () {
            if (document.visibilityState === 'hidden') flush();
          });

          // Xin "lưu trữ bền vững" → hệ điều hành không tự xoá dữ liệu khi thiếu chỗ.
          if (navigator.storage && navigator.storage.persist) {
            navigator.storage.persist().catch(function () {});
          }

          if (!saved) return flush(); // lần đầu: lưu DB mới tạo
        });
      })
      .catch(function (e) { console.error('VitalSQL.init lỗi:', e); throw e; });

    return _readyPromise;
  }

  window.VitalSQL = {
    init: init,
    run: run,
    all: all,
    get: get,
    flush: flush,
    user: 'default',
    raw: function () { return db; } // truy cập sql.js Database thô (để nghịch/học)
  };
})();
