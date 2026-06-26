// ============================================================================
//  server.js — REST API + phục vụ web tĩnh. KHÔNG dùng thư viện ngoài, chỉ
//  module có sẵn của Node (http, fs, path) + node:sqlite.
//  Chạy:  node server/server.js     →  http://localhost:3000
//
//  REST là gì (rút gọn): client gửi HTTP request tới 1 "đường dẫn" (URL) bằng
//  1 "động từ" (GET=đọc, POST=tạo, PUT=cập nhật, DELETE=xóa); server trả JSON.
// ============================================================================
const http = require('http');
const fs = require('fs');
const path = require('path');
const { openDb } = require('./db/connect.js');

const db = openDb();
const ROOT = path.join(__dirname, '..'); // thư mục gốc project (phục vụ HTML/CSS/JS)
const PORT = 3000;

// --- Tiện ích nhỏ ----------------------------------------------------------
const sendJson = (res, code, data) => {
  res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(data));
};
const readBody = (req) =>
  new Promise((resolve) => {
    let s = '';
    req.on('data', (c) => (s += c));
    req.on('end', () => { try { resolve(s ? JSON.parse(s) : {}); } catch { resolve({}); } });
  });

// Lấy user theo slug ('phuc'/'anh') hoặc id.
const getUser = (key) =>
  /^\d+$/.test(key)
    ? db.prepare('SELECT * FROM users WHERE id=?').get(Number(key))
    : db.prepare('SELECT * FROM users WHERE slug=?').get(key);

// Gom 1 log đầy đủ: dòng daily_logs + mảng foods + mảng acts (dùng JOIN ngầm).
function fullLog(userId, date) {
  const log = db.prepare('SELECT * FROM daily_logs WHERE user_id=? AND date=?').get(userId, date);
  if (!log) return null;
  log.foods = db.prepare('SELECT * FROM food_entries WHERE log_id=?').all(log.id);
  log.acts = db.prepare('SELECT * FROM activity_entries WHERE log_id=?').all(log.id);
  return log;
}

// Lưu (upsert) 1 log + thay toàn bộ entries — GÓI TRONG TRANSACTION.
function saveLog(userId, date, body) {
  db.exec('BEGIN');
  try {
    db.prepare(`
      INSERT INTO daily_logs (user_id,date,weight_morning,sleep_hours,water_ml,steps,
                              waist_cm,hip_cm,energy,mood,craving,stress)
      VALUES (@user_id,@date,@weight_morning,@sleep_hours,@water_ml,@steps,
              @waist_cm,@hip_cm,@energy,@mood,@craving,@stress)
      ON CONFLICT(user_id,date) DO UPDATE SET
        weight_morning=excluded.weight_morning, sleep_hours=excluded.sleep_hours,
        water_ml=excluded.water_ml, steps=excluded.steps, waist_cm=excluded.waist_cm,
        hip_cm=excluded.hip_cm, energy=excluded.energy, mood=excluded.mood,
        craving=excluded.craving, stress=excluded.stress
    `).run({
      user_id: userId, date,
      weight_morning: body.weight_morning ?? null,
      sleep_hours: body.sleep_hours ?? null,
      water_ml: body.water_ml ?? 0,
      steps: body.steps ?? 0,
      waist_cm: body.waist_cm ?? null, hip_cm: body.hip_cm ?? null,
      energy: body.energy ?? null, mood: body.mood ?? null,
      craving: body.craving ?? null, stress: body.stress ?? null,
    });

    const logId = db.prepare('SELECT id FROM daily_logs WHERE user_id=? AND date=?').get(userId, date).id;

    // Thay toàn bộ entries: xóa cũ → chèn mới (đơn giản & nhất quán).
    db.prepare('DELETE FROM food_entries WHERE log_id=?').run(logId);
    db.prepare('DELETE FROM activity_entries WHERE log_id=?').run(logId);

    const insF = db.prepare(`INSERT INTO food_entries
      (log_id,food_id,name,kcal,protein,carb,fat,fiber,sugar,qty,processed)
      VALUES (?,?,?,?,?,?,?,?,?,?,?)`);
    for (const f of body.foods || [])
      insF.run(logId, f.food_id || f.id || null, f.name, f.kcal||0, f.protein||0,
               f.carb||0, f.fat||0, f.fiber||0, f.sugar||0, f.qty||1, f.processed||0);

    const insA = db.prepare(`INSERT INTO activity_entries
      (log_id,activity_id,name,met,minutes,kcal) VALUES (?,?,?,?,?,?)`);
    for (const a of body.acts || [])
      insA.run(logId, a.activity_id || a.id || null, a.name, a.met||0, a.minutes||0, a.kcal||0);

    db.exec('COMMIT');
  } catch (e) {
    db.exec('ROLLBACK'); // lỗi giữa chừng → hủy hết, DB không nửa vời
    throw e;
  }
  return fullLog(userId, date);
}

