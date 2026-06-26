-- ============================================================================
--  VITAL — SCHEMA (sơ đồ cơ sở dữ liệu)
--  File này định nghĩa TẤT CẢ các bảng. Đọc từ trên xuống là hiểu cấu trúc DB.
--
--  Khái niệm nền tảng (đọc 1 lần):
--    • BẢNG (table)        = 1 "tờ excel": có cột (column) và dòng (row).
--    • KHÓA CHÍNH (PK)     = cột định danh duy nhất 1 dòng (như số CMND).
--    • KHÓA NGOẠI (FK)     = cột trỏ tới PK của bảng khác → tạo "quan hệ".
--    • QUAN HỆ 1-NHIỀU     = 1 user có NHIỀU ngày log; 1 ngày có NHIỀU món ăn.
--    • UNIQUE              = không cho trùng (vd: 1 user chỉ 1 log/ngày).
--    • INDEX               = "mục lục" giúp tìm nhanh, khỏi quét cả bảng.
--
--  Quy ước kiểu dữ liệu trong SQLite:
--    INTEGER = số nguyên | REAL = số thực | TEXT = chuỗi
--    SQLite KHÔNG có kiểu DATE/BOOLEAN riêng → ngày lưu TEXT 'YYYY-MM-DD',
--    boolean lưu INTEGER 0/1.
-- ============================================================================

-- Bật kiểm tra khóa ngoại (SQLite mặc định TẮT — phải bật mỗi kết nối).
PRAGMA foreign_keys = ON;


-- ----------------------------------------------------------------------------
-- 1) users — mỗi HỒ SƠ là 1 dòng (Phúc = nam, Ngọc Anh = nữ)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,  -- PK tự tăng 1,2,3...
  slug            TEXT    NOT NULL UNIQUE,             -- 'phuc' / 'anh' (URL-friendly)
  name            TEXT    NOT NULL,
  gender          TEXT    NOT NULL CHECK (gender IN ('male','female')),
  age             INTEGER,
  height_cm       REAL,
  current_weight  REAL,
  target_weight   REAL,
  goal_type       TEXT,        -- lose_fat / lose_weight / gain_muscle / recomp / maintain
  activity_level  TEXT,        -- sedentary / light / moderate / active / very_active
  deadline_days   INTEGER,     -- 30 / 60 / 90 / 180
  start_date      TEXT NOT NULL DEFAULT (date('now','localtime')),  -- ngày bắt đầu
  created_at      TEXT NOT NULL DEFAULT (datetime('now','localtime'))
);


-- ----------------------------------------------------------------------------
-- 2) foods — DANH MỤC món ăn (bảng tra cứu / reference). Dùng chung mọi user.
--    PK là 'slug' chữ (vd 'pho_bo_tai') vì dữ liệu gốc đã có id dạng này.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS foods (
  id         TEXT    PRIMARY KEY,   -- 'pho_bo_tai'
  name       TEXT    NOT NULL,      -- 'Phở Bò tái'
  kcal       REAL    NOT NULL DEFAULT 0,
  protein    REAL    NOT NULL DEFAULT 0,
  carb       REAL    NOT NULL DEFAULT 0,
  fat        REAL    NOT NULL DEFAULT 0,
  fiber      REAL    NOT NULL DEFAULT 0,
  sugar      REAL    NOT NULL DEFAULT 0,
  serving    REAL    NOT NULL DEFAULT 1,   -- phần ăn mặc định
  unit       TEXT,                          -- 'tô' / 'dĩa' / 'ổ'...
  processed  INTEGER NOT NULL DEFAULT 0     -- 0/1: đồ chế biến sẵn?
);


-- ----------------------------------------------------------------------------
-- 3) activities — DANH MỤC hoạt động + chỉ số MET (bảng tra cứu).
--    kcal đốt = MET × cân_nặng_kg × (phút / 60).
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS activities (
  id    TEXT    PRIMARY KEY,   -- 'act_001'
  name  TEXT    NOT NULL,      -- 'Ngủ'
  met   REAL    NOT NULL,      -- 0.95
  icon  TEXT
);


