// ============================================================================
//  migrate.js — TẠO BẢNG. Đọc schema.sql rồi chạy 1 lần để dựng cấu trúc DB.
//  Chạy:  node server/db/migrate.js
// ============================================================================
const fs = require('fs');
const path = require('path');
const { openDb, DB_PATH } = require('./connect.js');

const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');

const db = openDb();
db.exec(schema); // chạy toàn bộ các CREATE TABLE / CREATE INDEX

// Liệt kê bảng vừa tạo để xác nhận.
const tables = db
  .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name")
  .all()
  .map((r) => r.name);

console.log('✅ Đã tạo DB tại:', DB_PATH);
console.log('   Bảng:', tables.join(', '));
db.close();