// --- Định tuyến API --------------------------------------------------------
async function handleApi(req, res, parts, query) {
  const [a, b, c, d] = parts; // vd /api/users/phuc/logs → a=users b=phuc c=logs d=undefined

  // /api/foods?q=...  (tìm theo tên, LIKE đơn giản)
  if (a === 'foods' && req.method === 'GET') {
    const q = query.get('q');
    const rows = q
      ? db.prepare('SELECT * FROM foods WHERE name LIKE ? ORDER BY name LIMIT 50').all('%' + q + '%')
      : db.prepare('SELECT * FROM foods ORDER BY name LIMIT 100').all();
    return sendJson(res, 200, rows);
  }

  // /api/activities
  if (a === 'activities' && req.method === 'GET')
    return sendJson(res, 200, db.prepare('SELECT * FROM activities ORDER BY met').all());

  // /api/users ...
  if (a === 'users') {
    if (!b) {
      if (req.method === 'GET') return sendJson(res, 200, db.prepare('SELECT * FROM users').all());
      if (req.method === 'POST') {
        const u = await readBody(req);
        const info = db.prepare(`INSERT INTO users
          (slug,name,gender,age,height_cm,current_weight,target_weight,goal_type,activity_level,deadline_days)
          VALUES (@slug,@name,@gender,@age,@height_cm,@current_weight,@target_weight,@goal_type,@activity_level,@deadline_days)`)
          .run(u);
        return sendJson(res, 201, getUser(String(info.lastInsertRowid)));
      }
    }

    const user = getUser(b);
    if (!user) return sendJson(res, 404, { error: 'user not found' });

    // /api/users/:slug
    if (!c) {
      if (req.method === 'GET') return sendJson(res, 200, user);
      if (req.method === 'PUT') {
        const u = await readBody(req);
        db.prepare(`UPDATE users SET
          name=@name, age=@age, height_cm=@height_cm, current_weight=@current_weight,
          target_weight=@target_weight, goal_type=@goal_type, activity_level=@activity_level,
          deadline_days=@deadline_days WHERE id=@id`).run({ ...user, ...u, id: user.id });
        return sendJson(res, 200, getUser(b));
      }
    }

    // /api/users/:slug/logs[/ :date ]
    if (c === 'logs') {
      if (!d && req.method === 'GET') {
        const logs = db.prepare('SELECT date FROM daily_logs WHERE user_id=? ORDER BY date').all(user.id);
        return sendJson(res, 200, logs.map((l) => fullLog(user.id, l.date)));
      }
      if (d && req.method === 'GET')
        return sendJson(res, 200, fullLog(user.id, d) || { date: d, foods: [], acts: [] });
      if (d && req.method === 'PUT')
        return sendJson(res, 200, saveLog(user.id, d, await readBody(req)));
      if (d && req.method === 'DELETE') {
        db.prepare('DELETE FROM daily_logs WHERE user_id=? AND date=?').run(user.id, d);
        return sendJson(res, 200, { ok: true });
      }
    }

    // /api/users/:slug/cycles  (hệ nữ)
    if (c === 'cycles') {
      if (req.method === 'GET')
        return sendJson(res, 200, db.prepare('SELECT * FROM cycles WHERE user_id=? ORDER BY start_date').all(user.id));
      if (req.method === 'POST') {
        const cy = await readBody(req);
        const info = db.prepare(`INSERT INTO cycles (user_id,start_date,period_length,cycle_length)
          VALUES (?,?,?,?)`).run(user.id, cy.start_date, cy.period_length ?? null, cy.cycle_length ?? null);
        return sendJson(res, 201, db.prepare('SELECT * FROM cycles WHERE id=?').get(info.lastInsertRowid));
      }
    }
  }

  return sendJson(res, 404, { error: 'route not found' });
}

// --- Phục vụ file tĩnh (HTML/CSS/JS của app) -------------------------------
const MIME = { '.html':'text/html', '.css':'text/css', '.js':'text/javascript',
  '.json':'application/json', '.svg':'image/svg+xml', '.png':'image/png', '.ico':'image/x-icon' };

function serveStatic(req, res, pathname) {
  let rel = decodeURIComponent(pathname);
  if (rel === '/' || rel === '') rel = '/index.html';
  const file = path.join(ROOT, rel);
  if (!file.startsWith(ROOT)) return sendJson(res, 403, { error: 'forbidden' }); // chống path traversal
  fs.readFile(file, (err, buf) => {
    if (err) return sendJson(res, 404, { error: 'file not found' });
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
    res.end(buf);
  });
}

// --- Server ----------------------------------------------------------------
http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // cho phép gọi từ trình duyệt
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.writeHead(204); return res.end(); }

  const url = new URL(req.url, 'http://localhost');
  const parts = url.pathname.split('/').filter(Boolean);

  try {
    if (parts[0] === 'api') return await handleApi(req, res, parts.slice(1), url.searchParams);
    return serveStatic(req, res, url.pathname);
  } catch (e) {
    console.error(e);
    return sendJson(res, 500, { error: String(e.message || e) });
  }
}).listen(PORT, () => {
  console.log(`🚀 VITAL server chạy tại  http://localhost:${PORT}`);
  console.log(`   API thử:  http://localhost:${PORT}/api/users`);
});
