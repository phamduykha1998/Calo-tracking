// ============================================================================
//  seed.js — NẠP DỮ LIỆU MẪU vào DB:
//    • 497 món ăn  (từ H.Phuc/js/food_db.js)
//    • 213 hoạt động (từ H.Phuc/js/act_db.js)
//    • 2 hồ sơ: Phúc (nam) & Ngọc Anh (nữ)
//  Chạy:  node server/db/seed.js   (chạy migrate trước)
//
//  Kỹ thuật học được ở đây:
//    • TRANSACTION: gói nhiều INSERT thành 1 khối — nhanh hơn ~100 lần và
//      "all-or-nothing" (lỗi giữa chừng thì rollback, DB không bị nửa vời).
//    • INSERT OR REPLACE: nạp lại không bị lỗi trùng khóa (idempotent).
// ============================================================================
const path = require('path');
const { openDb } = require('./connect.js');

// Lấy dữ liệu gốc từ file JS hiện có của app (chúng export cho Node sẵn).
const ROOT = path.join(__dirname, '..', '..');
const { FOOD_DB } = require(path.join(ROOT, 'H.Phuc', 'js', 'food_db.js'));
const { ACT_DB } = require(path.join(ROOT, 'H.Phuc', 'js', 'act_db.js'));

const db = openDb();

// --- 1) foods --------------------------------------------------------------
const insFood = db.prepare(`
  INSERT OR REPLACE INTO foods (id,name,kcal,protein,carb,fat,fiber,sugar,serving,unit,processed)
  VALUES (?,?,?,?,?,?,?,?,?,?,?)
`);
db.exec('BEGIN');
for (const f of FOOD_DB) {
  insFood.run(
    f.id, f.name,
    f.kcal || 0, f.protein || 0, f.carb || 0, f.fat || 0,
    f.fiber || 0, f.sugar || 0, f.serving || 1, f.unit || '', f.processed || 0
  );
}
db.exec('COMMIT');

// --- 2) activities ---------------------------------------------------------
const insAct = db.prepare('INSERT OR REPLACE INTO activities (id,name,met,icon) VALUES (?,?,?,?)');
db.exec('BEGIN');
for (const a of ACT_DB) insAct.run(a.id, a.name, a.met || 0, a.icon || '');
db.exec('COMMIT');

// --- 3) users (2 hồ sơ) ----------------------------------------------------
const insUser = db.prepare(`
  INSERT OR IGNORE INTO users
    (slug,name,gender,age,height_cm,current_weight,target_weight,goal_type,activity_level,deadline_days)
  VALUES (@slug,@name,@gender,@age,@height_cm,@current_weight,@target_weight,@goal_type,@activity_level,@deadline_days)
`);
insUser.run({
  slug: 'phuc', name: 'Phúc', gender: 'male',
  age: 30, height_cm: 172, current_weight: 75, target_weight: 70,
  goal_type: 'lose_fat', activity_level: 'moderate', deadline_days: 90,
});
insUser.run({
  slug: 'anh', name: 'Ngọc Anh', gender: 'female',
  age: 27, height_cm: 160, current_weight: 60, target_weight: 55,
  goal_type: 'lose_fat', activity_level: 'light', deadline_days: 90,
});

// --- Báo cáo ---------------------------------------------------------------
const count = (t) => db.prepare(`SELECT COUNT(*) n FROM ${t}`).get().n;
console.log('✅ Seed xong:');
console.log('   foods     :', count('foods'));
console.log('   activities:', count('activities'));
console.log('   users     :', count('users'));
db.close();
