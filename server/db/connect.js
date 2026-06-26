// ============================================================================
//  connect.js — Mở 1 kết nối tới file SQLite và trả về object `db`.
//  Mọi file khác đều require file này để dùng chung 1 cách mở DB.
// ============================================================================
const { DatabaseSync } = require('node:sqlite'); // SQLite có SẴN trong Node 22.5+
const path = require('path');

// File DB nằm cùng thư mục: server/db/vital.db  (đây chính là "database")
const DB_PATH = path.join(__dirname, 'vital.db');

function openDb() {
  const db = new DatabaseSync(DB_PATH);

  // BẮT BUỘC bật mỗi kết nối — nếu không, FK ON DELETE CASCADE sẽ không chạy.
  db.exec('PRAGMA foreign_keys = ON;');

  // WAL = chế độ ghi nhanh & cho phép đọc trong lúc ghi (tốt cho web server).
  db.exec('PRAGMA journal_mode = WAL;');

  return db;
}

module.exports = { openDb, DB_PATH };