-- ----------------------------------------------------------------------------
-- 4) daily_logs — 1 dòng cho mỗi (user, ngày). Đây là "trang nhật ký" của 1 ngày.
--    UNIQUE(user_id, date): mỗi user chỉ có ĐÚNG 1 log/ngày.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS daily_logs (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id         INTEGER NOT NULL,
  date            TEXT    NOT NULL,        -- 'YYYY-MM-DD' (giờ địa phương)

  -- Cơ thể (cả hai hệ)
  weight_morning  REAL,                    -- cân buổi sáng
  sleep_hours     REAL,
  water_ml        INTEGER DEFAULT 0,
  steps           INTEGER DEFAULT 0,

  -- Riêng HỆ NỮ — số đo & cảm nhận (NULL với hệ nam là bình thường)
  waist_cm        REAL,                    -- vòng eo
  hip_cm          REAL,                    -- vòng hông
  energy          INTEGER,                 -- năng lượng /10
  mood            INTEGER,                 -- tâm trạng /10
  craving         INTEGER,                 -- độ thèm ăn /10
  stress          INTEGER,                 -- mức stress /10

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE (user_id, date)                   -- chống trùng ngày
);


-- ----------------------------------------------------------------------------
-- 5) food_entries — các MÓN đã ăn trong 1 ngày (quan hệ 1-nhiều với daily_logs).
--    Lưu ý thiết kế: ta CHỤP LẠI (snapshot) số liệu lúc ăn vào đây, vì người
--    dùng được sửa từng ô cho đúng phần ăn thật. food_id chỉ để "tham chiếu"
--    về danh mục gốc (có thể NULL nếu món tự thêm).
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS food_entries (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  log_id     INTEGER NOT NULL,
  food_id    TEXT,                          -- FK mềm tới foods.id (có thể NULL)
  name       TEXT    NOT NULL,
  kcal       REAL    NOT NULL DEFAULT 0,
  protein    REAL    NOT NULL DEFAULT 0,
  carb       REAL    NOT NULL DEFAULT 0,
  fat        REAL    NOT NULL DEFAULT 0,
  fiber      REAL    NOT NULL DEFAULT 0,
  sugar      REAL    NOT NULL DEFAULT 0,
  qty        REAL    NOT NULL DEFAULT 1,    -- số lượng phần (stepper ×0.5)
  processed  INTEGER NOT NULL DEFAULT 0,

  FOREIGN KEY (log_id)  REFERENCES daily_logs(id) ON DELETE CASCADE,
  FOREIGN KEY (food_id) REFERENCES foods(id)
);


-- ----------------------------------------------------------------------------
-- 6) activity_entries — các HOẠT ĐỘNG đã ghi trong 1 ngày (1-nhiều).
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS activity_entries (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  log_id       INTEGER NOT NULL,
  activity_id  TEXT,                        -- FK mềm tới activities.id
  name         TEXT    NOT NULL,
  met          REAL    NOT NULL DEFAULT 0,
  minutes      REAL    NOT NULL DEFAULT 0,
  kcal         REAL    NOT NULL DEFAULT 0,  -- đã tính sẵn, người dùng sửa được

  FOREIGN KEY (log_id)      REFERENCES daily_logs(id) ON DELETE CASCADE,
  FOREIGN KEY (activity_id) REFERENCES activities(id)
);


-- ----------------------------------------------------------------------------
-- 7) cycles — bản ghi CHU KỲ KINH NGUYỆT (chỉ hệ nữ). Lõi của VITAL-F.
--    Lưu nhiều chu kỳ để Engine tính độ đều & dự báo kỳ tiếp theo.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS cycles (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id        INTEGER NOT NULL,
  start_date     TEXT    NOT NULL,          -- ngày bắt đầu kỳ kinh
  period_length  INTEGER,                   -- số ngày hành kinh (vd 5)
  cycle_length   INTEGER,                   -- độ dài chu kỳ TB (vd 29)

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


-- ----------------------------------------------------------------------------
-- 8) snapshots — KẾT QUẢ engine đã tính, lưu dạng JSON (cột TEXT).
--    Minh hoạ cách lưu dữ liệu bán-cấu-trúc trong DB quan hệ.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS snapshots (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id   INTEGER NOT NULL,
  date      TEXT    NOT NULL,
  payload   TEXT    NOT NULL,               -- chuỗi JSON kết quả

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE (user_id, date)
);


-- ----------------------------------------------------------------------------
-- INDEX — "mục lục" tăng tốc các truy vấn hay dùng.
--   Không có index, DB phải quét từng dòng (chậm khi nhiều dữ liệu).
-- ----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_logs_user_date     ON daily_logs(user_id, date);
CREATE INDEX IF NOT EXISTS idx_food_entries_log   ON food_entries(log_id);
CREATE INDEX IF NOT EXISTS idx_act_entries_log    ON activity_entries(log_id);
CREATE INDEX IF NOT EXISTS idx_cycles_user        ON cycles(user_id, start_date);
CREATE INDEX IF NOT EXISTS idx_foods_name         ON foods(name);
