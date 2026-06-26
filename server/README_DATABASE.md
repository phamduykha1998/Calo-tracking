# VITAL — Database (SQLite) · Hướng dẫn cho người mới

Tài liệu này giải thích **database vừa được build** theo cách dễ hiểu nhất, và cách bạn tự nghịch để học.

---

## 1. Database này là cái gì?

Trước đây app lưu dữ liệu trong **localStorage** của trình duyệt — chỉ nằm trên đúng 1 máy, 1 trình duyệt, dễ mất, không truy vấn được.

Giờ ta thay bằng **SQLite** — một database quan hệ (SQL) thực thụ, nhưng gọn nhẹ: **toàn bộ database là 1 file duy nhất** `server/db/vital.db`. Không cần cài server riêng. Node 24 đã có sẵn SQLite (`node:sqlite`) nên **không phải cài thư viện nào**.

```
Trình duyệt  ──HTTP──►  server.js (API)  ──SQL──►  vital.db (file SQLite)
   (app web)              Node.js                    (dữ liệu thật)
```

---

## 2. Cách chạy (3 lệnh)

Mở terminal trong thư mục dự án:

```bash
npm run migrate   # tạo các bảng (chạy 1 lần)
npm run seed      # nạp 497 món ăn + 213 hoạt động + 2 hồ sơ
npm start         # bật web server → mở http://localhost:3000
```

Hoặc gộp tạo + nạp: `npm run setup`.

> Muốn làm lại từ đầu? Xóa 3 file `server/db/vital.db*` rồi chạy lại `npm run setup`.

---

## 3. Các khái niệm database (qua chính dữ liệu của bạn)

| Khái niệm | Nghĩa đời thường | Ví dụ trong DB này |
|---|---|---|
| **Bảng (table)** | 1 tờ Excel | `users`, `foods`, `daily_logs` |
| **Dòng (row)** | 1 bản ghi | 1 món ăn, 1 ngày nhật ký |
| **Cột (column)** | 1 trường dữ liệu | `kcal`, `protein`, `date` |
| **Khóa chính (PK)** | số định danh duy nhất | `users.id` = 1 (Phúc), 2 (Ngọc Anh) |
| **Khóa ngoại (FK)** | trỏ sang bảng khác | `daily_logs.user_id` → `users.id` |
| **Quan hệ 1–nhiều** | 1 cha, nhiều con | 1 user → nhiều ngày log → nhiều món/ngày |
| **UNIQUE** | cấm trùng | mỗi user chỉ 1 log/ngày |
| **INDEX** | mục lục tra nhanh | tìm log theo (user, ngày) |
| **TRANSACTION** | "tất cả hoặc không gì cả" | lưu 1 ngày = ghi log + nhiều món cùng lúc |

### Sơ đồ quan hệ giữa các bảng

```
users ──1:N──► daily_logs ──1:N──► food_entries      ──N:1──► foods   (danh mục)
   │                 └────1:N──► activity_entries  ──N:1──► activities (danh mục)
   ├──1:N──► cycles        (chu kỳ kinh nguyệt — hệ nữ)
   └──1:N──► snapshots     (kết quả engine, lưu JSON)
```

Đọc: *một* user có *nhiều* ngày log; *một* ngày log có *nhiều* món ăn; *mỗi* món ăn tham chiếu về *một* dòng trong danh mục `foods`.

8 bảng: `users`, `foods`, `activities`, `daily_logs`, `food_entries`, `activity_entries`, `cycles`, `snapshots`. Chi tiết từng cột xem file có comment: [`server/db/schema.sql`](db/schema.sql).

---

## 4. Tự nghịch để học — viết SQL trực tiếp

Mở "shell SQL" ngay trong Node (không cài gì thêm):

```bash
node
```
```js
const { openDb } = require('./server/db/connect.js');
const db = openDb();

// Đếm số món ăn
db.prepare('SELECT COUNT(*) n FROM foods').get();           // { n: 497 }

// Tìm 5 món nhiều protein nhất  → học ORDER BY, LIMIT
db.prepare('SELECT name, protein FROM foods ORDER BY protein DESC LIMIT 5').all();

// JOIN: liệt kê món đã ăn của Phúc kèm tên hồ sơ  → học JOIN nhiều bảng
db.prepare(`
  SELECT u.name AS nguoi, d.date AS ngay, fe.name AS mon, fe.kcal
  FROM food_entries fe
  JOIN daily_logs d  ON fe.log_id = d.id
  JOIN users u       ON d.user_id = u.id
  WHERE u.slug = 'phuc'
`).all();

// Tổng calo nạp mỗi ngày của Phúc  → học GROUP BY + SUM
db.prepare(`
  SELECT d.date, SUM(fe.kcal * fe.qty) AS tong_calo
  FROM daily_logs d
  JOIN food_entries fe ON fe.log_id = d.id
  WHERE d.user_id = 1
  GROUP BY d.date
`).all();
```

> Mẹo: muốn xem DB bằng giao diện đồ họa, tải **"DB Browser for SQLite"** (miễn phí) rồi mở file `server/db/vital.db` — click chuột là xem được mọi bảng.

---

## 5. API có sẵn (server.js)

| Method | Đường dẫn | Việc |
|---|---|---|
| GET | `/api/users` | danh sách hồ sơ |
| GET | `/api/users/phuc` | 1 hồ sơ |
| PUT | `/api/users/phuc` | sửa hồ sơ |
| GET | `/api/foods?q=phở` | tìm món theo tên |
| GET | `/api/activities` | danh mục hoạt động |
| GET | `/api/users/phuc/logs` | tất cả nhật ký |
| GET | `/api/users/phuc/logs/2026-06-26` | nhật ký 1 ngày |
| PUT | `/api/users/phuc/logs/2026-06-26` | lưu nhật ký 1 ngày (log + món + hoạt động) |
| DELETE | `/api/users/phuc/logs/2026-06-26` | xóa nhật ký ngày |
| GET/POST | `/api/users/anh/cycles` | chu kỳ kinh nguyệt (hệ nữ) |

Thử nhanh bằng trình duyệt: mở http://localhost:3000/api/users

---

## 6. Cấu trúc thư mục

```
server/
├── db/
│   ├── schema.sql     ← định nghĩa 8 bảng (đọc file này để hiểu cấu trúc)
│   ├── connect.js     ← mở kết nối tới vital.db
│   ├── migrate.js     ← tạo bảng từ schema.sql
│   ├── seed.js        ← nạp dữ liệu mẫu
│   └── vital.db       ← (tự sinh) chính là DATABASE của bạn
├── server.js          ← REST API + phục vụ web
└── README_DATABASE.md ← file này
```

---

## 7. Bước tiếp theo (chưa làm)

Backend + database đã xong và chạy được. **Phần chưa làm:** sửa frontend (`H.Phuc/`, `N.Anh/`) để gọi API này thay cho `localStorage`. Khi đó dữ liệu sẽ lưu vào DB thật và đồng bộ giữa các thiết bị. Nói mình biết khi bạn muốn làm bước này.
